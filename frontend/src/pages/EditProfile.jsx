// EditProfile.jsx is the Edit Profile page (yoursite.com/editprofile).
// It has 2 columns: a list of the profile's parts on the left (you can click
// one to jump to it), and a card with a form for each part on the right.
// The "Save all changes" button only prints what you typed in the browser
// console for now,
// because the site isn't connected to the backend yet.
// The styles for this page are in index.css, under "EditProfile Page".

// The bar across the top of the page (components/NavBar.jsx)
import NavBar from "../components/NavBar";
// useState remembers what you type. useEffect runs code after the page shows up
import { useEffect, useState } from "react";
// Link goes to another page of our site. useLocation tells us the page's
// address, including the "#education" part at the end. useNavigate lets our
// code send you to another page (like after you click Save)
import { Link, useLocation, useNavigate } from "react-router";

// ---------- The parts of the profile ----------
// One item for each card on this page. "id" matches the card's id below,
// so the list on the left can jump to it (href="#education" finds id="education")
const sections = [
  { id: "basics", label: "Basics" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "skills", label: "Skills" },
];

// ---------- Pieces of the page ----------

// The list of parts on the left. Each one is a link that jumps to its card.
// <ol> is a numbered list, so screen readers say "list, 7 items" (WCAG)
function EditTracker() {
  return (
    // The box on the left. The title sits in the box but outside the <nav>,
    // so screen readers hear "Edit profile" as the page's title, not as
    // part of the list of links (WCAG)
    <div className="edit-tracker-card">
      {/* The page's one <h1> (WCAG) */}
      <h1 className="edit-tracker-header">Edit profile</h1>
      <p className="edit-tracker-subtitle">Keep your profile up to date</p>
      {/* <nav> is just the list of links. aria-label names it */}
      <nav aria-label="Profile parts">
        <ol className="edit-tracker-list">
          {/* .map() makes one step for each part. "index" counts from 0,
            so index + 1 gives the step numbers 1 to 7 */}
          {sections.map((section, index) => (
            <li key={section.id}>
              <a href={"#" + section.id} className="edit-tracker-steps">
                {/* The number in the circle. The list already numbers the
                  steps for screen readers, so they skip this (WCAG) */}
                <span className="edit-tracker-id" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="edit-tracker-label">{section.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

// Every input below has a <label htmlFor="x"> and an id="x" that match.
// autoComplete tells the browser what a box is for ("name", or
// "address-level2", which means a city), so it can offer to fill it in.
// That connects them: clicking the label puts the cursor in the box, and
// screen readers say the label when you reach the box (WCAG).
// (In JSX it's "htmlFor", because "for" means something else in JavaScript.)
// Each id is unique on the page, like "basics-school" and "education-school".

// The Basic Information card. It doesn't keep its own values anymore:
// EditProfile (at the bottom) keeps them and hands them in as "props".
// props.username is the text in the box, and props.setUsername changes it.
// That way the one Save button at the bottom of the page can see them
function BasicsInfo(props) {
  return (
    // id="basics" is where the "Basics" step on the left jumps to
    <section className="edit-card" id="basics">
      <h2 className="edit-card-title">Basic Information</h2>
      <p className="edit-card-subtitle">Let the world know who you are!</p>

      <label className="edit-label" htmlFor="basics-username">
        Username
      </label>
      <input
        id="basics-username"
        className="edit-input"
        type="text"
        autoComplete="name"
        placeholder="e.g. John Doe"
        value={props.username}
        onChange={(e) => props.setUsername(e.target.value)}
      />

      <label className="edit-label" htmlFor="basics-bio">
        Bio
      </label>
      <input
        id="basics-bio"
        className="edit-input"
        type="text"
        placeholder="e.g. CS student at Northeastern"
        value={props.bio}
        onChange={(e) => props.setBio(e.target.value)}
      />

      <label className="edit-label" htmlFor="basics-school">
        School
      </label>
      <input
        id="basics-school"
        className="edit-input"
        type="text"
        placeholder="e.g. Northeastern University"
        value={props.school}
        onChange={(e) => props.setSchool(e.target.value)}
      />

      <label className="edit-label" htmlFor="basics-location">
        Location
      </label>
      <input
        id="basics-location"
        className="edit-input"
        type="text"
        autoComplete="address-level2"
        placeholder="e.g. Boston, MA"
        value={props.location}
        onChange={(e) => props.setLocation(e.target.value)}
      />
    </section>
  );
}

// The About card. Like Basics, its value lives in EditProfile now and
// comes in as props (props.about and props.setAbout)
function AboutInfo(props) {
  return (
    <section className="edit-card" id="about">
      <h2 className="edit-card-title">About</h2>
      <p className="edit-card-subtitle">
        Share your interests, goals, and what motivates you.
      </p>

      <label className="edit-label" htmlFor="about-text">
        About you
      </label>
      <textarea
        id="about-text"
        className="edit-input edit-textarea"
        placeholder="Tell people about yourself..."
        value={props.about}
        onChange={(e) => props.setAbout(e.target.value)}
      />
    </section>
  );
}

// The Education card. Its values come in as props from EditProfile.
// (EditProfile calls its school "educationSchool", so it doesn't mix up
// with the Basics card's school. Inside this card it's just props.school)
function EducationInfo(props) {
  return (
    <section className="edit-card" id="education">
      <h2 className="edit-card-title">Education</h2>
      <p className="edit-card-subtitle">
        Add your school and academic background
      </p>

      <div className="edit-row">
        <div className="edit-field">
          <label className="edit-label" htmlFor="education-school">
            School
          </label>
          <input
            id="education-school"
            className="edit-input"
            type="text"
            placeholder="e.g. Northeastern University"
            value={props.school}
            onChange={(e) => props.setSchool(e.target.value)}
          />
        </div>

        <div className="edit-field">
          <label className="edit-label" htmlFor="education-degree">
            Degree & field of study
          </label>
          <input
            id="education-degree"
            className="edit-input"
            type="text"
            placeholder="e.g. B.S. Computer Science & Business Administration"
            value={props.degree}
            onChange={(e) => props.setDegree(e.target.value)}
          />
        </div>
      </div>

      <div className="edit-row">
        <div className="edit-field">
          <label className="edit-label" htmlFor="education-dates">
            Dates attended
          </label>
          <input
            id="education-dates"
            className="edit-input"
            type="text"
            placeholder="e.g. 2026 - Present"
            value={props.dates}
            onChange={(e) => props.setDates(e.target.value)}
          />
        </div>

        <div className="edit-field">
          <label className="edit-label" htmlFor="education-gpa">
            GPA
          </label>
          {/* inputMode="decimal" shows a number keyboard on phones */}
          <input
            id="education-gpa"
            className="edit-input"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 4.0"
            value={props.gpa}
            onChange={(e) => props.setGpa(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

// The Experience card. Its values come in as props from EditProfile
function ExperienceInfo(props) {
  return (
    <section className="edit-card" id="experience">
      <h2 className="edit-card-title">Experience</h2>
      <p className="edit-card-subtitle">
        Highlight work, internships, and leadership
      </p>

      <div className="edit-row">
        <div className="edit-field">
          <label className="edit-label" htmlFor="experience-role">
            Role
          </label>
          <input
            id="experience-role"
            className="edit-input"
            type="text"
            placeholder="e.g. Front End Developer"
            value={props.role}
            onChange={(e) => props.setRole(e.target.value)}
          />
        </div>

        <div className="edit-field">
          <label className="edit-label" htmlFor="experience-organization">
            Organization
          </label>
          <input
            id="experience-organization"
            className="edit-input"
            type="text"
            placeholder="e.g. Oasis"
            value={props.organization}
            onChange={(e) => props.setOrganization(e.target.value)}
          />
        </div>
      </div>

      <div className="edit-field">
        <label className="edit-label" htmlFor="experience-info">
          What you did
        </label>
        <textarea
          id="experience-info"
          className="edit-input edit-textarea"
          placeholder="e.g. Developing ScoutSearch"
          value={props.info}
          onChange={(e) => props.setInfo(e.target.value)}
        />
      </div>
    </section>
  );
}

// The Projects card. Its values come in as props from EditProfile
function ProjectInfo(props) {
  return (
    <section className="edit-card" id="projects">
      <h2 className="edit-card-title">Projects</h2>
      <p className="edit-card-subtitle">
        Show what you have built, researched, or created!
      </p>

      <div className="edit-row">
        <div className="edit-field">
          <label className="edit-label" htmlFor="projects-name">
            Project name
          </label>
          <input
            id="projects-name"
            className="edit-input"
            type="text"
            placeholder="e.g. Web Page"
            value={props.project}
            onChange={(e) => props.setProject(e.target.value)}
          />
        </div>

        <div className="edit-field">
          <label className="edit-label" htmlFor="projects-link">
            Project link
          </label>
          <input
            id="projects-link"
            className="edit-input"
            type="url"
            placeholder="e.g. https://github.com/..."
            value={props.link}
            onChange={(e) => props.setLink(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

// The Resume card. Its values come in as props from EditProfile
function ResumeInfo(props) {
  return (
    <section className="edit-card" id="resume">
      <h2 className="edit-card-title">Resume</h2>
      <p className="edit-card-subtitle">Show off your resume!</p>

      <div className="edit-row">
        <div className="edit-field">
          <label className="edit-label" htmlFor="resume-name">
            Resume name
          </label>
          <input
            id="resume-name"
            className="edit-input"
            type="text"
            placeholder="e.g. Resume 2026"
            value={props.resume}
            onChange={(e) => props.setResume(e.target.value)}
          />
        </div>

        <div className="edit-field">
          <label className="edit-label" htmlFor="resume-link">
            Resume link
          </label>
          {/* The box takes a web address, so the example shows one */}
          <input
            id="resume-link"
            className="edit-input"
            type="url"
            placeholder="e.g. https://drive.google.com/..."
            value={props.link}
            onChange={(e) => props.setLink(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

// The Skills card. The list of skills lives in EditProfile (props.skills),
// because that's what gets saved. What you're typing in the box ("skill")
// stays here in the card: it's only half-typed, and nothing else needs it
function SkillsInfo(props) {
  const [skill, setSkill] = useState(""); // what's being typed right now

  // Runs when you click Add or press Enter in the box.
  // "event.preventDefault()" stops the browser from reloading the page,
  // which is what a form normally does when you press Enter
  function handleAdd(event) {
    event.preventDefault();
    // .trim() removes spaces at the start and end, so "  React " becomes "React"
    const newSkill = skill.trim();
    if (newSkill === "") return; // don't add blanks
    // .some() checks if any skill already in the list matches (ignoring
    // capital letters), so "react" isn't added twice next to "React"
    const alreadyAdded = props.skills.some(
      (s) => s.toLowerCase() === newSkill.toLowerCase(),
    );
    if (!alreadyAdded) {
      props.setSkills([...props.skills, newSkill]); // a new list: the old skills + the new one
    }
    setSkill(""); // empty the box for the next skill
  }

  // Takes one skill out of the list.
  // .filter() keeps every skill that is NOT the one you clicked
  function handleRemove(skillToRemove) {
    props.setSkills(props.skills.filter((s) => s !== skillToRemove));
  }

  return (
    <section className="edit-card" id="skills">
      <h2 className="edit-card-title">Skills</h2>
      <p className="edit-card-subtitle">What are your strengths?</p>

      {/* A <form> lets you press Enter to add a skill, not just click Add */}
      <form className="edit-row edit-skill-form" onSubmit={handleAdd}>
        {/* The box had no label before. sr-only hides the label on screen
            but screen readers still say it (WCAG) */}
        <label className="sr-only" htmlFor="skills-new">
          New skill
        </label>
        <input
          id="skills-new"
          className="edit-input edit-skill-input"
          type="text"
          placeholder="e.g. React"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        {/* type="submit" sends the form, which runs handleAdd */}
        <button type="submit" className="profile-btn-primary">
          Add
        </button>
      </form>

      {/* One tag for each skill, with an × button to take it out */}
      {props.skills.length > 0 && (
        <ul className="edit-skills">
          {props.skills.map((s) => (
            <li key={s} className="edit-skill-pill">
              {s}
              {/* aria-label says which skill the × removes (WCAG) */}
              <button
                type="button"
                className="edit-skill-remove"
                aria-label={"Remove " + s}
                onClick={() => handleRemove(s)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// EditProfile is the whole page. It puts the pieces above together.
function EditProfile() {
  // The page's web address. If you came from a "+ Add" button on your
  // profile, it ends with something like "#education".
  // (It's called "address", not "location", because "location" is the
  // Basics card's city box below)
  const address = useLocation();

  // navigate("/profile") sends you to your profile, the same as clicking a
  // link to it, but from inside our code (see handleSaveAll below)
  const navigate = useNavigate();

  // ---------- What you've typed ----------
  // These used to live inside each card. They live here now, so the one
  // Save button at the bottom can see all of them. Moving them up from a
  // card to the page is called "lifting state up".

  // Basic Information
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [school, setSchool] = useState("");
  const [location, setLocation] = useState("");

  // About
  const [about, setAbout] = useState("");

  // Education. Two cards ask for a school, so this one is
  // "educationSchool" to keep it apart from the Basics "school" above
  const [educationSchool, setEducationSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [dates, setDates] = useState("");
  const [gpa, setGpa] = useState("");

  // Experience
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [experienceInfo, setExperienceInfo] = useState("");

  // Projects
  const [projectName, setProjectName] = useState("");
  const [projectLink, setProjectLink] = useState("");

  // Resume
  const [resumeName, setResumeName] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  // Skills: a list, so it starts as an empty list [] instead of ""
  const [skills, setSkills] = useState([]);

  // Changing pages keeps you scrolled down as far as you were, so before
  // going to your profile we jump to the top. "instant" skips the smooth
  // glide this page uses. Both Save and "Back to profile" use this
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  // The one Save button for the whole page. For now it prints everything
  // in the browser console, grouped by card, until the backend is connected.
  // After that, it takes you to your profile
  function handleSaveAll() {
    console.log({
      basics: { username, bio, school, location },
      about,
      education: { school: educationSchool, degree, dates, gpa },
      experience: { role, organization, info: experienceInfo },
      project: { name: projectName, link: projectLink },
      resume: { name: resumeName, link: resumeLink },
      skills,
    });

    // Then go back to your profile, at the top (see scrollToTop below)
    scrollToTop();
    navigate("/profile");
  }

  // After the page shows up, jump to the card named after the "#", and put
  // the cursor in its first box, so you can start typing right away.
  // [address.hash] means "run this again only if the # part changes"
  useEffect(() => {
    if (address.hash === "") return;
    // .slice(1) drops the "#", so "#education" becomes "education"
    const card = document.getElementById(address.hash.slice(1));
    if (card === null) return;
    card.scrollIntoView({ block: "start" });
    const firstBox = card.querySelector("input, textarea");
    if (firstBox !== null) {
      // preventScroll stops the page from jumping again for the cursor
      firstBox.focus({ preventScroll: true });
    }
  }, [address.hash]);

  return (
    <>
      {/* The name on the browser tab (WCAG) */}
      <title>Edit profile | ScoutSearch</title>
      <NavBar />
      <main className="edit-page">
        {/* The left column. It stays on screen while you scroll the cards,
            so "Back to profile" and the parts list are always reachable */}
        <aside className="edit-profile-tracker">
          {/* A link back to your profile. The arrow points left, like "go back".
              It's a Link (not a button) because it goes to another page.
              onClick runs scrollToTop first, so your profile opens at the top */}
          <Link to="/profile" className="edit-back-link" onClick={scrollToTop}>
            <span aria-hidden="true">←</span> Back to profile
          </Link>
          <EditTracker />
        </aside>
        <div className="edit-section">
          {/* Basics gets its values and their "set" functions as props */}
          <BasicsInfo
            username={username}
            setUsername={setUsername}
            bio={bio}
            setBio={setBio}
            school={school}
            setSchool={setSchool}
            location={location}
            setLocation={setLocation}
          />
          <AboutInfo about={about} setAbout={setAbout} />
          {/* The name on the left (school) is what the card calls it.
              The name on the right (educationSchool) is what EditProfile
              calls it. They don't have to match */}
          <EducationInfo
            school={educationSchool}
            setSchool={setEducationSchool}
            degree={degree}
            setDegree={setDegree}
            dates={dates}
            setDates={setDates}
            gpa={gpa}
            setGpa={setGpa}
          />
          <ExperienceInfo
            role={role}
            setRole={setRole}
            organization={organization}
            setOrganization={setOrganization}
            info={experienceInfo}
            setInfo={setExperienceInfo}
          />
          <ProjectInfo
            project={projectName}
            setProject={setProjectName}
            link={projectLink}
            setLink={setProjectLink}
          />
          <ResumeInfo
            resume={resumeName}
            setResume={setResumeName}
            link={resumeLink}
            setLink={setResumeLink}
          />
          <SkillsInfo skills={skills} setSkills={setSkills} />

          {/* The one Save button for the whole page */}
          <button
            type="button"
            className="profile-btn-primary edit-save-all"
            onClick={handleSaveAll}
          >
            Save all changes
          </button>
        </div>
      </main>
    </>
  );
}

// "export default" lets other files import EditProfile (App.jsx does this).
export default EditProfile;
