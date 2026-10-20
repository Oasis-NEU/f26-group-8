// Signup.jsx is the Sign up page (yoursite.com/signup).
// Signing up takes 2 steps, both shown in the same box on this page:
//   Step 1: Name and Email (or Google / Microsoft), then "Continue".
//   Step 2: Password and "Confirm password" (typed twice, so a typo is caught).
// For now it only shows a thank-you message. It doesn't really create an
// account yet, because the site doesn't have a backend (server and database) yet.
// It looks like the About page (same background, top bar, fonts, and button).
// The styles for this page are in index.css, under "Sign up page".

// useState lets the page remember a value and redraw itself when it changes.
// useRef keeps a reference to something on the screen (here: the page's heading),
// so the code can move the keyboard focus to it.
// useEffect runs a bit of code after the page has been redrawn.
import { useEffect, useRef, useState } from 'react';
// Link makes a clickable link to another page of our site.
import { Link } from 'react-router';
// useNavigate lets the page send the user to another page of our site.
import { useNavigate } from 'react-router';
// SmoothLink is a Link that fades smoothly to the next page (components/SmoothLink.jsx).
import SmoothLink from '../components/SmoothLink.jsx';
// ServiceLogo draws the Google and Microsoft logos (components/ServiceLogo.jsx).
import ServiceLogo from '../components/ServiceLogo.jsx';
// TextType: a line that types itself out, one word after another
import TextType from '../components/reactbits/TextType.jsx';
// markLoggedIn remembers that you're logged in (login-status.js)
import { markLoggedIn } from '../login-status.js';

// The words typed after "Join now to find" at the top of the page. It types
// through them once and stops on the last one. (This list lives outside
// Signup, so it stays the same list on every redraw and the typing isn't restarted)
const bannerWords = ['internships', 'co-ops', 'research positions', 'your first opportunity'];

function Signup() {
    // "step" is which part of signing up is showing: 1 (name and email) or
    // 2 (password). It starts at 1. Calling setStep(2) shows step 2.
    const [step, setStep] = useState(1);

    // What was typed on step 1. They're kept here so they aren't lost when the
    // page swaps to step 2 (and so they're still there if someone goes Back)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // "message" is the text shown above the Sign up button on step 2. It
    // starts empty (''). Calling setMessage('...') changes it, and React
    // updates the page.
    const [message, setMessage] = useState('');

    // true for a moment after Continue is clicked, while the button says
    // "Signing you up..." (see handleContinue)
    const [signingUp, setSigningUp] = useState(false);

    // true when the two passwords were different, so the "Confirm password"
    // box can be marked as having a problem
    const [mismatch, setMismatch] = useState(false);

    // The big heading ("Sign up" / "Create a password"), so the code can
    // move the keyboard focus onto it when the step changes
    const headingRef = useRef(null);

    // true when the next redraw is because the step changed (and not
    // because the page just opened)
    const stepJustChanged = useRef(false);

    // Remembers the little wait in handleContinue, so it can be cancelled
    // if the person leaves the page during it
    const waitTimer = useRef(null);

    // navigate('/feed') // Sends the user to the feed page after signing in
    const navigate = useNavigate();

    // Runs after the page is redrawn because "step" changed. Without this,
    // clicking Continue removes the button that had the keyboard focus, and
    // keyboard and screen reader users would be dropped back at the top of
    // the page. Focusing the heading makes screen readers read out the new
    // step's title, and Tab then continues from there (WCAG)
    useEffect(() => {
        if (stepJustChanged.current) {
            stepJustChanged.current = false;
            headingRef.current.focus();
        }
    }, [step]);

    // When the page is closed or left, stop any wait that's still running
    useEffect(() => {
        return () => clearTimeout(waitTimer.current);
    }, []);

    // Runs when step 1 is submitted (the Continue button is clicked, or Enter
    // is pressed). The browser has already checked that Name and Email are
    // filled in, because they're "required".
    function handleContinue(event) {
        // Normally submitting a form reloads the whole page. This stops that.
        event.preventDefault();
        // If it's already working on it, ignore a second click or Enter
        if (signingUp) return;

        // Changes the button's words to "Signing you up..."
        setSigningUp(true);

        // A short pause (0.7 seconds) so the words can be read, and then the
        // password step shows. This is only for looks. Once the site is
        // connected to the backend, the real wait for the server replaces it.
        waitTimer.current = setTimeout(() => {
            stepJustChanged.current = true;
            setSigningUp(false);
            setStep(2);
        }, 700);
    }

    // Runs when the Back button on step 2 is clicked
    function handleBack() {
        stepJustChanged.current = true;
        // Clears the old message, so it isn't there when they come back
        setMessage('');
        setMismatch(false);
        setStep(1);
    }

    // Runs when step 2 is submitted (the Sign up button is clicked,
    // or Enter is pressed).
    function handleSubmit(event) {
        event.preventDefault();
        // event.target is the form. .password and .confirmPassword are the inputs
        // with those names, and .value is what the user typed in them.
        const password = event.target.password.value;
        const confirmPassword = event.target.confirmPassword.value;

        // If the two are different, stop here and say so. The page stays on
        // step 2, and the keyboard focus goes to the box that needs fixing
        if (password !== confirmPassword) {
            setMismatch(true);
            setMessage("The passwords don't match. Please retype them.");
            event.target.confirmPassword.focus();
            return;
        }

        setMismatch(false);
        // The backticks ` ` let you put a variable inside text with ${ }.
        setMessage(`Thanks for signing up, ${name}!`);
        // Signing up also logs you in, so the About page shows your
        // circle and a Home button instead of "Log in" and "Sign up"
        markLoggedIn();
        // Navigate to the feed page after successful signup
        navigate('/Feed');
    }

    return (
        // "about-site" gives the page the About page's light blue background, fonts,
        // and keyboard outlines. "signup-site" adds this page's own background
        // (a faint grid and a soft glow, in index.css)
        <div className="about-site signup-site">
            {/* <title> is the name shown on the browser tab (WCAG) */}
            <title>Sign up | ScoutSearch</title>

            {/* The bar at the top, like the About page's but without the
                Sign up button (you're already on that page) or a Log in link
                (that's under the box instead). It has the logo and the section
                tabs. The logo goes back to the About page */}
            <header className="about-bar">
                <div className="about-inner about-bar-row">
                    <SmoothLink className="about-logo" to="/about">
                        {/* The diamond is decoration, so screen readers skip it */}
                        <span className="about-blaze" aria-hidden="true"></span>
                        ScoutSearch
                    </SmoothLink>

                    {/* The same section tabs as the About page's top bar.
                        aria-label="Sections" is the name screen readers say for this nav.
                        These are plain <a href> links, not <Link>, on purpose: they
                        jump to a spot on ANOTHER page, and <Link> wouldn't scroll
                        down to it. (The site reloads, which is fine here) */}
                    <nav className="about-bar-nav" aria-label="Sections">
                        <ul className="about-bar-links">
                            <li><a href="/about#who-its-for">Who it's for</a></li>
                            <li><a href="/about#why-use-our-platform">Why use our platform?</a></li>
                            <li><a href="/about#who-we-are">Who we are</a></li>
                            <li><a href="/about#questions">Questions</a></li>
                        </ul>
                    </nav>

                </div>
            </header>

            {/* <main> tells screen readers where the main content starts */}
            <main className="signup-main">
                {/* "Join now to find ..." typed out above the box. "signup-banner" is its
                    size and font in index.css. It's a <p>, not a heading: the page's one
                    <h1> is "Sign up" inside the box */}
                <TextType
                    as="p"
                    className="signup-banner"
                    prefix="Join now to find"
                    words={bannerWords}
                />

                {/* "signup-box" is the pale blue box around the form */}
                <div className="signup-box">
                    {/* key={step} tells React "this is a different piece of the page when
                        the step changes", so everything inside is built fresh and plays
                        its fade-up animation again, just like when the page first opens */}
                    <div key={step}>
                        {/* "Step 1 of 2" or "Step 2 of 2". It's part of the heading's
                            neighbor, so screen readers read it right before the title */}
                        <p className="signup-step">Step {step} of 2</p>

                        {/* <h1> is the main heading. Each page should have only one.
                            tabIndex={-1} lets the code focus it (see the useEffect above)
                            without making it a stop when pressing Tab */}
                        <h1 className="signup-title" ref={headingRef} tabIndex={-1}>
                            {step === 1 ? 'Sign up' : 'Create a password'}
                        </h1>

                        {/* "step === 1 && (...)" means "only draw this on step 1" */}
                        {step === 1 && (
                            <>
                                <p className="signup-intro">Create your free ScoutSearch account.</p>

                                {/* onSubmit={handleContinue} runs the function above when the form is sent */}
                                <form onSubmit={handleContinue}>
                                    {/* htmlFor="name" connects this label to the input with id="name".
                                        Clicking the label focuses the input, and screen readers read
                                        the label out loud (WCAG) */}
                                    <label htmlFor="name" className="signup-label">Name</label>
                                    {/* autoComplete="name" lets the browser fill in your name.
                                        required means the form can't be sent while it's empty.
                                        value and onChange keep what's typed in the "name" box above,
                                        so it isn't lost when step 2 shows */}
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        className="signup-input"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    />

                                    <label htmlFor="email" className="signup-label">Email</label>
                                    {/* type="email" checks it looks like an email address */}
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="signup-input"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />

                                    {/* type="submit" means clicking this button sends the form.
                                        "about-button" is the sky-blue button from the About page.
                                        After a click the words change to "Signing you up...".
                                        aria-disabled (not "disabled") keeps the keyboard focus on
                                        the button, and handleContinue ignores clicks while it's on */}
                                    <button type="submit" className="about-button signup-submit" aria-disabled={signingUp}>
                                        {signingUp ? 'Signing you up...' : 'Continue'}
                                    </button>

                                    {/* Hidden on screen. Screen readers read it out when it fills in,
                                        because a button changing its own words isn't always
                                        announced (WCAG). "sr-only" is the hiding class */}
                                    <p role="status" className="sr-only">{signingUp ? 'Signing you up' : ''}</p>
                                </form>

                                {/* The "or" line between the form and the buttons. It's only
                                    decoration, so screen readers skip it (WCAG) */}
                                <p className="signup-divider" aria-hidden="true">or continue with</p>

                                {/* The Google and Microsoft buttons, side by side. They're only for looks right now:
                                    type="button" means they don't send the form, and they don't
                                    do anything yet when clicked. Later they would start the
                                    Google or Microsoft sign-in */}
                                <div className="signup-social-list">
                                    {/* The "or continue with" line above already says
                                        "continue with", so each button only needs the name.
                                        aria-label gives screen readers (and voice control) the
                                        full words (WCAG) */}
                                    <button type="button" className="signup-social-button" aria-label="Continue with Google">
                                        <ServiceLogo name="google" />
                                        Google
                                    </button>
                                    <button type="button" className="signup-social-button" aria-label="Continue with Microsoft">
                                        <ServiceLogo name="microsoft" />
                                        Microsoft
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 2: the password. Only drawn after Continue was clicked */}
                        {step === 2 && (
                            <>
                                <p className="signup-intro">Choose a password for {email}.</p>

                                <form onSubmit={handleSubmit}>
                                    <label htmlFor="password" className="signup-label">Password</label>
                                    {/* type="password" hides what you type as dots.
                                        "new-password" tells password managers to suggest a strong new password.
                                        autoFocus puts the cursor here as soon as step 2 shows */}
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        autoFocus
                                        className="signup-input"
                                    />

                                    {/* The same password typed again, so a typo is caught before the
                                        account is made. aria-invalid tells screen readers (and
                                        index.css, for the red outline) that this box has a problem.
                                        aria-describedby points at the message below, so screen
                                        readers read it along with the box */}
                                    <label htmlFor="confirmPassword" className="signup-label">Confirm password</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="signup-input"
                                        aria-invalid={mismatch}
                                        aria-describedby="signup-message"
                                    />

                                    {/* Shows the message. role="status" makes screen readers read the
                                        message out loud when it appears (WCAG). The red look is only
                                        added when the passwords didn't match */}
                                    <p
                                        id="signup-message"
                                        role="status"
                                        className={mismatch ? 'signup-message signup-message-error' : 'signup-message'}
                                    >
                                        {message}
                                    </p>

                                    <button type="submit" className="about-button signup-submit">Sign up</button>

                                    {/* type="button" so it goes back without sending the form */}
                                    <button type="button" className="signup-secondary-button" onClick={handleBack}>
                                        Back
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>

                {/* For people who already have an account. It's under the box, so it
                    shows on both steps. It fades smoothly to the Login page */}
                <p className="signup-switch">
                    Already have an account? <SmoothLink to="/login">Log in</SmoothLink>
                </p>
            </main>
        </div>
    )
}

// Lets App.jsx import this page.
export default Signup
