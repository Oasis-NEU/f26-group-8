import NavBar from "../components/NavBar";
import { useState } from "react";

const sections = [
  { id: "1", label: "Basics" },
  { id: "2", label: "About" },
  { id: "3", label: "Education" },
  { id: "4", label: "Experience" },
  { id: "5", label: "Projects" },
  { id: "6", label: "Resume" },
  { id: "7", label: "Skills" },
];

function EditTracker() {
  return (
    <div className="edit-tracker-card">
      <h2 className="edit-tracker-header">Edit profile</h2>
      <p className="edit-tracker-subtitle">Keep your profile up to date</p>
      {sections.map((section) => (
        <div key={section.id} className="edit-tracker-steps">
          <div className="edit-tracker-id">{section.id}</div>
          <p className="edit-tracker-label">{section.label}</p>
        </div>
      ))}
    </div>
  );
}

function BasicsInfo() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [school, setSchool] = useState("");
  const [location, setLocation] = useState("");

  function handleSave() {
    console.log({ username, bio, school, location });
  }

  return (
    <div className="edit-card">
      <h2 className="edit-card-title">Basic Information</h2>
      <p className="edit-card-subtitle">Let the world know who you are!</p>

      <label className="edit-label">Username</label>
      <input
        className="edit-input"
        type="text"
        placeholder="Roemer Mallari"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="edit-label">Bio</label>
      <input
        className="edit-input"
        type="text"
        placeholder="CS student at Northeastern"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <label className="edit-label">School</label>
      <input
        className="edit-input"
        type="text"
        placeholder="Northeastern University"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
      />

      <label className="edit-label">Location</label>
      <input
        className="edit-input"
        type="text"
        placeholder="Boston, MA"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button
        className="profile-btn-primary edit-save-btn"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}

function AboutInfo() {
  const [about, setAbout] = useState("");

  function handleSave() {
    console.log({ about });
  }
  return (
    <div className="edit-card">
      <h2 className="edit-card-title">About</h2>
      <p className="edit-card-subtitle">
        Share your interests, goals, and what motivates you.
      </p>
      <label className="edit-label">About you</label>

      <textarea
        className="edit-input edit-textarea"
        placeholder="Tell people about yourself..."
        value={about}
        onChange={(e) => setAbout(e.target.value)}
      />
      <button
        className="profile-btn-primary edit-save-btn"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}

function EducationInfo() {
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [dates, setDates] = useState("");
  const [GPA, setGPA] = useState("");

  function handleSave() {
    console.log({ school, degree, dates, GPA });
  }

  return (
    <div className="edit-card">
      <h2 className="edit-card-title">Education</h2>
      <p className="edit-card-subtitle">
        Add your school and academic background
      </p>

      <div className="edit-row">
        <div className="edit-field">
          <label className="edit-label">School</label>
          <input
            className="edit-input"
            type="text"
            placeholder="Northeastern University"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
        </div>

        <div className="edit-field">
          <label className="edit-label">Degree & field of study</label>
          <input
            className="edit-input"
            type="text"
            placeholder="B.S. Computer Science & Business Administration"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          />
        </div>
      </div>

      <div className="edit-row">
        <div className="edit-field">
          <label className="edit-label">Dates attended</label>
          <input
            className="edit-input"
            type="text"
            placeholder="2026 - Present"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
          />
        </div>

        <div className="edit-field">
          <label className="edit-label">GPA</label>
          <input
            className="edit-input"
            type="text"
            placeholder="4.0"
            value={GPA}
            onChange={(e) => setGPA(e.target.value)}
          />
        </div>
      </div>
      <button
        className="profile-btn-primary edit-save-btn"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}

function ExperienceInfo() {
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [info, setInfo] = useState("");

  function handleSave() {
    console.log({ role, organization, info });
  }

  return (
    <div className="edit-card">
      <h2 className="edit-card-title">Experience</h2>
      <p className="edit-card-subtitle">
        Highlight work, internships, and leadership
      </p>

      <div className="edit-row">
        <div className="edit-field">
          <label className="edit-label">Role</label>
          <input
            className="edit-input"
            type="text"
            placeholder="Front End Developer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div className="edit-field">
          <label className="edit-label">Organization</label>
          <input
            className="edit-input"
            type="text"
            placeholder="Oasis"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </div>
      </div>

      <div className="edit-field">
        <label className="edit-label">What you did</label>
        <textarea
          className="edit-input edit-textarea"
          placeholder="Developing ScoutSearch"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
      </div>

      <button
        className="profile-btn-primary edit-save-btn"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}

function ProjectInfo() {
  const [project, setProject] = useState("");
  const [link, setLink] = useState("");

  function handleSave() {
    console.log({ project, link });
  }
  return (
    <div className="edit-card">
      <h2 className="edit-card-title">Projects</h2>
      <p className="edit-card-subtitle">
        Show what you have built, researched, or created!
      </p>

      <div className="edit-row">
        <div className="edit-field">
          <label className="edit-label">Project Name</label>
          <input
            className="edit-input"
            type="text"
            placeholder="Web Page"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
        </div>

        <div className="edit-field">
          <label className="edit-label">Project link</label>
          <input
            className="edit-input"
            type="url"
            placeholder="https://github.com/..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
      </div>

      <button
        className="profile-btn-primary edit-save-btn"
        onClick={handleSave}
      >
        Add project
      </button>
    </div>
  );
}

function EditProfile() {
  return (
    <>
      <NavBar />
      <main className="edit-page">
        <aside className="edit-profile-tracker">
          <EditTracker />
        </aside>
        <section className="edit-section">
          <BasicsInfo />
          <AboutInfo />
          <EducationInfo />
          <ExperienceInfo />
          <ProjectInfo />
        </section>
      </main>
    </>
  );
}

export default EditProfile;
