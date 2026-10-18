import NavBar from "../components/NavBar.jsx";
import { Link } from "react-router";

const stats = [
  { number: "222", label: "Connections" },
  { number: "500", label: "Followers" },
  { number: "1.2k", label: "Profile views" },
];

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

const skills = ["React", "CSS", "Excel", "Typescript"];

const companies = ["Google", "Nvidia", "JPMorgan"];

const communities = [
  { name: "Oasis", members: "1,000" },
  { name: "Northeastern Club Fencing", members: "80" },
];

function ProfileHeader() {
  const isOwnProfile = true;

  return (
    <div className="profile-header">
      <div className="profile-banner"></div>
      <div className="profile-avatar">RMV</div>
      {isOwnProfile && (
        <Link to="/editprofile" className="profile-edit-btn">
          Edit profile
        </Link>
      )}
      <h1 className="profile-name">Roemer Mallari</h1>
      <p className="profile-bio">
        Computer Science & Business Administration @ Northeastern University
      </p>
      <div className="profile-info">
        <span>Northeastern University</span>
        <span>Torrance, CA</span>
      </div>
      <div className="profile-actions">
        {!isOwnProfile && (
          <button className="profile-btn-outline">Connect</button>
        )}
      </div>
      <div className="profile-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="profile-stat">
            <span className="profile-stat-number">{stat.number}</span>
            <span className="profile-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// A reusable card: white box + title + subtitle on top,
// and whatever you put between its tags underneath.
function ProfileSection(props) {
  return (
    <div className="profile-card">
      <h2 className="profile-card-title">{props.title}</h2>
      <p className="profile-card-subtitle">{props.subtitle}</p>
      {props.children}
    </div>
  );
}

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
function ResumePage() {
  return (
    <div className="profile-card profile-resume">
      <div className="profile-resume-icon">📄</div>
      <div className="profile-resume-info">
        <p className="profile-resume-label">RESUME</p>
        <p className="profile-item-title">
          Roemer Mallari - Professional Resume
        </p>
        <p className="profile-item-date">Updated Oct 2026</p>
      </div>
      <div className="profile-resume-actions">
        <button className="profile-btn-outline">View</button>
        <button className="profile-btn-primary">Download</button>
      </div>
    </div>
  );
}

/* project page uses the same exact code in the resume function, just different words */
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
        <button className="profile-btn-outline">View Project</button>
      </div>
    </div>
  );
}

function FollowedCompanies() {
  return (
    <div className="profile-card">
      <h3 className="profile-side-title">Followed Companies</h3>
      {companies.map((company) => (
        <div key={company} className="profile-company">
          <div className="profile-company-logo"></div>
          <p className="profile-company-name">{company}</p>
        </div>
      ))}
    </div>
  );
}

function FollowedCommunities() {
  return (
    <div className="profile-card">
      <h3 className="profile-side-title">Followed Communities</h3>
      {communities.map((community) => (
        <div key={community.name} className="profile-community">
          <div className="profile-community-logo"></div>
          <div>
            <p className="profile-community-name">{community.name}</p>
            <p className="profile-community-members">
              {community.members} members
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Profile() {
  return (
    <>
      <NavBar />
      <main className="profile-page">
        <section className="profile-main">
          <ProfileHeader />
          <AboutPage />
          <ProfileSection title="Education" subtitle="Schools and coursework">
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
          <ProfileSection title="Experience" subtitle="Work and leadership">
            {experiences.map((experience) => (
              <div key={experience.id} className="profile-item">
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
        <aside className="profile-side">
          <FollowedCompanies />
          <FollowedCommunities />
        </aside>
      </main>
    </>
  );
}

export default Profile;
