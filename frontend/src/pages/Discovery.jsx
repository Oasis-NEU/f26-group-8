// Discovery.jsx is the Discovery page (yoursite.com/discovery).
// It shows internships, co-ops, and part-time and full-time jobs matched to your profile.
// Everything on it is made-up sample data for now, because the site
// isn't connected to the backend yet.
// The styles for this page are in index.css, under "Discovery page".
//
// It's laid out the same way as the Feed page, so the two feel like one site:
//   1. DiscoveryHeader   the dark box: big title, one sentence, and the search bar
//   2. TypeTabs          a row of tabs: All, Internship, Co-op, Part-time, Full-time
//   3. Two columns:
//        ResultsSection  left:  the count, Sort, and the opportunity boxes
//        SideColumn      right: My applications and Profile boost
//
// The search bar and the tabs both really work: the Discovery function at
// the bottom remembers what you typed and which tab is picked (with
// useState), and only shows the opportunities that match both.

// useState lets the page remember a value and redraw itself when it changes.
// useRef keeps a reference to something on the screen, so the code can
// measure it. useLayoutEffect runs code right after React draws the page but
// BEFORE you see it, so a measurement can be used without a flicker.
// useEffect runs code after the page is drawn (here: opening a pop-up).
import { useEffect, useLayoutEffect, useRef, useState } from "react";
// Link goes to another page of the site without reloading everything.
// useSearchParams reads the extra info at the end of the address, like the
// "?job=1" in "/discovery?job=1" (the Feed page links here that way).
import { Link, useSearchParams } from "react-router";
// NavBar is the bar across the top of the page. It lives in its own file
// (components/NavBar.jsx) because every page uses it.
import NavBar from "../components/NavBar.jsx";

// ---------- Sample data ----------
// The job listings live in their own file, because the Application tracker
// page uses them too. See src/data/opportunities.js.
import { opportunities } from "../data/opportunities.js";
// The helpers that add a job to (or take it off) the Application tracker.
// See src/data/tracker.js.
import { addToTracker, isOnTracker, removeFromTracker } from "../data/tracker.js";

// The tabs across the page. "All" shows everything; the rest match the
// "type" of each opportunity above.
const tabs = ["All", "Internship", "Co-op", "Part-time", "Full-time"];

// ---------- Helpers ----------

// Turns a date like "2027-06-28" into words, like "Jun 28".
// "options" says which parts to show, for example { month: "short" } gives "Jun".
// The "T00:00" means midnight, so the date doesn't slip back a day in some time zones.
function formatDate(date, options) {
  return new Date(date + "T00:00").toLocaleDateString("en-US", options);
}

// Puts opportunities in order of deadline, soonest first.
// [...list] makes a copy first, because .sort() changes the list it's given,
// and we don't want to shuffle the original sample data.
// localeCompare compares two words A to Z; because the dates are written
// year-month-day, A to Z is also earliest to latest.
function sortByDeadline(list) {
  return [...list].sort((a, b) => a.deadline.localeCompare(b.deadline));
}

// Puts opportunities in order of match, highest first.
// b.match - a.match is a positive number when b fits better, which tells
// .sort() to put b first.
function sortByMatch(list) {
  return [...list].sort((a, b) => b.match - a.match);
}

// True if what was typed in the search bar appears anywhere in this
// opportunity's title, company, type, place, or skill tags.
// toLowerCase() makes "REACT", "React", and "react" all count as the same.
function matchesSearch(opportunity, search) {
  // trim() removes spaces at the start and end, so "  react " still works
  const words = search.trim().toLowerCase();
  // An empty search bar matches everything
  if (words === "") {
    return true;
  }
  // All the searchable text joined into one long piece of lowercase text
  const text = [
    opportunity.title,
    opportunity.organization,
    opportunity.type,
    opportunity.place,
    ...opportunity.tags,
  ]
    .join(" ")
    .toLowerCase();
  // includes() checks if the search words are somewhere inside that text
  return text.includes(words);
}

// ---------- Icons ----------
// Small drawings made with SVG. Every one has aria-hidden="true", which hides
// it from screen readers, because the words next to it already say the same
// thing (WCAG).

// The magnifying glass in the search bar.
function SearchIcon() {
  return (
    <svg
      className="discovery-search-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* the glass */}
      <circle cx="11" cy="11" r="7" />
      {/* the handle */}
      <path d="M20 20l-4-4" />
    </svg>
  );
}

// A small calendar, in front of "Apply by".
function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* the page of the calendar */}
      <rect x="3" y="5" width="18" height="16" rx="2" />
      {/* the line under the top, and the two rings at the top */}
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

// A bookmark, on the Save button. The CSS fills it in once it's saved.
function BookmarkIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h12v18l-6-4-6 4z" />
    </svg>
  );
}

// An arrow pointing right, for links and buttons that go somewhere.
function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// ---------- Pieces of the page ----------

// The top of the page: the big title, one sentence, and the search bar.
// They sit inside a dark navy box at the top of the page.
// props.search is what's typed in the search bar right now, and
// props.setSearch changes it. Discovery (at the bottom) remembers it, so the
// list can use it to filter.
function DiscoveryHeader(props) {
  // Pressing Enter in a form normally reloads the whole page. This stops
  // that. The list already updates as you type, so Enter doesn't need to do
  // anything else.
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <header className="discovery-header">
      {/* The page's one h1 (WCAG). The span colors the last words sky blue. */}
      <h1 className="discovery-title">
        Find a place to put your <span className="discovery-title-blue">skills to work.</span>
      </h1>

      <p className="discovery-subtitle">Internships, co-ops, and jobs matched to your ScoutSearch profile.</p>

      {/* role="search" tells screen readers this is the page's search (WCAG) */}
      <form className="discovery-search" role="search" onSubmit={handleSubmit}>
        <SearchIcon />

        {/* A real label for the typing box. sr-only hides it on screen but
            screen readers still read it. A placeholder is not a label (WCAG). */}
        <label htmlFor="discovery-search-input" className="sr-only">
          Search opportunities
        </label>
        {/* value is what's in the box; onChange runs on every key press and
            saves the new text. event.target.value is the text in the box. */}
        <input
          id="discovery-search-input"
          className="discovery-search-input"
          type="search"
          placeholder="Search by role, company, skill, or city"
          value={props.search}
          onChange={(event) => props.setSearch(event.target.value)}
        />
      </form>
    </header>
  );
}

// The row of tabs (All, Internship, Co-op, ...). Same look as Feed's tabs.
// props.picked is the tab that's on right now, and props.setPicked changes it.
//
// The blue line under the picked tab SLIDES to the new tab when you click
// one, so you can see where you moved from and to. There's only one line,
// and the code moves it under whichever tab is picked.
function TypeTabs(props) {
  // References to the row of tabs and the blue line, so we can measure and move them
  const rowRef = useRef(null);
  const lineRef = useRef(null);

  // Runs every time the picked tab changes (that's what [props.picked] at
  // the end means), and before the page is shown.
  useLayoutEffect(() => {
    // Puts the blue line under the picked tab
    function moveLine() {
      // Find the picked tab's button inside the row
      const pickedTab = rowRef.current.querySelector('[aria-pressed="true"]');
      // offsetLeft = how far the tab is from the left of the row (in px)
      // offsetWidth = how wide the tab is (in px)
      // The line is 1px wide in the CSS, so scaleX(width) stretches it to the
      // tab's width. Moving it with transform (instead of left and width) is
      // what keeps the slide smooth.
      lineRef.current.style.transform =
        "translateX(" + pickedTab.offsetLeft + "px) scaleX(" + pickedTab.offsetWidth + ")";
    }

    moveLine();
    // The tabs move when the window changes size (the space between them
    // changes on phones), so move the line again then too
    window.addEventListener("resize", moveLine);
    // When the picked tab changes again (or you leave the page), stop
    // listening to the old one, so they don't pile up
    return () => window.removeEventListener("resize", moveLine);
  }, [props.picked]);

  return (
    // role="group" + aria-label tells screen readers these buttons belong
    // together and what they're for (WCAG)
    <div className="discovery-tabs" role="group" aria-label="Show opportunity type" ref={rowRef}>
      {/* One button per tab. .map() goes through the tabs list in order. */}
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          // The picked tab also gets "discovery-tab-picked", which makes its words navy
          className={tab === props.picked ? "discovery-tab discovery-tab-picked" : "discovery-tab"}
          // aria-pressed tells screen readers which tab is on (WCAG)
          aria-pressed={tab === props.picked}
          onClick={() => props.setPicked(tab)}
        >
          {tab}
        </button>
      ))}

      {/* The sliding blue line. Decoration only: aria-pressed already tells
          screen readers which tab is picked */}
      <span className="discovery-tab-line" ref={lineRef} aria-hidden="true" />
    </div>
  );
}

// An X, for the pop-up's close button.
function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

// The pop-up with everything about one opportunity. It opens when you press
// "View opportunity".
//
// It's a <dialog>, the browser's own pop-up. Opened with showModal(), the
// browser does the hard parts for us (WCAG):
//   - the page behind it is dimmed and can't be clicked or tabbed to
//   - the Escape key closes it
//   - when it closes, the keyboard goes back to the button that opened it
//
// What's passed in:
//   opportunity        the opportunity to show
//   ref                a reference to the <dialog>, so the card can open it.
//                      (In React 19, "ref" can be passed in like any other prop.)
//   saved, toggleSave  the same Save on/off as the card's button, and the
//                      function that flips it (and updates the tracker)
//
// { opportunity, ref, saved, toggleSave } below "unpacks" the props: it's a
// shorter way of writing props.opportunity, props.ref, and so on. It's
// needed here because React's rules check that a ref is never read while
// the page is being drawn, and keeping it separate from the other props
// makes that clear.
function OpportunityDialog({ opportunity, ref, saved, toggleSave }) {
  // Whether Apply has been pressed (shows a message, since applying isn't built yet)
  const [applied, setApplied] = useState(false);
  // A unique id for the title, so the dialog can be named by it (WCAG)
  const titleId = "discovery-dialog-title-" + opportunity.id;

  // Clicking the dark area around the pop-up closes it. The <dialog> has no
  // padding of its own, so a click whose target is the <dialog> itself (not
  // something inside it) must be on that dark area.
  // event.target = what was clicked; event.currentTarget = the <dialog>.
  function closeIfOutside(event) {
    if (event.target === event.currentTarget) {
      event.currentTarget.close();
    }
  }

  return (
    // aria-labelledby names the pop-up with its title (WCAG)
    <dialog
      ref={ref}
      className="discovery-dialog"
      aria-labelledby={titleId}
      onClick={closeIfOutside}
    >
      {/* The dark band at the top, like the dark box on the page */}
      <div className="discovery-dialog-top">
        <span className="discovery-logo" aria-hidden="true">
          {opportunity.initials}
        </span>
        <div>
          <p className="discovery-dialog-type">{opportunity.type}</p>
          <h2 id={titleId} className="discovery-dialog-title">
            {opportunity.title}
          </h2>
          <p className="discovery-dialog-facts">
            {opportunity.organization} · {opportunity.place} ·{" "}
            <span className="discovery-dialog-match">{opportunity.match}% match</span>
          </p>
        </div>
        {/* A form with method="dialog" closes the pop-up when its button is
            pressed, with no extra code. aria-label says what the X does (WCAG). */}
        <form method="dialog">
          <button className="discovery-dialog-close" aria-label="Close">
            <CloseIcon />
          </button>
        </form>
      </div>

      {/* The middle part scrolls if the details are longer than the screen */}
      <div className="discovery-dialog-body">
        {/* The 4 quick facts, as a list of labels and values (dl = description list) */}
        <dl className="discovery-dialog-facts-grid">
          <div>
            <dt>Pay</dt>
            <dd>{opportunity.pay}</dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>{opportunity.length}</dd>
          </div>
          <div>
            <dt>Hours</dt>
            <dd>{opportunity.hours}</dd>
          </div>
          <div>
            <dt>Apply by</dt>
            <dd>
              <time dateTime={opportunity.deadline}>
                {formatDate(opportunity.deadline, { month: "short", day: "numeric", year: "numeric" })}
              </time>
            </dd>
          </div>
        </dl>

        <h3 className="discovery-dialog-heading">About the role</h3>
        <p className="discovery-dialog-text">{opportunity.description}</p>

        <h3 className="discovery-dialog-heading">What you'll do</h3>
        {/* .map() makes one <li> per item, in order. The item's own words
            are its key, since they're all different. */}
        <ul className="discovery-dialog-list">
          {opportunity.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="discovery-dialog-heading">What they're looking for</h3>
        <ul className="discovery-dialog-list">
          {opportunity.requirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="discovery-dialog-heading">Skills</h3>
        <ul className="discovery-tags" aria-label="Skills">
          {opportunity.tags.map((tag) => (
            <li key={tag} className="discovery-tag">
              {tag}
            </li>
          ))}
        </ul>

        <h3 className="discovery-dialog-heading">About {opportunity.organization}</h3>
        <p className="discovery-dialog-text">{opportunity.about}</p>
      </div>

      {/* The bottom: a message on the left, Save and Apply on the right.
          It stays put while the middle scrolls. */}
      <div className="discovery-dialog-bottom">
        {/* role="status" reads the message out when it appears (WCAG) */}
        <p className="discovery-dialog-message" role="status">
          {applied ? "Applying isn't built yet." : ""}
        </p>
        <div className="discovery-actions">
          <button
            type="button"
            className="discovery-outline-button"
            aria-pressed={saved}
            aria-label={"Save " + opportunity.title}
            onClick={toggleSave}
          >
            <BookmarkIcon />
            {saved ? "Saved" : "Save"}
          </button>
          <button type="button" className="discovery-solid-button" onClick={() => setApplied(true)}>
            Apply
            <ArrowIcon />
          </button>
        </div>
      </div>
    </dialog>
  );
}

// One opportunity box.
// props.opportunity is one { } from the opportunities list.
// props.isBest is true for the opportunity with the highest match.
function OpportunityCard(props) {
  // A shorter name, so we can write opportunity.title instead of props.opportunity.title.
  const opportunity = props.opportunity;

  // Each box remembers its own Save button (on/off), like Feed's Like button.
  // The pop-up uses the same one, so saving in either place saves both.
  // It starts as "on" if this job is already on the Application tracker, so
  // a job you saved before still says "Saved" when you come back.
  // (useState(() => ...) runs that check only once, when the box first appears.)
  const [saved, setSaved] = useState(() => isOnTracker(opportunity.id));

  // Runs when Save is pressed, on the card or in the pop-up.
  // Saving puts the job in the tracker's "Saved" column; pressing again
  // ("Saved") takes it off the tracker.
  function toggleSave() {
    if (saved) {
      removeFromTracker(opportunity.id);
    } else {
      addToTracker(opportunity.id);
    }
    setSaved(!saved);
  }
  // A reference to this box's pop-up, so "View opportunity" can open it
  const dialogRef = useRef(null);

  // If the Feed page sent you here for THIS job ("/discovery?job=1"), open its
  // pop-up as soon as the box is on the screen. props.openOnArrival is true
  // only for that job. After opening, props.onOpened clears the "?job=1", so
  // the pop-up doesn't open again by itself (for example after switching tabs).
  const openOnArrival = props.openOnArrival;
  const onOpened = props.onOpened;
  useEffect(() => {
    // ".open" is true if the pop-up is already open. Opening it twice would
    // cause an error, so only open it if it isn't open yet.
    if (openOnArrival && !dialogRef.current.open) {
      dialogRef.current.showModal();
      onOpened();
    }
  }, [openOnArrival, onOpened]);

  // The words under the buttons
  let message = "";
  if (saved) {
    message = "Saved to My applications.";
  }

  return (
    <li className="discovery-opportunity">
      {/* The blue strip across the top, like the "UPDATE" strip on Feed's
          posts. The best match says so; the others show their type. */}
      {/* The best match's strip gets one more class, which plays a quick
          shine across it once when the page opens */}
      <p className={props.isBest ? "discovery-strip discovery-strip-best" : "discovery-strip"}>
        {props.isBest ? "Best match for you" : opportunity.type}
      </p>

      <div className="discovery-opportunity-body">
        {/* Row 1, left: the square logo (decoration: the name is in the words) */}
        <span className="discovery-logo" aria-hidden="true">
          {opportunity.initials}
        </span>

        {/* Row 1, middle: title and facts */}
        <div>
          <h3 className="discovery-opportunity-title">{opportunity.title}</h3>
          <p className="discovery-opportunity-facts">
            {opportunity.organization} · {opportunity.place} · {opportunity.length}
          </p>
        </div>

        {/* Row 1, right: the match number */}
        <p className="discovery-match">
          <span className="discovery-match-number">{opportunity.match}%</span>
          <span className="discovery-match-label">match</span>
        </p>

        {/* Everything below goes under the title (the "wide" class, see index.css) */}
        <p className="discovery-opportunity-description discovery-opportunity-wide">{opportunity.description}</p>

        {/* The skill tags. .map() makes one <li> per tag, in order. */}
        <ul className="discovery-tags discovery-opportunity-wide" aria-label="Skills">
          {opportunity.tags.map((tag) => (
            <li key={tag} className="discovery-tag">
              {tag}
            </li>
          ))}
        </ul>

        {/* The bottom: "Apply by" on the left, buttons on the right */}
        <div className="discovery-opportunity-footer discovery-opportunity-wide">
          <div className="discovery-footer-row">
            <p className="discovery-apply-by">
              <CalendarIcon />
              {/* <time> marks this as a date for computers, using the
                  year-month-day version in dateTime */}
              <span>
                Apply by{" "}
                <time dateTime={opportunity.deadline}>
                  {formatDate(opportunity.deadline, { month: "short", day: "numeric" })}
                </time>
              </span>
            </p>

            <div className="discovery-actions">
              {/* Save: an on/off button. !saved flips true to false and false
                  to true. aria-pressed tells screen readers if it's on (WCAG).
                  aria-label says which opportunity, because every box has a
                  Save button. It starts with the visible word "Save" so
                  voice control still works (WCAG). */}
              <button
                type="button"
                className="discovery-outline-button"
                aria-pressed={saved}
                aria-label={"Save " + opportunity.title}
                onClick={toggleSave}
              >
                <BookmarkIcon />
                {saved ? "Saved" : "Save"}
              </button>

              {/* Opens this box's pop-up. showModal() is the <dialog>'s own
                  "open as a pop-up" command. aria-haspopup tells screen
                  readers a pop-up will open (WCAG). */}
              <button
                type="button"
                className="discovery-solid-button"
                aria-label={"View opportunity: " + opportunity.title}
                aria-haspopup="dialog"
                onClick={() => dialogRef.current.showModal()}
              >
                View opportunity
                <ArrowIcon />
              </button>
            </div>
          </div>

          {/* Always on the page, empty until there's something to say.
              role="status" reads it out when it changes (WCAG). */}
          <p className="discovery-card-message" role="status">
            {message}
          </p>
        </div>
      </div>

      {/* The pop-up. It's on the page all the time but hidden until it's opened. */}
      <OpportunityDialog opportunity={opportunity} ref={dialogRef} saved={saved} toggleSave={toggleSave} />
    </li>
  );
}

// The left column: the count, Sort, and the list of opportunity boxes.
// props.shown is the opportunities that pass the search and tab, already sorted.
function ResultsSection(props) {
  // "opportunity" for 1, "opportunities" for anything else.
  const word = props.shown.length === 1 ? "opportunity" : "opportunities";

  return (
    // aria-labelledby names this section with the heading's words (WCAG)
    <section className="discovery-results" aria-labelledby="discovery-results-title">
      {/* A heading for screen readers only (sr-only), so the list has a
          name in the page's outline. The tabs already show it on screen. */}
      <h2 id="discovery-results-title" className="sr-only">
        Opportunities
      </h2>

      {/* The small row above the list: the count on the left, Sort on the right */}
      <div className="discovery-results-top">
        {/* role="status" reads the new count out when it changes (WCAG) */}
        <p className="discovery-results-count" role="status">
          {props.shown.length} {word}
        </p>

        {/* The Sort dropdown. value is what's chosen right now; onChange
            runs when you pick another one. */}
        <div className="discovery-sort">
          <label htmlFor="discovery-sort-select">Sort by</label>
          <select
            id="discovery-sort-select"
            className="discovery-sort-select"
            value={props.sortBy}
            onChange={(event) => props.setSortBy(event.target.value)}
          >
            <option value="match">Best match</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>
      </div>

      {/* If nothing passes the search and tab, show a message and a way back.
          Otherwise, show the list. "? :" picks one of the two. */}
      {props.shown.length === 0 ? (
        <div className="discovery-empty">
          <p className="discovery-empty-title">No opportunities match</p>
          <p className="discovery-empty-text">Try different words, or pick another tab.</p>
          <button type="button" className="discovery-outline-button" onClick={props.showAll}>
            Show all opportunities
          </button>
        </div>
      ) : (
        <ul className="discovery-opportunities">
          {props.shown.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              isBest={opportunity.id === props.bestMatchId}
              // true only for the job the Feed page linked to (see Discovery below)
              openOnArrival={opportunity.id === props.openJobId}
              onOpened={props.onOpened}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

// The right column: the blue My applications box, then Profile boost.
function SideColumn() {
  return (
    // aside = a side column. aria-label names it for screen readers.
    <aside className="discovery-side" aria-label="Your applications and profile">
      {/* The blue box at the top, like Feed's date box. It goes to the
          application tracker, which isn't built yet, so the link leads to an
          empty page for now. */}
      <Link to="/applications" className="discovery-tracker-link">
        <span className="discovery-tracker-words">
          <span className="discovery-tracker-title">My applications</span>
          <span className="discovery-tracker-text">Track everything you've applied to</span>
        </span>
        <ArrowIcon />
      </Link>

      <section className="discovery-side-card" aria-labelledby="discovery-boost-title">
        <h2 id="discovery-boost-title" className="discovery-side-title">
          Profile boost
        </h2>
        <p className="discovery-side-text">
          The more skills your profile shows, the more accurate your matches get. Add the ones you've used in class
          or in a project.
        </p>
        <Link to="/editprofile" className="discovery-text-link">
          Add a skill
          <ArrowIcon />
        </Link>
      </section>
    </aside>
  );
}

// Discovery is the whole page. It puts the pieces above together, and it
// remembers the search and the picked tab so everything stays in sync.
function Discovery() {
  // What's typed in the search bar. Starts empty.
  const [search, setSearch] = useState("");
  // Which tab is picked. Starts on "All".
  const [picked, setPicked] = useState("All");
  // How the list is sorted: "match" or "deadline".
  const [sortBy, setSortBy] = useState("match");
  // The extra info at the end of the address. For "/discovery?job=1",
  // searchParams.get("job") gives "1". setSearchParams changes it.
  const [searchParams, setSearchParams] = useSearchParams();
  // The job to open right away, as a number (Number("1") is 1), or null if
  // the address has no "?job=". Number(null) would be 0, so check first.
  const openJobId = searchParams.get("job") ? Number(searchParams.get("job")) : null;

  // Runs after that job's pop-up opens: removes "?job=1" from the address.
  // replace: true swaps the address instead of adding a new one, so the
  // browser's Back button still goes back to the Feed page.
  function clearOpenJob() {
    setSearchParams({}, { replace: true });
  }

  // The opportunity with the highest match: sort by match, take the first.
  const bestMatch = sortByMatch(opportunities)[0];

  // Keep only the opportunities that pass BOTH tests:
  //   1. the tab: "All" is picked, or its type is the picked one ("||" means "or")
  //   2. the search: the typed words appear in it (see matchesSearch above)
  // "&&" means "and": both have to be true.
  const filtered = opportunities.filter(
    (opportunity) => (picked === "All" || opportunity.type === picked) && matchesSearch(opportunity, search),
  );

  // Then sort what's left, the way the Sort dropdown says.
  const shown = sortBy === "match" ? sortByMatch(filtered) : sortByDeadline(filtered);

  // The "Show all opportunities" button: empty search bar, back to All.
  function showAll() {
    setSearch("");
    setPicked("All");
  }

  return (
    <>
      <title>Discovery | ScoutSearch</title>
      <NavBar />
      {/* Same grid as the Feed page: the header and tabs stretch across the
          top, then the list on the left and the side column on the right */}
      <main className="discovery-page">
        <DiscoveryHeader search={search} setSearch={setSearch} />
        <TypeTabs picked={picked} setPicked={setPicked} />

        <ResultsSection
          shown={shown}
          bestMatchId={bestMatch.id}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showAll={showAll}
          openJobId={openJobId}
          onOpened={clearOpenJob}
        />

        <SideColumn />
      </main>
    </>
  );
}

// "export default" lets App.jsx import this page.
export default Discovery;
