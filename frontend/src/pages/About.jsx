// About.jsx is the About page. It's also the homepage, because App.jsx
// sends "/" here.
// It's light blue like the other pages, and its first screen has a clickable
// example job search, so visitors can see what ScoutSearch is like before
// signing up. All the jobs on it are made up (and labeled as examples),
// because the site isn't connected to real listings yet.
// The styles for this page are in index.css, under "About page".

// useState lets a component remember something (here: which example tab is
// selected) and redraw itself when it changes.
// useRef keeps a reference to something on the screen (here: the tab buttons),
// so the code can move the keyboard focus to it.
import { useRef, useState } from "react";

// Link makes a clickable link to another page of OUR site (like /signup).
// It changes the page without reloading the whole website.
import { Link } from "react-router";
// AccountMenu is your circle and its dropdown, shown in the top bar when
// you're logged in (components/AccountMenu.jsx).
import AccountMenu from "../components/AccountMenu.jsx";
// isLoggedIn tells the page if you're logged in (login-status.js).
import { isLoggedIn } from "../login-status.js";

// Animated pieces based on React Bits (reactbits.dev). Each file explains
// what it does, and their styles are in index.css under "React Bits effects".
// ClickSpark: sparks wherever you click on the page
import ClickSpark from "../components/reactbits/ClickSpark.jsx";
// FadeContent: a box that fades in as you scroll down to it
import FadeContent from "../components/reactbits/FadeContent.jsx";
// ShinyText: words with a band of light sweeping across them
import ShinyText from "../components/reactbits/ShinyText.jsx";
// SpotlightCard: a box with a soft glow that follows the mouse
import SpotlightCard from "../components/reactbits/SpotlightCard.jsx";
// StarBorder: a link with small lights traveling around its edge
import StarBorder from "../components/reactbits/StarBorder.jsx";
// Waves: faint flowing lines behind the whole page, with a Pause button
import Waves from "../components/reactbits/Waves.jsx";

// ---------- Sample data ----------
// Later, this data would come from the backend instead.

// The example job search on the first screen. Each tab has its own made-up
// listings. The first listing in each tab is the big one: it also shows
// "Why it matched" reasons and a Sign up link.
// "student" is the made-up student the listings were matched to, so the
// "Why it matched" reasons make sense ("Fits your interest: Biology").
const exampleSearches = [
    {
        id: "internships",
        label: "Internships",
        student: "an 11th grader with no work experience yet",
        listings: [
            {
                id: 1,
                title: "Marketing Intern",
                org: "Harbor Street Bakery",
                initials: "HB",
                facts: ["Quincy, MA", "Paid, $17/hr", "Summer, part-time"],
                matches: ["Open to high school students", "No experience needed", "Part-time hours"],
            },
            {
                id: 2,
                title: "Library Tech Intern",
                org: "Westbrook Public Library",
                initials: "WL",
                facts: ["Remote", "Unpaid", "School year"],
            },
        ],
    },
    {
        id: "co-ops",
        label: "Co-ops",
        student: "a college sophomore studying Computer Science",
        listings: [
            {
                id: 3,
                title: "Software Engineering Co-op",
                org: "Quillfield Software",
                initials: "QS",
                facts: ["Boston, MA", "Paid, $25/hr", "Hybrid"],
                matches: ["Open to college students", "Fits your major: Computer Science", "Intro programming course"],
            },
            {
                id: 4,
                title: "Mechanical Design Co-op",
                org: "Northfield Robotics",
                initials: "NR",
                facts: ["Burlington, MA", "Paid, $24/hr", "On-site"],
            },
        ],
    },
    {
        id: "research",
        label: "Research",
        student: "a high school junior who likes Biology",
        listings: [
            {
                id: 5,
                title: "Summer Research Assistant",
                org: "Coastal Ecology Lab",
                initials: "CE",
                facts: ["Nahant, MA", "Stipend", "Summer, full-time"],
                matches: ["Open to high school juniors and seniors", "Fits your interest: Biology", "No lab experience needed"],
            },
            {
                id: 6,
                title: "Psychology Lab Assistant",
                org: "Mind and Behavior Lab",
                initials: "MB",
                facts: ["Boston, MA", "Unpaid", "10 hours a week"],
            },
        ],
    },
]

// The "At a glance" strip under the headline: the whole page in 3 short
// facts, for people who only want a quick look. "label" is the bold first
// word, and "icon" picks the small picture (see FeatureIcon below).
const glanceFacts = [
    { label: "For", text: "high school and college students", icon: "users" },
    { label: "Find", text: "internships, co-ops, and research positions", icon: "briefcase" },
    { label: "How", text: "sign up, filter, and apply", icon: "check" },
]

// The four features in the "Why use our platform?" section.
// Each description is one short sentence with the important words first,
// so people skimming get the point without reading the whole thing.
// "icon" picks which small picture goes next to it (see FeatureIcon below).
// To add a fifth feature, just add another { title, description, icon } here.
const features = [
    {
        title: "Made for Students by Students",
        description: "Built for high school and college students looking for internships, co-ops, and research positions.",
        icon: "graduation-cap",
    },
    {
        title: "Filters",
        description: "Filter by major, GPA, location, and remote or on-site, so you only see what fits you.",
        icon: "sliders",
    },
    {
        title: "Real Events",
        description: "Find real events near you or online that match your interests and qualifications.",
        icon: "calendar",
    },
    {
        title: "Resume Builder",
        description: "Enter your information once, get a resume in seconds, and download it as a PDF.",
        icon: "file",
    },
]

// The questions in the "Questions" section. Only the question shows until
// someone opens it, so the answers don't get in the way of people who
// don't need them. The ones people ask most come first.
const questions = [
    {
        question: "Is ScoutSearch free?",
        answer: "Yes. ScoutSearch is free to join and use.",
    },
    {
        question: "Can I sign up if I'm under 18?",
        answer: "Yes. High school students can sign up, including students under 18.",
    },
    {
        question: "Is my information safe?",
        answer: "Yes. We keep your information safe, and your password is scrambled (hashed) before it's saved, so no one can read it, not even our team.",
    },
    {
        question: "What's a co-op?",
        answer: "A co-op (short for \"cooperative education\") is a full-time job, usually 4 to 6 months long, that college students do as part of their program, often instead of classes for a semester. It's real work experience in your field.",
    },
    {
        question: "What's the difference between an internship and a research position?",
        answer: "An internship is a short job at a company or organization, often over the summer or part-time during the school year. A research position means helping a professor or lab study something, like running experiments or collecting data.",
    },
    {
        question: "Do I need experience?",
        answer: "Not always. Many positions, especially ones for high school students, are open to beginners. Each listing says what it requires, like the \"Why it matched\" reasons in the example listings at the top of this page.",
    },
    {
        question: "Who makes ScoutSearch?",
        answer: "A team of students, working with a mentor, as part of Oasis at Northeastern University.",
    },
]

// The three steps in the "How it works" section, in order.
const steps = [
    {
        number: 1,
        title: "Sign up",
        description: "Create your account as a high school or college student.",
    },
    {
        number: 2,
        title: "Search and filter",
        description: "Search by major, GPA, location, remote or on-site, and more.",
    },
    {
        number: 3,
        title: "Build your resume and apply",
        description: "Enter your information once and generate a resume in seconds.",
    },
]

// ---------- Pieces of the page ----------
// Each function below is one piece of the page.

// A small line drawing for one feature. "props" holds the info passed in by
// About below (props.name picks the drawing).
// The drawings come from the free Lucide icon set. They're decoration (the
// feature's heading says the same thing), so aria-hidden hides them from
// screen readers (WCAG).
function FeatureIcon(props) {
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
            {/* Only the lines for the chosen icon are drawn */}
            {props.name === "graduation-cap" && (
                <>
                    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                    <path d="M22 10v6" />
                    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                </>
            )}
            {props.name === "sliders" && (
                <>
                    <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3" />
                    <path d="M14 2v4M8 10v4M16 18v4" />
                </>
            )}
            {props.name === "calendar" && (
                <>
                    <path d="M8 2v4M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                </>
            )}
            {props.name === "users" && (
                <>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </>
            )}
            {props.name === "briefcase" && (
                <>
                    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    <rect width="20" height="14" x="2" y="6" rx="2" />
                </>
            )}
            {props.name === "check" && (
                <>
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                </>
            )}
            {props.name === "file" && (
                <>
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M16 13H8M16 17H8M10 9H8" />
                </>
            )}
        </svg>
    );
}

// One white job card in the example search. props.listing is one listing
// from exampleSearches above. props.big is true for the first card in a tab,
// which also shows "Why it matched" and the Sign up link.
function ListingCard(props) {
    const listing = props.listing;

    return (
        <li className="about-listing">
            <div className="about-listing-top">
                {/* The square with the company's initials. Hidden from screen
                    readers, because the company name right next to it says
                    the same thing (WCAG) */}
                <span className="about-listing-logo" aria-hidden="true">{listing.initials}</span>
                <div>
                    {/* <h3>, because the cards sit under the "Example listings" <h2> */}
                    <h3 className="about-listing-title">{listing.title}</h3>
                    <p className="about-listing-org">{listing.org}</p>
                </div>
            </div>

            {/* Location, pay, and schedule. Each fact is its own list item */}
            <ul className="about-listing-facts">
                {listing.facts.map((fact) => (
                    // React needs a unique "key" on each repeated item. Each
                    // fact's words are different, so they work as the key
                    <li key={fact}>{fact}</li>
                ))}
            </ul>

            {/* Only the big card shows why it matched and the Sign up link.
                "props.big && (...)" means "only draw this when props.big is true" */}
            {props.big && (
                <>
                    <div className="about-match">
                        <p className="about-match-label">Why it matched</p>
                        <ul className="about-match-list">
                            {listing.matches.map((reason) => (
                                <li key={reason}>{reason}</li>
                            ))}
                        </ul>
                    </div>
                    {/* Guests can look at jobs but need an account to apply,
                        so this goes to the Signup page */}
                    <Link to="/signup" className="about-listing-link">
                        Sign up to apply
                    </Link>
                </>
            )}
        </li>
    );
}

// The example job search on the right of the first screen.
// It's built as "tabs" the way screen readers expect (WCAG): the tab buttons
// say which one is selected, and the arrow keys move between them.
function ExampleSearch() {
    // Which tab is selected, as its position in exampleSearches (0 = Internships).
    // setSelected changes it, and React redraws the listings.
    const [selected, setSelected] = useState(0);

    // A list of the 3 tab buttons on the screen, so the arrow keys can move
    // the keyboard focus to the next one
    const tabButtons = useRef([]);

    // The tab that's selected right now
    const search = exampleSearches[selected];

    // Runs when a key is pressed while a tab has the keyboard focus.
    // Right/Left arrows go to the next/previous tab (wrapping around at the
    // ends), and Home/End go to the first/last tab.
    function handleKeyDown(event) {
        const last = exampleSearches.length - 1;
        let next = null;
        if (event.key === "ArrowRight") next = selected === last ? 0 : selected + 1;
        if (event.key === "ArrowLeft") next = selected === 0 ? last : selected - 1;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = last;

        // Any other key: do nothing
        if (next === null) return;

        // Stops the page from scrolling (Home and End normally do that)
        event.preventDefault();
        setSelected(next);
        tabButtons.current[next].focus();
    }

    return (
        <section className="about-demo" aria-labelledby="about-demo-title">
            <div className="about-demo-head">
                <h2 id="about-demo-title" className="about-demo-title">Example listings</h2>
                <p className="about-demo-note">Made-up jobs, to show how it works</p>
            </div>

            {/* The white tray with the 3 tabs. data-selected tells index.css
                which tab to put the blue highlight on (0, 1, or 2) */}
            <div className="about-tabs" data-selected={selected}>
                {/* The real tab buttons. role="tablist" and role="tab" tell screen
                    readers these buttons switch what's shown below them */}
                <div className="about-tab-list" role="tablist" aria-label="Kind of position" onKeyDown={handleKeyDown}>
                    {exampleSearches.map((item, index) => (
                        <button
                            key={item.id}
                            // Saves this button in the tabButtons list (for the arrow keys).
                            // The curly braces matter: in React 19, anything a ref
                            // function returns is treated as a "clean up" step
                            ref={(button) => { tabButtons.current[index] = button; }}
                            id={"about-tab-" + item.id}
                            className="about-tab"
                            type="button"
                            role="tab"
                            // aria-selected tells screen readers which tab is on.
                            // (In Windows High Contrast mode, index.css also uses it
                            // to underline the selected tab)
                            aria-selected={index === selected}
                            // Which part of the page this tab controls
                            aria-controls="about-example-panel"
                            // Only the selected tab can be reached with the Tab key;
                            // the arrow keys move between tabs (the usual way tabs work)
                            tabIndex={index === selected ? 0 : -1}
                            onClick={() => setSelected(index)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* A blue copy of the tab words, laid on top of the buttons.
                    index.css cuts it down so only the selected tab shows, and
                    slides that cut-out when you pick another tab.
                    aria-hidden hides this copy from screen readers, because they
                    already hear the real buttons above (WCAG) */}
                <div className="about-tab-highlight" aria-hidden="true">
                    {exampleSearches.map((item) => (
                        <span key={item.id}>{item.label}</span>
                    ))}
                </div>
            </div>

            {/* The listings for the selected tab. aria-labelledby names this
                area after its tab ("Co-ops") for screen readers */}
            <div id="about-example-panel" role="tabpanel" aria-labelledby={"about-tab-" + search.id}>
                {/* Who these listings were matched to (made up, like the jobs) */}
                <p className="about-demo-student">Matches for an example student: {search.student}</p>
                <ul className="about-listings">
                    {search.listings.map((listing, index) => (
                        <ListingCard key={listing.id} listing={listing} big={index === 0} />
                    ))}
                </ul>
            </div>
        </section>
    );
}

// About is the whole page. It puts the pieces above together.
function About() {
    // true if you're logged in (login-status.js). It's read once when the
    // page opens. (Passing isLoggedIn without () means "only check the first time")
    const [loggedIn] = useState(isLoggedIn);

    return (
        // "about-site" wraps the whole page, so index.css can give it its colors and
        // give it its own fonts without changing any other page
        <div className="about-site">
            {/* <title> is the name shown on the browser tab. React 19 moves it
                into the page's <head> for us. Screen readers say it first, so
                people know which page they landed on (WCAG) */}
            <title>About | ScoutSearch</title>

            {/* The see-through layer the click sparks are drawn on */}
            <ClickSpark />

            {/* The flowing lines behind the page (and their Pause button) */}
            <Waves />

            {/* Hidden until you press Tab, then lets keyboard users jump
                straight past the top bar to the page's content (WCAG) */}
            <a className="about-skip-link" href="#main">Skip to main content</a>

            {/* The bar at the top of the page */}
            <header className="about-bar">
                <div className="about-inner about-bar-row">
                    {/* The site's name. Clicking it goes back to the top of the page.
                        The diamond is decoration, so screen readers skip it */}
                    <a className="about-logo" href="#main">
                        <span className="about-blaze" aria-hidden="true"></span>
                        ScoutSearch
                    </a>

                    {/* <nav> marks this as navigation. aria-label="Sections" is
                        the name screen readers say for it */}
                    <nav className="about-bar-nav" aria-label="Sections">
                        {/* Each link jumps to the section with the matching id below */}
                        <ul className="about-bar-links">
                            <li><a href="#who-its-for">Who it's for</a></li>
                            <li><a href="#why-use-our-platform">Why use our platform?</a></li>
                            <li><a href="#who-we-are">Who we are</a></li>
                            <li><a href="#questions">Questions</a></li>
                        </ul>
                    </nav>

                    {/* The right side. "loggedIn ? (...) : (...)" means "if you're
                        logged in, show the first part; if not, show the second" */}
                    <div className="about-bar-actions">
                        {loggedIn ? (
                            <>
                                {/* Logged in: a Home button back to the Feed, and your
                                    circle with the dropdown (components/AccountMenu.jsx) */}
                                <Link to="/feed" className="about-button">Home</Link>
                                <AccountMenu />
                            </>
                        ) : (
                            <>
                                {/* Not logged in: Log in and Sign up */}
                                <Link to="/login" className="about-login-link">Log in</Link>
                                {/* Sign up is bright blue, the accent color, so it's the one that stands out */}
                                <Link to="/signup" className="about-button">Sign up</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* <main> tells screen readers where the main content starts.
                id="main" is where the skip link and the logo jump to */}
            <main id="main" className="about-main">
                {/* The first screen: the headline on the left, the example
                    job search on the right */}
                <div className="about-hero">
                    <div className="about-inner about-hero-grid">
                        {/* Left column: the headline, the button, and the credit.
                            FadeContent makes it fade in and rise when the page opens */}
                        <FadeContent className="about-hero-text">
                            {/* <h1> is the main heading. Each page should have only one */}
                            <h1 className="about-title">Find internships, co-ops, and research positions</h1>
                            {/* A band of light sweeps across these words twice, then stops */}
                            <p className="about-subtitle">
                                <ShinyText>For high school and college students</ShinyText>
                            </p>
                            <div className="about-hero-actions">
                                {/* The big Sign up button, with small lights that travel
                                    around its edge when the page opens and while you
                                    point at it */}
                                <StarBorder to="/signup" className="about-button about-button-big">Sign up</StarBorder>
                                {/* Right under the button, because "is it free?" is often
                                    the first thing people want to know before signing up */}
                                <p className="about-credit">Free to join. A Northeastern Oasis Project</p>
                            </div>
                        </FadeContent>

                        {/* The clickable example job search (the ExampleSearch piece above) */}
                        <ExampleSearch />
                    </div>

                    {/* "At a glance": the whole page in 3 short facts. It doesn't
                        fade in, so it's there right away for people who only glance */}
                    <section className="about-inner" aria-labelledby="about-glance-title">
                        {/* A heading only screen readers hear ("sr-only" hides it on
                            screen), so they can find this part by its name (WCAG) */}
                        <h2 id="about-glance-title" className="sr-only">At a glance</h2>
                        <ul className="about-glance">
                            {glanceFacts.map((fact) => (
                                // The label is unique, so it works as the key
                                <li key={fact.label} className="about-glance-item">
                                    <span className="about-glance-icon">
                                        <FeatureIcon name={fact.icon} />
                                    </span>
                                    <span>
                                        <strong>{fact.label}</strong> {fact.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* "Who it's for" section. The "Who it's for" link in the top bar jumps here */}
                <section id="who-its-for" className="about-section">
                    {/* FadeContent: the section's content fades in as you scroll to it */}
                    <FadeContent className="about-inner">
                        <h2 className="about-section-title">Who it's for</h2>
                        {/* The two boxes side by side (they stack on phones).
                            SpotlightCard adds a soft glow that follows the mouse */}
                        <div className="about-audience-grid">
                            <SpotlightCard className="about-audience">
                                <h3>High School Students</h3>
                                <p>Find internships and research positions while you're still in high school. The experience gives you something to show on college applications and a head start on finding a co-op once you're in college.</p>
                                {/* A shortcut for people who already know this is them */}
                                <Link to="/signup" className="about-audience-link">Sign up as a high school student</Link>
                            </SpotlightCard>
                            <SpotlightCard className="about-audience">
                                <h3>College Students</h3>
                                <p>Find co-ops, internships, and research positions that fit your major. Each one builds experience toward the career you want after graduation.</p>
                                <Link to="/signup" className="about-audience-link">Sign up as a college student</Link>
                            </SpotlightCard>
                        </div>
                    </FadeContent>
                </section>

                {/* "Why use our platform?" section: the heading on the left,
                    the list of features on the right */}
                <section id="why-use-our-platform" className="about-section">
                    {/* Fades in as you scroll to it, then the features arrive one by one
                        (see "About page: motion" in index.css) */}
                    <FadeContent className="about-inner about-split">
                        <h2 className="about-section-title">Why use our platform?</h2>
                        <ul className="about-features">
                            {/* .map() goes through the features list at the top of
                                this file and makes one list item for each one */}
                            {features.map((feature) => (
                                // The title is unique, so it works as the key
                                <li key={feature.title} className="about-feature">
                                    <span className="about-feature-icon">
                                        <FeatureIcon name={feature.icon} />
                                    </span>
                                    <div>
                                        <h3>{feature.title}</h3>
                                        <p>{feature.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </FadeContent>
                </section>

                {/* "How it works" section: 3 steps, in order */}
                <section id="how-it-works" className="about-section">
                    {/* Fades in as you scroll to it, then the steps arrive one by one,
                        left to right (see "About page: motion" in index.css) */}
                    <FadeContent className="about-inner">
                        <h2 className="about-section-title">How it works</h2>
                        {/* <ol> is a numbered list, which tells screen readers the
                            steps go in order */}
                        <ol className="about-steps">
                            {steps.map((step) => (
                                <li key={step.number} className="about-step">
                                    {/* The big number. Hidden from screen readers,
                                        because the <ol> already says "1 of 3" (WCAG) */}
                                    <span className="about-step-number" aria-hidden="true">{step.number}</span>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </li>
                            ))}
                        </ol>
                    </FadeContent>
                </section>

                {/* "Who we are" section. The "Who we are" link in the top bar jumps here */}
                <section id="who-we-are" className="about-section">
                    {/* Fades in as you scroll to it */}
                    <FadeContent className="about-inner about-split">
                        <h2 className="about-section-title">Who we are</h2>
                        <p className="about-team-text">We are a group of students, working with a mentor, building a platform for finding co-ops, internships, and research positions. Our goal is to make it easier for students to find opportunities that fit their needs and interests.</p>
                    </FadeContent>
                </section>

                {/* "Questions" section. The "Questions" link in the top bar jumps here */}
                <section id="questions" className="about-section">
                    {/* Fades in as you scroll to it */}
                    <FadeContent className="about-inner">
                        <h2 className="about-section-title">Questions</h2>
                        {/* Each <details> box shows only its question (the <summary>)
                            until someone clicks or taps it. It works with the keyboard
                            (Tab, then Enter) and screen readers say "collapsed" or
                            "expanded" without any extra code (WCAG) */}
                        <div className="about-faq">
                            {questions.map((item) => (
                                // Each question is different, so it works as the key
                                <details key={item.question} className="about-faq-item">
                                    <summary className="about-faq-question">{item.question}</summary>
                                    <p className="about-faq-answer">{item.answer}</p>
                                </details>
                            ))}
                        </div>
                    </FadeContent>
                </section>

                {/* The blue band at the very bottom. After reading everything
                    above, visitors get one more chance to sign up */}
                <section className="about-ready" aria-labelledby="about-ready-title">
                    <div className="about-inner about-ready-row">
                        {/* <h2>, like the other section headings, so the heading
                            order stays h1, then h2s (WCAG) */}
                        <h2 id="about-ready-title" className="about-ready-title">Ready to find your first opportunity?</h2>
                        {/* A navy button, because a sky-blue one would disappear on the sky-blue band */}
                        <Link to="/signup" className="about-button about-button-big about-button-navy">
                            Sign up
                        </Link>
                    </div>
                </section>
            </main>

            {/* The footer at the very bottom: the name, who made it, and the
                main links again, for people who scroll to the end looking for them.
                TEAM TO-DO: add a contact email here once the team picks one */}
            <footer className="about-footer">
                <div className="about-inner about-footer-row">
                    <div>
                        <p className="about-footer-name">ScoutSearch</p>
                        <p>A Northeastern Oasis Project</p>
                    </div>
                    {/* aria-label names this group of links for screen readers,
                        so it isn't confused with the top bar's links */}
                    <nav aria-label="Footer">
                        <ul className="about-footer-links">
                            <li><a href="#who-its-for">Who it's for</a></li>
                            <li><a href="#why-use-our-platform">Why use our platform?</a></li>
                            <li><a href="#questions">Questions</a></li>
                            <li><Link to="/login">Log in</Link></li>
                            <li><Link to="/signup">Sign up</Link></li>
                        </ul>
                    </nav>
                </div>
            </footer>
        </div>
    )
}

// Lets App.jsx import this page.
export default About
