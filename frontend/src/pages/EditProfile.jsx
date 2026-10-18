import NavBar from "../components/NavBar";

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

function EditProfile() {
  return (
    <>
      <NavBar />
      <main className="edit-page">
        <aside className="edit-profile-tracker">
          <EditTracker />
        </aside>
        <section className="edit-section"></section>
      </main>
    </>
  );
}

export default EditProfile;
