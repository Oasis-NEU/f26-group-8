// Profile.jsx is the Profile page (yoursite.com/profile).
// It's a student's profile on a job board: who you are at the top,
// then the facts an employer needs when you apply (what you're looking for,
// education, experience, projects, resume, skills).
// Everything on it is made-up sample data for now, because the site
// doesn't have a backend (server and database) hooked up to it yet.
// The styles for this page are in index.css, under "Profile page".

// The bar across the top of the page. It lives in its own file
// (components/NavBar.jsx) because the Feed page uses it too.
import NavBar from "../components/NavBar.jsx";
// Link moves to another page of our site without reloading it
import { Link } from "react-router";

// ---------- Sample data ----------
// These lists hold the made-up content shown on the page.
// Later, this data would come from the backend instead.

// true = you're looking at your own profile (shows Edit profile, the Add
// buttons, and the "Ready to apply?" checklist).
// false = someone else's (shows Message and Connect instead).
// Later, this would come from checking who's logged in.
// It's up here, outside every function, so every piece of the page can use it
const isOwnProfile = true;

// Who this profile belongs to. The name and initials are written once here
// and used everywhere on the page (the header, the resume, the browser tab),
// so they can never disagree. Later, this would come from the backend
const person = {
  name: "Roemer Mallari",
  initials: "RMV",
  pronouns: "he / him",
};

// How many connections you have (shown in the row under your name).
// It's a number, not words, so the page can format it ("1,234") and
// say "1 connection" instead of "1 connections"
const connections = 222;

// What you want next. An employer reads this first when you apply.
// "roles" is a list because you can want more than one kind of job
const lookingFor = {
  roles: ["Internship", "Co-op"],
  when: "Summer 2027",
  where: "Boston, MA or remote",
  pay: "Paid positions",
};

// Your school, for the Education card
const education = {
  initials: "NU",
  school: "Northeastern University",
  attendance: "2026 - 2030",
  major: "Computer Science & Business Administration",
};

// The jobs and clubs in the "Experience" card.
// Each one has: a unique number (id), the letters for its square (initials),
// the role (title), where (company), when (dates), and a sentence about it.
const experiences = [
  {
    id: 1,
    initials: "OA",
    title: "Front End Developer",
    company: "Oasis @ Northeastern",
    dates: "Sep 2026 - Present",
    description:
      "Building the Profile, Feed, and Edit Profile pages of ScoutSearch in React.",
  },
  {
    id: 2,
    initials: "NF",
    title: "Sabre Fencer",
    company: "Northeastern Club Fencing",
    dates: "Sep 2026 - Present",
    description:
      "Compete in sabre for the club team and train four days a week.",
  },
];

// The things you've built. Each one gets a colored box on top with big
// letters (badge), a kind of project (category), and one real number (stat).
// "color" picks the box color: "blue", "dark", or "navy".
// "link" is the web address the arrow button opens (Google for now, as a
// stand-in until each project has its own page)
const projects = [
  {
    id: 1,
    badge: "SS",
    category: "Web app",
    color: "dark",
    name: "ScoutSearch",
    description:
      "A job board that helps high school and college students find internships, co-ops, and research positions.",
    stat: "8 pages",
    link: "https://www.google.com",
  },
];

// The skills in the "Skills" card.
// This is a plain list of words, so there's no { } for each item
const skills = ["React", "CSS", "Excel", "TypeScript"];

// The "Ready to apply?" checklist. Each step is done (true) or not (false).
// skills.length is how many skills are in the list, so the last step
// checks itself: it's done once you have 5 or more skills
const checklist = [
  { id: 1, label: "Say what you're looking for", done: true },
  { id: 2, label: "Add your education", done: true },
  { id: 3, label: "Add an experience", done: experiences.length > 0 },
  { id: 4, label: "Add a project", done: projects.length > 0 },
  { id: 5, label: "Upload your resume", done: true },
  { id: 6, label: "List 5 or more skills", done: skills.length >= 5 },
];

// ---------- Small icons ----------
// Each icon is a tiny drawing (SVG) on a 24 by 24 grid.
// stroke="currentColor" makes it the same color as the words around it.
// aria-hidden="true" hides it from screen readers, because the words next
// to it already say the same thing (WCAG)

// A + sign: one line down, one line across
function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

// A pencil, for "Edit" and "Update"
function PencilIcon(props) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

// A sheet of paper with lines on it, for the resume
function FileIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

// An arrow pointing right, for "go see this project"
function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

// A check mark, for finished steps in the checklist
function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// ---------- Pieces of the page ----------
// Each function below is a component: one piece of the page.
// The Profile component at the bottom puts all the pieces together.

// The big box at the top: your picture, name, details, and buttons
function ProfileHeader() {
  return (
    // "profile-header" is the box around everything below
    <div className="profile-header">
      {/* 3 columns side by side: blue panel, words, buttons.
          On phones they stack instead (see the bottom of the Profile CSS) */}
      <div className="profile-header-row">
        {/* Column 1: the blue panel with your picture in it */}
        <div className="profile-banner">
          {/* Your initials stand in for a photo. Your name is right next
              to it, so screen readers skip the letters (WCAG) */}
          <div className="profile-avatar" aria-hidden="true">
            {person.initials}
          </div>
        </div>

        {/* Column 2: your name and details */}
        <div className="profile-header-text">
          {/* Your name with your pronouns next to it */}
          <div className="profile-name-row">
            {/* The page's one <h1> (WCAG) */}
            <h1 className="profile-name">{person.name}</h1>
            <span className="profile-pronouns">{person.pronouns}</span>
          </div>

          {/* One sentence about you */}
          <p className="profile-bio">
            Computer Science & Business Administration student building tools
            that help students find their first opportunity.
          </p>

          {/* Where you are and where you go to school */}
          <p className="profile-info">
            {/* Map pin icon (decoration, WCAG) */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {/* Each piece is kept together with the dot after it, so when the
                row wraps on a narrow screen, a line ends with a dot instead of
                starting with one. The dots only separate the words, so screen
                readers skip them */}
            <span className="profile-info-item">
              Torrance, CA<span aria-hidden="true"> ·</span>
            </span>
            <span className="profile-info-item">
              Northeastern University<span aria-hidden="true"> ·</span>
            </span>
            <span className="profile-info-item">Class of 2030</span>
          </p>
        </div>

        {/* Column 3: the buttons on the right */}
        <div className="profile-actions">
          {/* Your own profile: an Edit profile button */}
          {isOwnProfile && (
            <Link
              to="/editprofile"
              className="profile-header-button profile-header-button-dark"
            >
              <PencilIcon size="18" />
              Edit profile
            </Link>
          )}

          {/* Someone else's profile: Message and Connect.
              <> </> groups the two buttons without adding an extra box */}
          {!isOwnProfile && (
            <>
              <button className="profile-header-button profile-header-button-dark">
                {/* Envelope icon (decoration, WCAG) */}
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
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 5L2 7" />
                </svg>
                Message
              </button>
              <button className="profile-header-button">
                {/* People icon (decoration, WCAG) */}
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Connect
              </button>
            </>
          )}
        </div>
      </div>

      {/* The row along the bottom of the box: your connections, then links
          that jump down to each card. <nav> tells screen readers it's a set
          of links, and aria-label names it (WCAG) */}
      <nav className="profile-tabs" aria-label="Profile sections">
        <p className="profile-connections">
          {/* toLocaleString() adds commas to big numbers (1234 → "1,234").
              "? :" picks "connection" for exactly 1, "connections" otherwise */}
          <strong>{connections.toLocaleString()}</strong>{" "}
          {connections === 1 ? "connection" : "connections"}
        </p>
        {/* href="#education" jumps to the card with id="education" */}
        <a href="#education" className="profile-tab">
          Education
        </a>
        <a href="#projects" className="profile-tab">
          Projects
        </a>
        <a href="#experience" className="profile-tab">
          Work Experience
        </a>
        <a href="#resume" className="profile-tab">
          Resume
        </a>
      </nav>
    </div>
  );
}

// A reusable card: a box with a title on top, an optional Add or Update
// button next to the title, and whatever you put between its tags underneath.
// "props" holds the info passed in. For example,
// <ProfileSection id="education" title="Education" action="Add">
// makes props.title equal "Education" and props.action equal "Add".
// props.children is a special one: it's everything you put between
// <ProfileSection> and </ProfileSection>. That's how one card can hold
// a paragraph in "About", but a list in "Experience".
function ProfileSection(props) {
  return (
    // <section> + <h2> marks each card as one part of the page, so screen
    // readers can jump between cards by heading (WCAG).
    // id={props.id} is where the jump links in the header land
    <section className="profile-card" id={props.id}>
      {/* The top of the card: the title on the left, the button on the right */}
      <div className="profile-card-top">
        <h2 className="profile-card-title">{props.title}</h2>

        {/* Only on your own profile, and only if this card has an action.
            It goes to the Edit profile page, where you can change this part.
            aria-label says the whole thing ("Add education") so screen
            readers can tell the Add buttons apart. It starts with the
            visible word, so voice control users can still say "Add" (WCAG) */}
        {isOwnProfile && props.action && (
          // props.edit is the card to open on the Edit profile page, like
          // "education" → /editprofile#education. Cards without one just
          // open the top of the page
          <Link
            to={"/editprofile" + (props.edit ? "#" + props.edit : "")}
            className="profile-card-action"
            aria-label={props.action + " " + props.title.toLowerCase()}
          >
            {/* A + for "Add", a pencil for "Update" */}
            {props.action === "Add" ? <PlusIcon /> : <PencilIcon size="16" />}
            {props.action}
          </Link>
        )}
      </div>

      {/* Whatever was put between the tags shows up here */}
      {props.children}
    </section>
  );
}

// "What I'm looking for": the facts an employer checks first.
// <dl> is a "description list": pairs of a name (<dt>) and its answer (<dd>).
// Screen readers read each pair together (WCAG)
function LookingForCard() {
  return (
    <ProfileSection title="What I'm looking for" action="Update">
      <dl className="profile-facts">
        <div className="profile-fact">
          <dt className="profile-fact-name">Kind of job</dt>
          <dd>
            {/* One tag for each role in the list. The word itself is the key */}
            <ul className="profile-tags">
              {lookingFor.roles.map((role) => (
                <li key={role} className="profile-tag">
                  {role}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="profile-fact">
          <dt className="profile-fact-name">When</dt>
          <dd className="profile-fact-answer">{lookingFor.when}</dd>
        </div>
        <div className="profile-fact">
          <dt className="profile-fact-name">Where</dt>
          <dd className="profile-fact-answer">{lookingFor.where}</dd>
        </div>
        <div className="profile-fact">
          <dt className="profile-fact-name">Pay</dt>
          <dd className="profile-fact-answer">{lookingFor.pay}</dd>
        </div>
      </dl>
    </ProfileSection>
  );
}

// "Ready to apply?": a checklist of what's done and what's left,
// with one sky-blue button that takes you to finish it.
// Only you see this card (see where it's used in Profile below)
function ReadyChecklist() {
  // .filter() keeps only the steps that are done, and .length counts them
  const doneCount = checklist.filter((step) => step.done).length;

  return (
    <ProfileSection title="Ready to apply?">
      {/* "5 of 6 done" */}
      <p className="profile-checklist-count">
        {doneCount} of {checklist.length} done
      </p>

      <ul className="profile-checklist">
        {checklist.map((step) => (
          // Done steps get an extra class, so the CSS can fill in the circle
          <li
            key={step.id}
            className={
              step.done ? "profile-check profile-check-done" : "profile-check"
            }
          >
            {/* The circle: a check mark inside when the step is done */}
            <span className="profile-check-circle">
              {step.done && <CheckIcon />}
            </span>
            {step.label}
            {/* The circle only shows "done" with a picture, so screen
                readers get it in words instead (WCAG) */}
            <span className="sr-only">
              {step.done ? " (done)" : " (to do)"}
            </span>
          </li>
        ))}
      </ul>

      {/* The one next step. If everything is done, say so instead */}
      {doneCount < checklist.length ? (
        <Link to="/editprofile" className="profile-next-step">
          Finish your profile
        </Link>
      ) : (
        <p className="profile-checklist-ready">
          Your profile is ready to apply with.
        </p>
      )}
    </ProfileSection>
  );
}

// The "About" card: a few sentences in your own words
function AboutCard() {
  return (
    <ProfileSection title="About" action="Update" edit="about">
      <p className="profile-about-text">
        I'm a first-year student who likes building things people actually use.
        Right now I'm learning React by helping build ScoutSearch, and I fence
        sabre for the club team. I'm looking for a summer internship where I can
        ship real features and learn from experienced engineers.
      </p>
    </ProfileSection>
  );
}

// The Education card: your school's initials, the school and dates,
// and your major in a column with a thin line on its left
function EducationCard() {
  return (
    <ProfileSection
      id="education"
      title="Education"
      action="Add"
      edit="education"
    >
      <div className="profile-education">
        {/* The square with your school's initials (decoration, WCAG) */}
        <div className="profile-logo" aria-hidden="true">
          {education.initials}
        </div>

        {/* Your school and when you go there */}
        <div>
          <h3 className="profile-row-title">{education.school}</h3>
          <p className="profile-row-date">{education.attendance}</p>
        </div>

        {/* Your major */}
        <div className="profile-education-detail">
          <p className="profile-education-label">Major</p>
          <p className="profile-education-value">{education.major}</p>
        </div>
      </div>
    </ProfileSection>
  );
}

// The Experience card: one row for each item in the experiences list.
// It uses the same row look as Projects and Resume
function ExperienceCard() {
  return (
    <ProfileSection
      id="experience"
      title="Work Experience"
      action="Add"
      edit="experience"
    >
      {/* If the list is empty, say so instead of showing a blank card.
          "? :" means "if ... then show this, otherwise show that" */}
      {experiences.length === 0 ? (
        <p className="profile-empty">
          {isOwnProfile
            ? "Add a job, club, team, or volunteer role. It all counts."
            : "No experience listed yet."}
        </p>
      ) : (
        /* <ul> because it's a list of jobs (WCAG).
           "profile-experience" adds a line above the first row */
        <ul className="profile-rows profile-experience">
          {experiences.map((experience) => (
            <li key={experience.id} className="profile-row">
              {/* The square with the group's initials (decoration, WCAG) */}
              <div className="profile-logo" aria-hidden="true">
                {experience.initials}
              </div>
              <div>
                {/* <h3> is one level under the card's <h2> (WCAG) */}
                <h3 className="profile-row-title">{experience.title}</h3>
                <p className="profile-row-subtitle">{experience.company}</p>
                <p className="profile-row-date">{experience.dates}</p>
                <p className="profile-row-text">{experience.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ProfileSection>
  );
}

// Tilts a project tile a little toward the mouse, so it feels 3D.
// "event" says where the mouse is. event.currentTarget is the tile itself.
// It works out how far the mouse is from the tile's middle (from -0.5 on one
// edge to 0.5 on the other), turns that into an angle of up to 3 degrees,
// and hands the angles to the CSS as --tilt-x and --tilt-y.
// The CSS only uses them with a mouse and with "reduce motion" off
function tiltTowardMouse(event) {
  const tile = event.currentTarget;
  const box = tile.getBoundingClientRect();
  const across = (event.clientX - box.left) / box.width - 0.5;
  const down = (event.clientY - box.top) / box.height - 0.5;
  tile.style.setProperty("--tilt-x", (down * -6).toFixed(2) + "deg");
  tile.style.setProperty("--tilt-y", (across * 6).toFixed(2) + "deg");
}

// When the mouse leaves (or the browser cancels the touch, like when you
// start scrolling on a phone), the tile goes back to flat
function resetTilt(event) {
  event.currentTarget.style.removeProperty("--tilt-x");
  event.currentTarget.style.removeProperty("--tilt-y");
}

// The Projects card: one tile for each project, side by side.
// Each tile has a colored box on top, then the name, a sentence about it,
// and a row with one number and an arrow button that opens the project.
// The whole tile is clickable: the CSS stretches the arrow's link over it
function ProjectsCard() {
  return (
    <ProfileSection id="projects" title="Projects" action="Add" edit="projects">
      {/* If the list is empty, say so instead of showing a blank card */}
      {projects.length === 0 ? (
        <p className="profile-empty">
          {isOwnProfile
            ? "Add something you've built, for class or for fun."
            : "No projects listed yet."}
        </p>
      ) : (
        // <ul> because it's a list of projects (WCAG)
        <ul className="profile-projects">
          {projects.map((project) => (
            <li
              key={project.id}
              className="profile-project"
              onPointerMove={tiltTowardMouse}
              onPointerLeave={resetTilt}
              onPointerCancel={resetTilt}
            >
              {/* The colored box on top. "profile-project-top-dark" (or -blue,
                  -navy) picks its color from project.color */}
              <div
                className={
                  "profile-project-top profile-project-top-" + project.color
                }
              >
                {/* The big letters are decoration; the name below says the
                    same thing, so screen readers skip them (WCAG) */}
                <span className="profile-project-badge" aria-hidden="true">
                  {project.badge}
                </span>
                <span className="profile-project-category">
                  {project.category}
                </span>
              </div>

              {/* The words under the colored box */}
              <div className="profile-project-body">
                {/* <h3> is one level under the card's <h2> (WCAG) */}
                <h3 className="profile-project-name">{project.name}</h3>
                <p className="profile-project-text">{project.description}</p>

                {/* The bottom row: the number on the left, the arrow on the right */}
                <div className="profile-project-footer">
                  <p className="profile-project-stat">{project.stat}</p>
                  {/* The arrow opens the project in a new tab. The CSS stretches
                      it over the whole tile, so clicking anywhere on the tile works.
                      target="_blank" opens a new tab, and rel="noreferrer" is a
                      safety setting for links to other websites.
                      It has no words, so aria-label says what it does,
                      including that it opens a new tab (WCAG) */}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-project-link"
                    aria-label={
                      "View " + project.name + " (opens in a new tab)"
                    }
                  >
                    <ArrowIcon />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ProfileSection>
  );
}

// The Resume card: the file and when it was last updated.
// Employers get your resume when you apply, so there's no Download button
// here yet. You can update it from the Edit profile page
function ResumeCard() {
  return (
    <ProfileSection id="resume" title="Resume" action="Update" edit="resume">
      <div className="profile-row">
        {/* The square with the file icon (decoration, WCAG) */}
        <div className="profile-logo" aria-hidden="true">
          <FileIcon />
        </div>
        <div>
          <h3 className="profile-row-title">
            {/* The resume's name is a link. It goes to Google for now, as a
                stand-in until the real file is uploaded. target="_blank"
                opens a new tab, and rel="noreferrer" is a safety setting
                for links to other websites */}
            <a
              href="https://www.google.com"
              target="_blank"
              rel="noreferrer"
              className="profile-resume-link"
            >
              {person.name} - Resume
              {/* The small arrow after the name (decoration, WCAG) */}
              <ArrowIcon />
              {/* Screen readers hear that it opens a new tab (WCAG) */}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </h3>
          <p className="profile-row-date">PDF · Updated Oct 2026</p>
        </div>
      </div>
    </ProfileSection>
  );
}

// The Skills card: one tag for each skill
function SkillsCard() {
  return (
    <ProfileSection title="Skills" action="Add" edit="skills">
      {/* If the list is empty, say so instead of showing a blank card */}
      {skills.length === 0 ? (
        <p className="profile-empty">No skills listed yet.</p>
      ) : (
        <ul className="profile-tags">
          {skills.map((skill) => (
            <li key={skill} className="profile-tag">
              {skill}
            </li>
          ))}
        </ul>
      )}
    </ProfileSection>
  );
}

// Profile is the whole page. It puts all the pieces above together.
function Profile() {
  return (
    // <> </> is a "fragment": an invisible wrapper that groups
    // the top bar and the page together
    <>
      {/* The name on the browser tab. React puts <title> in the right place
          for you. It helps people with many tabs open, and screen readers
          read it first (WCAG) */}
      <title>{person.name + " | ScoutSearch"}</title>

      {/* The top bar (from components/NavBar.jsx) */}
      <NavBar />
      {/* <main> is the main content of the page (screen readers can jump to it).
          "profile-page" splits it into the 2 columns */}
      <main className="profile-page">
        {/* The big box at the top. It stretches across both columns */}
        <ProfileHeader />

        {/* Left column (the wide one): your story, top to bottom */}
        <div className="profile-main">
          <AboutCard />
          <EducationCard />
          <ProjectsCard />
          <ExperienceCard />
          <ResumeCard />
        </div>

        {/* Right column (the thin one): the quick facts for applying.
            <aside> means side content */}
        <aside className="profile-side">
          <LookingForCard />
          {/* Only you see your checklist */}
          {isOwnProfile && <ReadyChecklist />}
          <SkillsCard />
        </aside>
      </main>
    </>
  );
}

// "export default" lets other files import Profile (App.jsx does this).
export default Profile;
