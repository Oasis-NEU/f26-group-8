// About.jsx is the About page. It's also the homepage, because App.jsx
// sends "/" here.

// Link makes a clickable link to another page of OUR site (like /signup).
// It changes the page without reloading the whole website.
import { Link } from "react-router";

// The four boxes in the "Why use our platform?" section.
// Each item has a title and a description. Instead of writing four boxes
// by hand, the page loops over this list (see features.map further down).
// To add a fifth box, just add another { title, description } here.
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

// The About page component. Whatever it returns is what shows on the screen.
// Note: in JSX you write className="..." instead of class="..." (the CSS for
// each className is in index.css).
function About() {
    return (
        // <> and </> are a "fragment": a wrapper you can't see. A component can
        // only return one thing, so this groups the top bar and the main
        // content together without adding an extra box to the page.
        <>
            {/* Bar at the top of the page. Each tab jumps to the section
                with the matching id below (for example #who-we-are) */}
            <header className="top-bar">
                {/* <nav> marks this as navigation (a group of links).
                    aria-label="Main" is the name screen readers say out loud for it */}
                <nav className="top-bar-inner" aria-label="Main">
                    {/* The tabs. <ul> is a list and each <li> is one item in it.
                        Screen readers announce "list, 3 items" so people know
                        how many tabs there are */}
                    <ul className="tabs">
                        {/* href="#who-we-are" jumps to the element with id="who-we-are" on this page */}
                        <li><a href="#who-we-are">Who we are</a></li>
                        <li><a href="#who-its-for">Who it's for</a></li>
                        <li><a href="#why-use-our-platform">Why use our platform?</a></li>
                    </ul>
                    {/* The Sign up and Log in buttons on the right side of the bar */}
                    <div className="top-bar-buttons">
                        {/* to="/signup" goes to the Signup page (set up in App.jsx) */}
                        <Link to="/signup" className="btn-primary">
                            Sign up
                        </Link>
                        <Link to="/login" className="btn-primary">
                            Log in
                        </Link>
                    </div>
                </nav>
            </header>

            {/* <main> tells screen readers where the main content starts, so
                they can skip past the top bar.
                "page" is the shared page layout and "about-page" adds
                About-only spacing (both are in index.css) */}
            <main className="page about-page">
                {/* Title box with the company name */}
                <p className="title-box">ScoutSearch</p>

                {/* The big blue box with the page title */}
                <header className="banner">
                    {/* <h1> is the main heading. Each page should have only one */}
                    <h1 className="banner-title">About Us</h1>
                    <p className="banner-subtitle">A Northeastern Oasis Project...</p>
                </header>

                {/* "Who we are" section. id="who-we-are" is where the
                    "Who we are" tab jumps to */}
                <section id="who-we-are" className="section">
                    {/* <h2> is a section heading (one level below the <h1>) */}
                    <h2 className="section-title">Who we are</h2>
                    {/* The white box around the text */}
                    <div className="column">
                        <p>We are a group of students along with a mentor trying to build a Co-Op, Internship, and Research position platform for students. Our goal is to make it easier for students to find opportunities that fit their needs and interests.</p>
                    </div>
                </section>

                {/* "Who it's for" section. The "Who it's for" tab jumps here */}
                <section id="who-its-for" className="section">
                    <h2>Who it's for</h2>
                    {/* "columns" puts the two white boxes side by side
                        (they stack on phones) */}
                    <div className="columns">
                        <div className="column">
                            {/* <h3> is a smaller heading inside a section */}
                            <h3>High School Students</h3>
                            <p>High school students can use our platform to find internships and research positions that will help them gain experience and prepare for college search or college Co-Op search.</p>
                        </div>
                        <div className="column">
                            <h3>College Students</h3>
                            <p>College students can use our platform to find internships, co-ops, and research positions that will help them gain experience and prepare for their future careers.</p>
                        </div>
                    </div>
                </section>

                {/* "Why use our platform?" section. The third tab jumps here */}
                <section id="why-use-our-platform" className="section">
                    <h2>Why use our platform?</h2>
                    {/* "feature-grid" arranges the boxes in 2 columns (1 on phones) */}
                    <div className="feature-grid">
                        {/* .map() goes through the features list at the top of
                            this file and makes one white box for each item.
                            Curly braces {} mean "this is JavaScript, not plain text" */}
                        {features.map((feature) => (
                            // React needs a unique "key" on each repeated item
                            // to keep track of it. The title is unique, so it works
                            <div key={feature.title} className="column">
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </>
    )
}

// Lets App.jsx import this page.
export default About
