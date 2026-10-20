// Login.jsx is the Log in page (yoursite.com/login).
// For now it only shows a welcome message. It doesn't really log anyone in yet,
// because the site doesn't have a backend (server and database) yet.
// It looks just like the Sign up page (same background, top bar, box, and
// animations), because it uses the same classes from index.css.
// The styles for this page are in index.css, under "Sign up page".

// useState lets the page remember a value and redraw itself when it changes.
import { useState } from 'react';
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

// The words typed after "Log in to find" at the top of the page. It types
// through them once and stops on the last one. (This list lives outside
// Login, so it stays the same list on every redraw and the typing isn't restarted)
const bannerWords = ['internships', 'co-ops', 'research positions', 'your next opportunity'];

function Login() {
    // "message" is the text shown above the Log in button. It starts empty ('').
    // Calling setMessage('...') changes it, and React updates the page.
    const [message, setMessage] = useState('');

    // navigate('/feed') // Sends the user to the Feed page after Logging in
    const navigate = useNavigate();

    // Runs when the form is submitted (the Log in button is clicked,
    // or Enter is pressed).
    function handleSubmit(event) {
        // Normally submitting a form reloads the whole page. This stops that.
        event.preventDefault();
        // event.target is the form. .email is the input with name="email",
        // and .value is what the user typed in it.
        const email = event.target.email.value;
        // The backticks ` ` let you put a variable inside text with ${ }.
        setMessage(`Welcome, ${email}!`);
        // Remember that you're logged in, so the About page shows your
        // circle and a Home button instead of "Log in" and "Sign up"
        markLoggedIn();
        // Navigate to the feed page after successful login
        navigate('/feed');
    }

    return (
        // "about-site" gives the page the About page's light blue background, fonts,
        // and keyboard outlines. "signup-site" adds the Sign up page's background
        // (a faint grid and a soft glow, in index.css)
        <div className="about-site signup-site">
            {/* <title> is the name shown on the browser tab (WCAG) */}
            <title>Log in | ScoutSearch</title>

            {/* The bar at the top, the same one the Sign up page has. It has the
                logo and the section tabs. The logo goes back to the About page */}
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
                {/* "Log in to find ..." typed out above the box. It's a <p>, not a
                    heading: the page's one <h1> is "Log in" inside the box */}
                <TextType
                    as="p"
                    className="signup-banner"
                    prefix="Log in to find"
                    words={bannerWords}
                />

                {/* "signup-box" is the pale blue box around the form */}
                <div className="signup-box">
                    {/* <h1> is the main heading. Each page should have only one */}
                    <h1 className="signup-title">Log in</h1>
                    <p className="signup-intro">Welcome back to ScoutSearch.</p>

                    {/* onSubmit={handleSubmit} runs the function above when the form is sent */}
                    <form onSubmit={handleSubmit}>
                        {/* htmlFor="email" connects this label to the input with id="email".
                            Clicking the label focuses the input, and screen readers read
                            the label out loud (WCAG) */}
                        <label htmlFor="email" className="signup-label">Email</label>
                        {/* type="email" checks it looks like an email address.
                            autoComplete="email" lets the browser fill it in for you.
                            required means the form can't be sent while it's empty */}
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="signup-input"
                        />

                        <label htmlFor="password" className="signup-label">Password</label>
                        {/* type="password" hides what you type as dots.
                            "current-password" lets password managers fill in a saved password */}
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="signup-input"
                        />

                        {/* Shows the message. role="status" makes screen readers read the
                            message out loud when it appears (WCAG) */}
                        <p role="status" className="signup-message">{message}</p>

                        {/* type="submit" means clicking this button sends the form.
                            "about-button" is the sky-blue button from the About page */}
                        <button type="submit" className="about-button signup-submit">Log in</button>
                    </form>

                    {/* The "or" line between the form and the buttons. It's only
                        decoration, so screen readers skip it (WCAG) */}
                    <p className="signup-divider" aria-hidden="true">or continue with</p>

                    {/* The Google and Microsoft buttons, side by side. They're only for looks right now:
                        type="button" means they don't send the form, and they don't
                        do anything yet when clicked. Later they would start the
                        Google or Microsoft log in */}
                    <div className="signup-social-list">
                        {/* aria-label gives screen readers (and voice control) the
                            full words, since the button only shows the name (WCAG) */}
                        <button type="button" className="signup-social-button" aria-label="Continue with Google">
                            <ServiceLogo name="google" />
                            Google
                        </button>
                        <button type="button" className="signup-social-button" aria-label="Continue with Microsoft">
                            <ServiceLogo name="microsoft" />
                            Microsoft
                        </button>
                    </div>
                </div>

                {/* For people who don't have an account yet. It fades smoothly
                    to the Sign up page */}
                <p className="signup-switch">
                    New to ScoutSearch? <SmoothLink to="/signup">Sign up</SmoothLink>
                </p>
            </main>
        </div>
    )
}

// Lets App.jsx import this page.
export default Login
