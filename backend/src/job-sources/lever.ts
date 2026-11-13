// Lever: another hiring site companies use. Public postings, no key needed,
// one company per call.
// docs: https://github.com/lever/postings-api
import {
  fetchJson, isInternTitle, guessType, htmlToText, listItems, isWebLink,
  type ImportedJob, type SourceResult,
} from './shared.js';

// site = the company's name in jobs.lever.co/<site>.
// Lever doesn't send the company's name with each job, so we write it here.
// checked 2026-11-13: each of these had intern jobs listed.
const SITES = [
  { site: 'palantir', name: 'Palantir' },
  { site: 'zoox', name: 'Zoox' },
  { site: 'veeva', name: 'Veeva Systems' },
];

// only the fields we use (the real response has more)
type LeverJob = {
  id: string;
  text: string;                  // the job title
  hostedUrl: string;             // the posting's page on jobs.lever.co
  categories: { location?: string } | null;
  workplaceType?: string;        // 'onsite' | 'hybrid' | 'remote' | 'unspecified'
  salaryRange?: { min: number; max: number; currency: string; interval: string };
  description?: string;          // the intro, as HTML. (descriptionPlain exists too, but its spacing is messy)
  lists?: { text: string; content: string }[];   // sections like "What You'll Do", "What We Require"
  additional?: string;           // the closing part, as HTML. often has the pay and benefits
};

// Lever writes 'onsite', our table says 'on-site'. Anything else ('unspecified') -> null
const SETTINGS: Record<string, ImportedJob['setting']> = {
  onsite: 'on-site',
  hybrid: 'hybrid',
  remote: 'remote',
};


export async function fetchLever(): Promise<SourceResult> {
  const jobs: ImportedJob[] = [];
  let allFetchesWorked = true;

  for (const { site, name } of SITES) {
    try {
      // Lever sends back a plain list of postings (not wrapped in { jobs: ... })
      const body = (await fetchJson(
        `https://api.lever.co/v0/postings/${site}?mode=json`
      )) as LeverJob[];

      for (const job of body) {
        // same safety check as greenhouse.ts: skip a job missing what our table requires
        if (typeof job.id !== 'string' || typeof job.text !== 'string' || !isWebLink(job.hostedUrl)) {
          continue;
        }
        if (isInternTitle(job.text)) {
          jobs.push(toImportedJob(job, name));
        }
      }
    } catch (err) {
      console.error(`lever ${site} failed:`, err);
      allFetchesWorked = false;
    }
  }

  return { jobs, allFetchesWorked };
}


// turns one Lever job into one row for our jobs table
function toImportedJob(job: LeverJob, organization: string): ImportedJob {
  // the section whose heading mentions requirements or qualifications, if there is one
  const requirementsList = job.lists?.find((list) => /require|qualif/i.test(list.text));

  // Lever splits a posting into an intro (description), sections (lists) and a closing part
  // (additional). the intro alone is often just "about the company", so put all of it
  // together, except the requirements section, which has its own field.
  const sections = (job.lists ?? [])
    .filter((list) => list !== requirementsList)
    .map((list) => [(list.text ?? '').trim(), ...listItems(list.content).map((item) => `- ${item}`)].join('\n'));
  const description = [htmlToText(job.description), ...sections, htmlToText(job.additional)]
    .filter((part) => part)   // drop the empty ones
    .join('\n\n');

  return {
    source: 'lever',
    external_id: job.id,           // Lever ids are long random strings, already unique everywhere
    title: job.text.trim(),
    organization,
    type: guessType(job.text),
    level: 'college',              // same reason as greenhouse.ts
    location: job.categories?.location?.trim() || null,
    setting: SETTINGS[job.workplaceType ?? ''] ?? null,
    // a salary range means it's paid. no range means Lever didn't say, so null (not false)
    paid: job.salaryRange ? true : null,
    pay_text: job.salaryRange ? payText(job.salaryRange) : null,
    deadline: null,                // Lever postings don't have deadlines
    description: description || null,
    requirements: listItems(requirementsList?.content),
    apply_url: job.hostedUrl,
  };
}

// { min: 40, max: 50, currency: 'USD', interval: 'per-hour-wage' } -> "$40 - $50 per hour"
// { min: 45.5, max: 52, ... }                                      -> "$45.50 - $52.00 per hour"
export function payText(range: NonNullable<LeverJob['salaryRange']>): string {
  // cents only when there are cents, so yearly pay reads "$123,000", not "$123,000.00"
  const cents = Number.isInteger(range.min) && Number.isInteger(range.max) ? 0 : 2;
  const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: range.currency || 'USD',
    minimumFractionDigits: cents,
    maximumFractionDigits: cents,
  });
  const amount = range.min === range.max
    ? money.format(range.min)
    : `${money.format(range.min)} - ${money.format(range.max)}`;
  // "per-hour-wage" -> "per hour". Anything else (like "one-time") -> no ending
  const per = /^per-([a-z]+)/.exec(range.interval ?? '');
  return per ? `${amount} per ${per[1]}` : amount;
}
