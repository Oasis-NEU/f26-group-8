// plans.md Task JB3: the routes anyone can use to read jobs (no login needed).
//   GET /api/jobs        a page of open jobs, with filters and search
//   GET /api/jobs/:id    one job
// the employer and admin routes (JB5) get added to this file later.
import express from 'express';
import { supabase } from './db.js';

const router = express.Router();

// the columns we send to the frontend: the contract's Job, plus source and status.
// external_id and last_seen_at are only for the importer, so they stay out.
const JOB_COLUMNS =
  'id, title, organization, type, level, location, setting, paid, pay_text, deadline, ' +
  'description, requirements, apply_url, posted_by, created_at, source, status';

const PAGE_SIZE = 50;

// the values each filter allows: the same lists as the checks in backend/sql/jobs.sql
const TYPES = ['internship', 'co-op', 'research', 'program'];
const LEVELS = ['high-school', 'college', 'both'];
const SETTINGS = ['remote', 'hybrid', 'on-site'];
const PAID = ['true', 'false'];

// what a uuid looks like: 8-4-4-4-12 hex digits
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;


// reads one filter from the URL, e.g. the "co-op" in ?type=co-op. Returns:
//   undefined -> the filter wasn't used (missing, or empty like ?type=)
//   a string  -> one of the allowed values
//   null      -> anything else, which the route turns into a 400
function readFilter(value: unknown, allowed: string[]): string | undefined | null {
  if (value === undefined || value === '') return undefined;
  // typeof matters: ?type=a&type=b gives a list, not a string
  if (typeof value !== 'string' || !allowed.includes(value)) return null;
  return value;
}

// today as YYYY-MM-DD, in Boston time (where our students are).
// 'en-CA' just happens to write dates as YYYY-MM-DD. without timeZone it would use whatever
// clock the server runs on, and servers often run on UTC, which turns into "tomorrow"
// at 7pm Boston time and would hide jobs due today too early.
function today(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}


// JB3b: GET /api/jobs?type=&level=&setting=&paid=&q=&page=
router.get('/', async (req, res) => {
  const type = readFilter(req.query.type, TYPES);
  const level = readFilter(req.query.level, LEVELS);
  const setting = readFilter(req.query.setting, SETTINGS);
  const paid = readFilter(req.query.paid, PAID);

  if (type === null || level === null || setting === null || paid === null) {
    return res.status(400).json({ error: 'Unknown filter value' });
  }

  // page=1 is the first 50 jobs, page=2 the next 50, and so on. no page means page 1.
  // at most 4 digits, so nobody can ask the database to skip billions of rows
  const pageText = req.query.page || '1';
  if (typeof pageText !== 'string' || !/^[1-9]\d{0,3}$/.test(pageText)) {
    return res.status(400).json({ error: 'Unknown page' });
  }
  const page = Number(pageText);

  // search words: keep only letters, digits, spaces and hyphens.
  // q goes inside a filter string where commas, dots, brackets, quotes, % and * all have
  // special meanings, so leaving any of them in could break the query or change what it does.
  // (\p{L} = any letter, including accented ones. \p{N} = any digit)
  const qText = req.query.q ?? '';
  if (typeof qText !== 'string') {
    return res.status(400).json({ error: 'Unknown search' });
  }
  const q = qText.replace(/[^\p{L}\p{N} -]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 100);

  let query = supabase
    .from('jobs')
    .select(JOB_COLUMNS)
    // pending jobs wait for an admin, closed ones are gone: only open jobs are listed
    .eq('status', 'open')
    // hide past deadlines: keep jobs with no deadline, or one that's today or later
    .or(`deadline.is.null,deadline.gte.${today()}`);

  if (type) query = query.eq('type', type);
  if (setting) query = query.eq('setting', setting);
  // paid=false means "says it's unpaid". jobs that don't say (null) match neither
  if (paid) query = query.eq('paid', paid === 'true');

  if (level) {
    // a job marked 'both' fits high schoolers AND college students, so it shows up for either
    query = level === 'both'
      ? query.eq('level', 'both')
      : query.in('level', [level, 'both']);
  }

  if (q) {
    // the search word anywhere in the title or the company name, ignoring upper/lower case
    query = query.or(`title.ilike.%${q}%,organization.ilike.%${q}%`);
  }

  const from = (page - 1) * PAGE_SIZE;
  const { data: jobs, error } = await query
    // newest first. every job saved by the same import has the exact same created_at,
    // so id breaks the tie. without it, the order among them could change between
    // requests, and the same job could show up on page 1 AND page 2.
    .order('created_at', { ascending: false })
    .order('id')
    // range counts from 0 and includes both ends: page 1 = rows 0 to 49
    .range(from, from + PAGE_SIZE - 1);

  if (error) {
    console.error('job list failed:', error);
    return res.status(500).json({ error: 'Database error' });
  }

  // fewer than 50 jobs back means this is the last page
  res.json({ jobs });
});


// JB5a goes HERE, above /:id: GET /mine has to come first, or Express would
// treat "mine" as a job id and send it to the route below.


// JB3c: GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // check the shape first. something like "abc" would make Postgres throw
  // "invalid input syntax for type uuid", which we'd turn into a 500,
  // even though it really just means there's no such job.
  if (!UUID.test(id)) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const { data: job, error } = await supabase
    .from('jobs')
    .select(JOB_COLUMNS)
    .eq('id', id)
    // pending jobs stay hidden until an admin verifies the employer.
    // closed jobs are still shown (the frontend can say "this listing is closed"),
    // so a link a student saved doesn't suddenly turn into "not found".
    .neq('status', 'pending')
    .maybeSingle();

  if (error) {
    console.error('job lookup failed:', error);
    return res.status(500).json({ error: 'Database error' });
  }

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json({ job });
});

export default router;
