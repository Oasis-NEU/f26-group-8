// Profile.jsx is the Profile page (yoursite.com/profile).
// It has 2 columns: your profile info on the left (the wide one),
// and the companies and communities you follow on the right (the thin one).
// Everything on it is made-up sample data for now, because the site
// doesn't have a backend (server and database) hooked up to it yet.
// The styles for this page are in index.css, under "Profile page".

// The bar across the top of the page. It lives in its own file
// (components/NavBar.jsx) because the Feed page uses it too.
import NavBar from "../components/NavBar.jsx";
import { Link } from "react-router";

// ---------- Sample data ----------
// These lists hold the made-up content shown on the page.
// Later, this data would come from the backend instead.

// The 3 numbers along the bottom of the profile header
const stats = [
  { number: "222", label: "Connections" },
  { number: "500", label: "Followers" },
  { number: "1.2k", label: "Profile views" },
];

// The jobs and clubs in the "Experience" box.
// Each one has: a unique number (id), the role (title), where (company),
// when (dates), and a short sentence about it (description).
const experiences = [
  {
    id: 1,
    title: "Front End Developer",
    company: "Oasis",
    dates: "Sep 2026-Present",
    description: "Helping code ScoutSearch",
  },
  {
    id: 2,
    title: "Sabre Fencer",
    company: "Northeastern Club Fencing",
    dates: "Sep 2026-Present",
    description: "Sabre fencer for Northeastern",
  },
];

// The boxes in the "Skills" section.
// This is a plain list of words, so there's no { } for each item
const skills = ["React", "CSS", "Excel", "Typescript"];

// The rows in the "Followed Companies" box (right column)
const companies = ["Google", "Nvidia", "JPMorgan"];

// The rows in the "Followed Communities" box (right column)
const communities = [
  { name: "Oasis", members: "1,000" },
  { name: "Northeastern Club Fencing", members: "80" },
];

// ---------- Pieces of the page ----------
// Each function below is a component: one piece of the page.
// The Profile component at the bottom puts all the pieces together.

// The big box at the top of the left column: the banner, your circle,
// your name and info, and your numbers
function ProfileHeader() {
  const isOwnProfile = true;

  return (
    // "profile-header" is the white box around everything below
    <div className="profile-header">
      {/* The blue strip across the top. It's empty: the CSS gives it a height and color */}
      <div className="profile-banner"></div>
      {/* The circle with your initials. The CSS pulls it up so it overlaps the strip */}
      <div className="profile-avatar">RMV</div>
      {isOwnProfile && (
        <Link to="/editprofile" className="profile-edit-btn">
          Edit profile
        </Link>
      )}
      <h1 className="profile-name">Roemer Mallari</h1>
      {/* Your major and school */}
      <p className="profile-bio">
        Computer Science & Business Administration @ Northeastern University
      </p>
      {/* A row of small gray details, side by side */}
      <div className="profile-info">
        <span>Northeastern University</span>
        <span>Torrance, CA</span>
      </div>
      {/* Doesn't do anything when clicked yet */}
      <div className="profile-actions">
        {!isOwnProfile && (
          <button className="profile-btn-outline">Connect</button>
        )}
      </div>
      {/* The row of numbers along the bottom of the box.
          .map() goes through the stats list and makes one stat for each.
          key={stat.label} uses the label (like "Followers") as each one's
          unique name, so React can keep track of it */}
      <div className="profile-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="profile-stat">
            {/* The big number, like 222 */}
            <span className="profile-stat-number">{stat.number}</span>
            {/* The gray word next to it, like Connections */}
            <span className="profile-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// A reusable card: white box + title + subtitle on top,
// and whatever you put between its tags underneath.
// "props" holds the info passed in. For example,
// <ProfileSection title="Skills" subtitle="What Roemer works with">
// makes props.title equal "Skills" and props.subtitle equal "What Roemer works with".
// props.children is a special one: it's everything you put between
// <ProfileSection> and </ProfileSection>. That's how one card can hold
// a paragraph in "About", but a list in "Experience".
function ProfileSection(props) {
  return (
    <div className="profile-card">
      {/* <h2> is one level under the <h1> name, because each card
          is a part of the profile (WCAG) */}
      <h2 className="profile-card-title">{props.title}</h2>
      <p className="profile-card-subtitle">{props.subtitle}</p>
      {/* Whatever was put between the tags shows up here */}
      {props.children}
    </div>
  );
}

// The "About" card. It uses ProfileSection above for the box and title,
// and puts one paragraph inside it.
// "Lorem ipsum..." is fake filler text that designers use until the real words are ready
function AboutPage() {
  return (
    <ProfileSection title="About" subtitle="A quick introduction">
      <p className="profile-about-text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci nihil,
        odio aut, incidunt fuga in quaerat itaque perferendis at velit provident
        maxime, temporibus quo voluptatibus facere omnis accusantium saepe
        inventore!
      </p>
    </ProfileSection>
  );
}

/* classname "profile-card is the same as from profile-section and reuses the same CSS properties" */
/* same with profile-btn-outline */
// The "Resume" card: a file icon on the left, the file's info in the middle,
// and the buttons on the right.
// className="profile-card profile-resume" gives the box TWO classes
// (a space separates them). "profile-card" makes it the same white box
// as the other cards, and "profile-resume" lines the 3 parts up in a row.
function ResumePage() {
  return (
    <div className="profile-card profile-resume">
      {/* Left: the file icon in a light blue square */}
      <div className="profile-resume-icon">📄</div>
      {/* Middle: the small blue label, the file name, and when it was updated.
          It reuses the title and date styles from the Education and Experience rows */}
      <div className="profile-resume-info">
        <p className="profile-resume-label">RESUME</p>
        <p className="profile-item-title">
          Roemer Mallari - Professional Resume
        </p>
        <p className="profile-item-date">Updated Oct 2026</p>
      </div>
      {/* Right: the buttons. They don't do anything when clicked yet */}
      <div className="profile-resume-actions">
        {/* White button with a blue outline */}
        <button className="profile-btn-outline">View</button>
        {/* Filled blue button */}
        <button className="profile-btn-primary">Download</button>
      </div>
    </div>
  );
}

/* project page uses the same exact code in the resume function, just different words */
// The "Projects" card. Same layout as the Resume card, but with one button
function ProjectPage() {
  return (
    <div className="profile-card profile-resume">
      <div className="profile-resume-icon">📄</div>
      <div className="profile-resume-info">
        <p className="profile-resume-label">PROJECTS</p>
        <p className="profile-item-title">ScoutSearch - Oasis Project</p>
        <p className="profile-item-date">Updated Oct 2026</p>
      </div>
      <div className="profile-resume-actions">
        {/* Doesn't do anything when clicked yet */}
        <button className="profile-btn-outline">View Project</button>
      </div>
    </div>
  );
}

// The "Followed Companies" box (right column)
function FollowedCompanies() {
  return (
    <div className="profile-card">
      {/* <h3> is one level under the <h2> card titles (WCAG) */}
      <h3 className="profile-side-title">Followed Companies</h3>
      {/* Makes one row for each company in the companies list.
          Each item is just a word like "Google", so the word itself is the key */}
      {companies.map((company) => (
        <div key={company} className="profile-company">
          {/* An empty gray square, saving space for the company's logo later */}
          <div className="profile-company-logo"></div>
          <p className="profile-company-name">{company}</p>
        </div>
      ))}
    </div>
  );
}

// The "Followed Communities" box (right column)
function FollowedCommunities() {
  return (
    <div className="profile-card">
      <h3 className="profile-side-title">Followed Communities</h3>
      {/* Makes one row for each community in the communities list */}
      {communities.map((community) => (
        <div key={community.name} className="profile-community">
          {/* An empty gray square, saving space for the community's logo later */}
          <div className="profile-community-logo"></div>
          {/* This extra <div> keeps the name and member count stacked
              on top of each other, next to the square */}
          <div>
            <p className="profile-community-name">{community.name}</p>
            {/* Shows something like "80 members" */}
            <p className="profile-community-members">
              {community.members} members
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Profile is the whole page. It puts all the pieces above together.
function Profile() {
  return (
    // <> </> is a "fragment": an invisible wrapper that groups
    // the top bar and the page together
    <>
      {/* The top bar (from components/NavBar.jsx) */}
      <NavBar />
      {/* <main> is the main content of the page (screen readers can jump to it).
          "profile-page" splits it into the 2 columns */}
      <main className="profile-page">
        {/* Left column (the wide one): the cards stacked top to bottom */}
        <section className="profile-main">
          <ProfileHeader />
          <AboutPage />
          {/* The "Education" card. Everything between the ProfileSection tags
              becomes props.children (see ProfileSection above) */}
          <ProfileSection title="Education" subtitle="Schools and coursework">
            {/* One school: the "NU" square, then the school info stacked */}
            <div className="profile-item">
              <div className="profile-item-logo">NU</div>
              <div className="profile-item-info">
                <p className="profile-item-title">Northeastern University</p>
                <p className="profile-item-subtitle">
                  Computer Science & Business Administration
                </p>
                <p className="profile-item-date">2026 - 2029</p>
              </div>
            </div>
          </ProfileSection>
          {/* The "Experience" card. It uses the same row style as Education,
              but makes one row for each item in the experiences list */}
          <ProfileSection title="Experience" subtitle="Work and leadership">
            {experiences.map((experience) => (
              <div key={experience.id} className="profile-item">
                {/* An empty blue square, saving space for a logo later */}
                <div className="profile-item-logo"></div>
                <div className="profile-item-info">
                  <p className="profile-item-title">{experience.title}</p>
                  <p className="profile-item-subtitle">{experience.company}</p>
                  <p className="profile-item-date">{experience.dates}</p>
                  <p className="profile-item-text">{experience.description}</p>
                </div>
              </div>
            ))}
          </ProfileSection>
          <ProjectPage />
          <ResumePage />
          {/* The "Skills" card: one box with a checkmark for each skill.
              The CSS lays the boxes out in 2 columns */}
          <ProfileSection title="Skills" subtitle="What Roemer works with">
            <div className="profile-skills">
              {skills.map((skill) => (
                <div key={skill} className="profile-skill">
                  ✓ {skill}
                </div>
              ))}
            </div>
          </ProfileSection>
        </section>
        {/* Right column (the thin one). <aside> means side content */}
        <aside className="profile-side">
          <FollowedCompanies />
          <FollowedCommunities />
        </aside>
      </main>
    </>
  );
}

// "export default" lets other files import Profile (App.jsx does this).
export default Profile;
