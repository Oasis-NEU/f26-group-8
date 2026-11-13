// Greenhouse: a hiring site many companies use. Their job boards are public, no key needed,
// but each call only covers one company.
// docs: https://developers.greenhouse.io/job-board.html
import {
  fetchJson, isInternTitle, guessType, guessSetting, toDate, htmlToText, isWebLink,
  type ImportedJob, type SourceResult,
} from './shared.js';

// board tokens: the company's name in boards.greenhouse.io/<token>.
// checked 2026-11-13: each of these had at least 2 intern jobs listed.
// to add a company, add its token here (a wrong token just logs "HTTP 404").
const BOARDS = [
  'stripe', 'coinbase', 'lyft', 'pinterest', 'databricks',
  'samsara', 'figma', 'cloudflare', 'airbnb', 'datadog',
];

// only the fields we use (the real response has more)
type GreenhouseJob = {
  id: number;
  title: string;
  company_name: string | null;
  absolute_url: string;
  location: { name: string } | null;
  content: string | null;               // the description, as HTML with < > written as &lt; &gt;
  application_deadline: string | null;  // usually null
};


export async function fetchGreenhouse(): Promise<SourceResult> {
  const jobs: ImportedJob[] = [];
  let allFetchesWorked = true;

  // one company at a time (not all at once) so we don't flood their servers
  for (const board of BOARDS) {
    try {
      // content=true adds the description, which isn't included otherwise
      const body = (await fetchJson(
        `https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=true`
      )) as { jobs: GreenhouseJob[] };

      for (const job of body.jobs) {
        // "as { jobs: GreenhouseJob[] }" above only tells TypeScript what to expect.
        // nothing checks it while running, so skip a job that's missing what our table
        // requires, instead of letting one bad row make the whole save fail
        if (typeof job.id !== 'number' || typeof job.title !== 'string' || !isWebLink(job.absolute_url)) {
          continue;
        }
        if (isInternTitle(job.title)) {
          jobs.push(toImportedJob(job, board));
        }
      }
    } catch (err) {
      // one company failing shouldn't stop the others
      console.error(`greenhouse ${board} failed:`, err);
      allFetchesWorked = false;
    }
  }

  return { jobs, allFetchesWorked };
}


// turns one Greenhouse job into one row for our jobs table
function toImportedJob(job: GreenhouseJob, board: string): ImportedJob {
  const location = job.location?.name?.trim() || null;

  return {
    source: 'greenhouse',
    // put the board in front of the id, so two companies can never end up with the same id
    external_id: `${board}:${job.id}`,
    title: job.title.trim(),
    organization: job.company_name?.trim() || board,
    type: guessType(job.title),
    // Greenhouse doesn't say who can apply. Company internships are almost always for
    // college students, so 'college' is the closest fit.
    level: 'college',
    location,
    setting: guessSetting(location),   // e.g. "Hybrid - New York, NY" -> 'hybrid'
    paid: null,       // pay is only written inside the description, if at all
    pay_text: null,
    deadline: toDate(job.application_deadline),
    description: htmlToText(job.content, { escaped: true }),   // escaped: see htmlToText in shared.ts
    requirements: [],
    apply_url: job.absolute_url,
  };
}
