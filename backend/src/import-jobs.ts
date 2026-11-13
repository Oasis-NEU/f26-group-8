// plans.md Task JB2. Pulls internships from outside job sites into our jobs table.
//
// run it by hand:   cd backend  &&  npm run import-jobs
// it does NOT run when the server starts: "tsx watch" restarts the server every time you
// save a file, and each restart would call every job site again (and use up Adzuna's daily limit).
import { supabase } from './db.js';
import { fetchGreenhouse } from './job-sources/greenhouse.js';
import { fetchLever } from './job-sources/lever.js';
import type { ImportedJob, SourceResult } from './job-sources/shared.js';

// every source we import from. USAJOBS and Adzuna get added here once their keys are in secrets.env
const SOURCES: { name: ImportedJob['source']; fetchJobs: () => Promise<SourceResult> }[] = [
  { name: 'greenhouse', fetchJobs: fetchGreenhouse },
  { name: 'lever', fetchJobs: fetchLever },
];


// JB2b, for one source: fetch -> drop duplicate ids -> save -> close jobs the source took down.
// returns false if something went wrong, so we can report it at the end
async function importSource(name: string, fetchJobs: () => Promise<SourceResult>): Promise<boolean> {
  // every row saved in this run gets this exact time as last_seen_at.
  // afterwards, an open job from this source with an OLDER last_seen_at wasn't in
  // today's list, which means the company took it down.
  const runStartedAt = new Date().toISOString();

  const { jobs, allFetchesWorked } = await fetchJobs();

  // drop duplicate ids (keep the last one). Postgres refuses to save a batch that
  // has the same job in it twice ("ON CONFLICT DO UPDATE command cannot affect row a second time")
  const byId = new Map<string, ImportedJob>();
  for (const job of jobs) {
    byId.set(job.external_id, job);
  }
  const rows = [...byId.values()].map((job) => ({
    ...job,
    status: 'open',               // the company still lists it, so it's open (even if we closed it before)
    last_seen_at: runStartedAt,
  }));

  if (rows.length > 0) {
    // upsert = insert new jobs, update the ones we already have.
    // "already have" means same source + external_id: the unique rule in jobs.sql.
    // id and created_at aren't in the rows, so new jobs get their defaults and old jobs keep theirs.
    const { error } = await supabase
      .from('jobs')
      .upsert(rows, { onConflict: 'source,external_id' });

    if (error) {
      console.error(`${name}: saving failed`, error);
      return false;   // stop here: closing jobs now would close the ones we just failed to save
    }
  }

  if (!allFetchesWorked) {
    console.log(`${name}: saved ${rows.length} jobs. Some companies failed, so no old jobs were closed.`);
    return false;
  }

  // close this source's open jobs that weren't in today's list
  const { data: closed, error } = await supabase
    .from('jobs')
    .update({ status: 'closed' })
    .eq('source', name)
    .eq('status', 'open')
    .lt('last_seen_at', runStartedAt)
    .select('id');   // ask for the closed rows back, just so we can count them

  if (error) {
    console.error(`${name}: closing old jobs failed`, error);
    return false;
  }

  console.log(`${name}: saved ${rows.length} jobs, closed ${closed.length} that are gone`);
  return true;
}


// one source at a time, so the log stays readable and one failing source doesn't stop the rest
let everythingWorked = true;
for (const { name, fetchJobs } of SOURCES) {
  const worked = await importSource(name, fetchJobs);
  if (!worked) everythingWorked = false;
}

// a non-zero exit code tells the terminal (or a scheduler, later) that something went wrong
if (!everythingWorked) {
  process.exitCode = 1;
}
