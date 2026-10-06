import { Link } from "react-router";

const features = [
    {
        title: "Made for Students",
        description: "Simple yet efficient platform for students ranging from high school to college students to find internships, co-ops, and research positions."
    },
    {
        title: "Filters",
        description: "Search by major, GPA, location, remote or on-site, and more. Find the perfect opportunity that fits your needs."
    },
    {
        title: "Real events",
        description: "Find real events and opportunities that are happening in your area or online related to your qualifications and interests."
    },
    {
        title: "Resume Builder",
        description: "Enter your information once and generate a resume in seconds. You can also download your resume as a PDF."
    },
]

function About() {
    return (
        <div className="page">
            <Link to="/login" className="btn-primary top-right">
                Log in
            </Link>
            <header className="banner">
                <h1 className="banner-title">About Us</h1>
                <p className="banner-subtitle">A Northeastern Oasis Project...</p>
            </header>
            <section className="section">
                <h2 className="section-title">Who we are</h2>
                <div className="column">
                    <p>We are a group of students along with a mentor trying to build a Co-Op, Internship, and Research position platform for students. Our goal is to make it easier for students to find opportunities that fit their needs and interests.</p>
                </div>
            </section>

            <section className="section">
                <h2>Who it's for</h2>
                <div className="columns">
                    <div className="column">
                        <h3>High School Students</h3>
                        <p>High school students can use our platform to find internships and research positions that will help them gain experience and prepare for college search or college Co-Op search.</p>
                    </div>
                    <div className="column">
                        <h3>College Students</h3>
                        <p>College students can use our platform to find internships, co-ops, and research positions that will help them gain experience and prepare for their future careers.</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <h2>Why use our platform?</h2>
                <div className="feature-grid">
                    {features.map((feature) => (
                        <div key={feature.title} className="column">
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default About
