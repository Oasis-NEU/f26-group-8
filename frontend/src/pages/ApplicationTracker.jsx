// ApplicationTracker.jsx is the Application tracker page (yoursite.com/applications).
// It's a Trello-style board with 3 columns: Saved, Preparing, and Submitted.
// Drag a card from one column to another to move it along. Every card also
// has a small "Move to" menu, which does the same thing for people using a
// keyboard or a phone (dragging only works with a mouse).
//
// The board starts empty. A job shows up in "Saved" when you press Save on
// it on the Discovery page. Which jobs are on the board, and in which column,
// is kept in this browser by src/data/tracker.js, so it's still there after
// a refresh. (Later, the backend would keep it for each account.)
// The styles for this page are in index.css, under "Application tracker page".
//
// How the page is put together, top to bottom:
//   1. TrackerHeader    Back link, title, sentence, and the "active" box
//   2. Three columns    one StageColumn per stage, each holding TrackerCards

// useState lets the page remember a value and redraw itself when it changes.
// useEffect runs code after the page is drawn (here: saving the board).
import { useEffect, useState } from "react";
// Link goes to another page of the site without reloading everything.
import { Link } from "react-router";
// NavBar is the bar across the top of the page (components/NavBar.jsx).
import NavBar from "../components/NavBar.jsx";
// The job listings (the same ones as on Discovery)
import { opportunities } from "../data/opportunities.js";
// Reads and saves which jobs are on the board (shared with Discovery's Save button)
import { loadTracker, saveTracker } from "../data/tracker.js";

// ---------- Icons ----------
// Small drawings made with SVG. aria-hidden="true" hides them from screen
// readers, because the words next to them already say the same thing (WCAG).

// The arrow pointing left, in "Back to opportunities"
function BackArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

// A bookmark (Saved column)
function BookmarkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h12v18l-6-4-6 4z" />
    </svg>
  );
}

// A briefcase (Preparing column)
function BriefcaseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18" />
    </svg>
  );
}

// A paper plane (Submitted column)
function SendIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />
    </svg>
  );
}

// Six dots, the little "you can drag this" handle on each card
function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" />
      <circle cx="15" cy="18" r="1.6" />
    </svg>
  );
}

// The 3 columns, in order. Each one has:
//   id     the name used in each application's "stage"
//   name   the title on screen
//   hint   the small line under the title
//   empty  what the column says when it has no cards
//   Icon   the drawing in the empty column. (A component can be stored in a
//          list like any other value, then drawn with <stage.Icon />.)
const stages = [
  { id: "saved", name: "Saved", hint: "Interesting roles to revisit", empty: "No saved roles yet. Press Save on a job in Opportunities to add it here.", Icon: BookmarkIcon },
  {
    id: "preparing",
    name: "Preparing",
    hint: "Applications you're working on",
    empty: "Roles you're applying to will appear here",
    Icon: BriefcaseIcon,
  },
  {
    id: "submitted",
    name: "Submitted",
    hint: "Applications sent out",
    empty: "Submitted applications will appear here",
    Icon: SendIcon,
  },
];

// ---------- Helpers ----------

// Turns "2026-11-20" into "Nov 20".
// The "T00:00" means midnight, so the date doesn't slip back a day in some time zones.
function formatDate(date) {
  return new Date(date + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Builds the board from the saved list. The saved list only has each job's
// id and column, so this looks up the rest (title, company, ...) in the
// opportunities list.
function loadApplications() {
  return (
    loadTracker()
      // For each saved item, find its job and add the column to it.
      // { ...job, stage: item.stage } copies the job and adds its column.
      .map((item) => {
        const job = opportunities.find((opportunity) => opportunity.id === item.id);
        return job ? { ...job, stage: item.stage } : null;
      })
      // Drop any saved id that no longer matches a job (null from above)
      .filter((app) => app !== null)
  );
}

// ---------- Pieces of the page ----------

// The top of the page: Back link, title, sentence, and the "active" box.
// props.total is how many applications are on the board.
// props.submitted is how many are in the Submitted column.
function TrackerHeader(props) {
  return (
    <header className="tracker-header">
      {/* Back to the Discovery page */}
      <Link to="/discovery" className="tracker-back-link">
        <BackArrowIcon />
        Back to opportunities
      </Link>

      <div className="tracker-heading">
        <h1 className="tracker-title">Application tracker</h1>
        <p className="tracker-subtitle">Keep the opportunities you care about moving forward.</p>
      </div>

      {/* The "active" box on the right */}
      <section className="tracker-progress" aria-label="Your progress">
        <p className="tracker-progress-count">
          <span className="tracker-progress-number">{props.total}</span> active
        </p>
        {/* <progress> is the browser's own progress bar. It fills up as more
            applications are submitted. aria-label says what it measures (WCAG). */}
        <progress
          className="tracker-progress-bar"
          value={props.submitted}
          max={props.total || 1}
          aria-label="Applications submitted"
        />
        <p className="tracker-progress-text">
          {props.total === 0
            ? "Add an opportunity to get started"
            : props.submitted + " of " + props.total + " submitted"}
        </p>
      </section>
    </header>
  );
}

// One card on the board.
// props.app       the application ({ id, title, ... })
// props.dragging  true while this card is being dragged (it fades a little)
// props.onDragStart / props.onDragEnd   tell the board a drag started or ended
// props.onMove    moves this card to another column (used by the "Move to" menu)
function TrackerCard(props) {
  const app = props.app;
  // A unique id, so the "Move to" menu's label can point at it
  const selectId = "tracker-move-" + app.id;

  // The small line at the bottom of the card changes with the column
  let note = "Apply by " + formatDate(app.deadline);
  if (app.stage === "submitted") {
    note = "Application sent";
  }

  return (
    <li
      className={props.dragging ? "tracker-card tracker-card-dragging" : "tracker-card"}
      // draggable lets the mouse pick the card up and drag it
      draggable="true"
      onDragStart={(event) => props.onDragStart(event, app.id)}
      onDragEnd={props.onDragEnd}
    >
      <div className="tracker-card-top">
        {/* The company's initials (decoration: the name is in the words) */}
        <span className="tracker-logo" aria-hidden="true">
          {app.initials}
        </span>
        <div className="tracker-card-words">
          <h3 className="tracker-card-title">{app.title}</h3>
          <p className="tracker-card-org">{app.organization}</p>
        </div>
        {/* The six dots that show the card can be dragged */}
        <span className="tracker-grip">
          <GripIcon />
        </span>
      </div>

      <div className="tracker-card-bottom">
        <p className="tracker-card-note">{note}</p>

        {/* "Move to": does the same as dragging, for keyboards and phones (WCAG).
            The label is hidden on screen but read by screen readers, and says
            which card it moves. */}
        <label htmlFor={selectId} className="sr-only">
          {"Move " + app.title + " to"}
        </label>
        <select
          id={selectId}
          className="tracker-move"
          value={app.stage}
          onChange={(event) => props.onMove(app.id, event.target.value)}
        >
          {/* One choice per column, in order */}
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.name}
            </option>
          ))}
        </select>
      </div>
    </li>
  );
}

// One column of the board.
// props.stage     one { } from the stages list (name, hint, ...)
// props.apps      the applications in this column
// props.isOver    true while a card is being dragged over this column
// The rest are passed through to each card, or handle dropping.
function StageColumn(props) {
  const stage = props.stage;
  // A unique id, so the column can be named by its title (WCAG)
  const titleId = "tracker-stage-" + stage.id;

  return (
    <section
      className={props.isOver ? "tracker-column tracker-column-over" : "tracker-column"}
      aria-labelledby={titleId}
      // While a card is dragged over this column. preventDefault() is what
      // tells the browser "you're allowed to drop here".
      onDragOver={(event) => {
        event.preventDefault();
        props.onDragOver(stage.id);
      }}
      // When the dragged card leaves the column. relatedTarget is where the
      // mouse went; if that's still inside this column (like onto a card),
      // it hasn't really left, so nothing changes.
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          props.onDragLeave();
        }
      }}
      // When the card is let go over this column
      onDrop={(event) => {
        event.preventDefault();
        props.onDrop(stage.id);
      }}
    >
      {/* The top of the column: dot, title, count, and the small line */}
      <div className="tracker-column-top">
        <h2 id={titleId} className="tracker-column-title">
          {/* The colored dot (decoration: the title says the same thing) */}
          <span className={"tracker-dot tracker-dot-" + stage.id} aria-hidden="true" />
          {stage.name}
        </h2>
        <span className="tracker-count" aria-label={props.apps.length + " applications"}>
          {props.apps.length}
        </span>
      </div>
      <p className="tracker-column-hint">{stage.hint}</p>

      {/* The cards, or the empty message if there are none.
          "? :" picks one of the two. */}
      {props.apps.length === 0 ? (
        <div className="tracker-empty">
          <stage.Icon />
          <p>{stage.empty}</p>
        </div>
      ) : (
        <ul className="tracker-cards">
          {props.apps.map((app) => (
            <TrackerCard
              key={app.id}
              app={app}
              dragging={props.draggingId === app.id}
              onDragStart={props.onDragStart}
              onDragEnd={props.onDragEnd}
              onMove={props.onMove}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

// ApplicationTracker is the whole page. It remembers where every card is,
// and handles dragging and dropping.
function ApplicationTracker() {
  // Every application and its column. loadApplications runs once, the first
  // time, to bring back the board saved in this browser.
  const [applications, setApplications] = useState(loadApplications);
  // The id of the card being dragged right now (null when nothing is)
  const [draggingId, setDraggingId] = useState(null);
  // The column a card is being dragged over right now (null when none)
  const [overStage, setOverStage] = useState(null);
  // The sentence screen readers hear after a card moves
  const [announcement, setAnnouncement] = useState("");

  // Every time the board changes, save it (just each job's id and column),
  // so it's still there after a refresh. [applications] at the end means
  // "only run this when applications changes".
  useEffect(() => {
    saveTracker(applications.map((app) => ({ id: app.id, stage: app.stage })));
  }, [applications]);

  // Moves one card to another column
  function moveApplication(id, newStage) {
    // Find the card, so we can say its name in the announcement
    const app = applications.find((item) => item.id === id);
    // Nothing to do if it's already in that column
    if (!app || app.stage === newStage) {
      return;
    }
    // A new list where only that card's stage is different
    setApplications(applications.map((item) => (item.id === id ? { ...item, stage: newStage } : item)));
    // Find the column's name ("Submitted") for the announcement
    const stage = stages.find((item) => item.id === newStage);
    setAnnouncement("Moved " + app.title + " to " + stage.name + ".");
  }

  // A card was picked up: remember which one
  function handleDragStart(event, id) {
    // "move" shows the move cursor instead of a copy cursor
    event.dataTransfer.effectAllowed = "move";
    // Some browsers (Firefox) only start a drag if some data is attached
    event.dataTransfer.setData("text/plain", String(id));
    setDraggingId(id);
  }

  // The card was let go, anywhere: clear everything
  function handleDragEnd() {
    setDraggingId(null);
    setOverStage(null);
  }

  // The card was dropped on a column: move it there
  function handleDrop(stageId) {
    if (draggingId !== null) {
      moveApplication(draggingId, stageId);
    }
    setDraggingId(null);
    setOverStage(null);
  }

  // Numbers for the "active" box
  const submittedCount = applications.filter((app) => app.stage === "submitted").length;

  return (
    <>
      <title>Application tracker | ScoutSearch</title>
      <NavBar />
      <main className="tracker-page">
        <TrackerHeader total={applications.length} submitted={submittedCount} />

        {/* The board: one column per stage, in order */}
        <div className="tracker-board">
          {stages.map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              // Only the applications whose stage is this column
              apps={applications.filter((app) => app.stage === stage.id)}
              isOver={overStage === stage.id}
              draggingId={draggingId}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={setOverStage}
              onDragLeave={() => setOverStage(null)}
              onDrop={handleDrop}
              onMove={moveApplication}
            />
          ))}
        </div>

        {/* Hidden on screen, but screen readers read it out whenever a card
            moves, so they know it worked (WCAG) */}
        <p className="sr-only" role="status">
          {announcement}
        </p>
      </main>
    </>
  );
}

// "export default" lets App.jsx import this page.
export default ApplicationTracker;
