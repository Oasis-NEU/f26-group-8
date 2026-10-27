// Login.jsx is the Log in page (yoursite.com/login).
// For now it only shows a welcome message. It doesn't really log anyone in yet,
// because the site doesn't have a backend (server and database) yet.
// It looks just like the Sign up page (same background, top bar, box, and
// animations), because it uses the same classes from index.css.
// The styles for this page are in index.css, under "Sign up page" and
// "Log in page: Forgot your password?".
//
// The same page also has the "Forgot your password?" screens. When the
// address ends in #forgot-password (yoursite.com/login#forgot-password),
// the box shows a reset form instead of the Log in form. Because the
// address changes, the browser's Back button brings you back to Log in.

// useState lets the page remember a value and redraw itself when it changes.
// useEffect runs a bit of code after the page has been drawn.
// useRef keeps a reference to something on the screen (here: the box's
// heading), so the code can move the keyboard focus to it.
// Fragment groups a few things together without adding a box around them.
import { Fragment, useEffect, useRef, useState } from 'react';
// Link makes a clickable link to another page (or another part) of our site.
// useLocation tells the page what's in the address bar, including the # part.
// useNavigate lets the page send the user to another page of our site.
import { Link, useLocation, useNavigate } from 'react-router';
// SmoothLink is a Link that fades smoothly to the next page (components/SmoothLink.jsx).
import SmoothLink from '../components/SmoothLink.jsx';
// ServiceLogo draws the Google logo (components/ServiceLogo.jsx).
import ServiceLogo from '../components/ServiceLogo.jsx';
// SiteLogo is our own logo: the binoculars picture and the name (components/SiteLogo.jsx).
import SiteLogo from '../components/SiteLogo.jsx';
// TextType: a line that types itself out, one word after another
import TextType from '../components/reactbits/TextType.jsx';
// markLoggedIn remembers that you're logged in (login-status.js)
import { markLoggedIn } from '../login-status.js';
// supabase is our one shared connection to Supabase (supabase.js).
// The Google button uses it to log in
import { supabase } from '../supabase.js';

// The words typed after "Log in to find" at the top of the page. It types
// through them once and stops on the last one. (This list lives outside
// Login, so it stays the same list on every redraw and the typing isn't restarted)
const bannerWords = ['internships', 'co-ops', 'research positions', 'your next opportunity'];

// Works out the red message for one box, using the checks the browser
// already does because of "required" and type="email".
// "input" is the box, and "emptyMessage" is what to say if it's empty.
// It gives back '' (nothing) when the box is fine
function findProblem(input, emptyMessage) {
    // validity.valueMissing is true when a "required" box is empty
    if (input.validity.valueMissing) return emptyMessage;
    // validity.typeMismatch is true when a type="email" box doesn't look like an email
    if (input.validity.typeMismatch) return 'Enter an email address like name@example.com.';
    return '';
}

function Login() {
    // "message" is the text shown above the Log in button. It starts empty ('').
    // Calling setMessage('...') changes it, and React updates the page.
    const [message, setMessage] = useState('');

    // The red messages under the boxes. It's an object with one message per
    // box: errors.email is the Email box's, errors.password the Password box's.
    // It starts as {} (nothing wrong yet). An empty message '' means that box is fine
    const [errors, setErrors] = useState({});

    // navigate('/feed') // Sends the user to the Feed page after Logging in
    const navigate = useNavigate();

    // What's typed in the Email box. The Log in form and the reset form share
    // it, so if you typed your email and then clicked "Forgot your password?",
    // it's already filled in for you
    const [email, setEmail] = useState('');

    // The email the reset link was "sent" to. It starts empty (''). Once it
    // has an address in it, the box shows "Check your email"
    const [sentTo, setSentTo] = useState('');

    // true for a moment after "Send reset link" is clicked, while the button
    // says "Sending link..." (see handleReset)
    const [sending, setSending] = useState(false);

    // Remembers the little wait in handleReset, so it can be cancelled
    // if the person leaves the page during it
    const waitTimer = useRef(null);

    // The big heading in the box ("Log in", "Reset your password", or
    // "Check your email"), so the code can move the keyboard focus onto it
    const headingRef = useRef(null);

    // Which screen the box shows:
    // - 'login': the normal Log in form
    // - 'forgot': the reset form (the address ends in #forgot-password)
    // - 'sent': "Check your email" (after the reset form is sent)
    // location.hash is the # part of the address, like '#forgot-password'
    const location = useLocation();
    let view = 'login';
    if (location.hash === '#forgot-password') {
        view = sentTo ? 'sent' : 'forgot';
    }

    // Which screen was showing last time, so the code below can tell when it changed
    const shownView = useRef(view);

    // Runs after the page is redrawn because the screen changed. It moves the
    // keyboard focus to the new heading, so screen readers read out the new
    // screen's title, and Tab continues from there (WCAG). Without this,
    // keyboard users would be dropped back at the top of the page.
    // (It skips the first time the page opens, because nothing changed yet)
    useEffect(() => {
        if (shownView.current === view) return;
        shownView.current = view;
        headingRef.current.focus();
    }, [view]);

    // When the page is closed or left, stop any wait that's still running
    useEffect(() => {
        return () => clearTimeout(waitTimer.current);
    }, []);

    // After you pick your account on Google's site, Google sends you back to
    // THIS page with a one-time code in the address bar (?code=...).
    // Importing supabase.js above is enough for Supabase to see that code and
    // swap it for a real login. getSession() waits for that swap to finish,
    // then tells us if someone is logged in. If they are, go to the feed.
    // (This also sends people who are already logged in straight to the feed.)
    useEffect(() => {
        // supabase is null when .env.local is missing (see supabase.js), so skip this
        if (!supabase) return;
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                markLoggedIn();
                navigate('/feed');
            }
        });
    }, [navigate]);

    // Runs when the Google button is clicked.
    // "async" lets us "await": wait for Supabase to answer before going on
    async function handleGoogle() {
        // supabase is null when .env.local is missing (see supabase.js)
        if (!supabase) {
            console.error('Google log in: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is missing from .env.local');
            setMessage("Couldn't start Google log in. Please try again.");
            return;
        }
        // This leaves our site and goes to Google's sign-in page.
        // redirectTo is where Google sends you back afterward: this Log in
        // page, so the useEffect above can finish logging you in.
        // window.location.origin is the start of our address (http://localhost:5173)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin + '/login' },
        });
        // An error here means Supabase isn't set up right (for example, the
        // keys in .env.local are missing). The real reason goes to the console (F12)
        if (error) {
            console.error('Google log in failed:', error);
            setMessage("Couldn't start Google log in. Please try again.");
        }
    }

    // Runs when the form is submitted (the Log in button is clicked,
    // or Enter is pressed).
    function handleSubmit(event) {
        // Normally submitting a form reloads the whole page. This stops that.
        event.preventDefault();
        // event.target is the form. form.email is the input with name="email"
        const form = event.target;

        // Check each box and show the red messages (or clear old ones)
        const newErrors = {
            email: findProblem(form.email, 'Enter your email.'),
            password: findProblem(form.password, 'Enter your password.'),
        };
        setErrors(newErrors);
        // If a box has a problem, stop here and put the cursor in the first
        // box that needs fixing, so screen readers read its red message (WCAG)
        if (newErrors.email) {
            form.email.focus();
            return;
        }
        if (newErrors.password) {
            form.password.focus();
            return;
        }

        // .value is what the user typed in the Email box.
        const email = form.email.value;
        // The backticks ` ` let you put a variable inside text with ${ }.
        setMessage(`Welcome, ${email}!`);
        // Remember that you're logged in, so the About page shows your
        // circle and a Home button instead of "Log in" and "Sign up"
        markLoggedIn();
        // Navigate to the feed page after successful login
        navigate('/feed');
    }

    // Runs when the reset form is submitted (the "Send reset link" button is
    // clicked, or Enter is pressed). The browser has already checked that
    // the Email box looks like an email address, because it's type="email"
    function handleReset(event) {
        // Normally submitting a form reloads the whole page. This stops that.
        event.preventDefault();
        // If it's already working on it, ignore a second click or Enter
        if (sending) return;

        // Check the Email box, the same way handleSubmit does
        const form = event.target;
        const emailProblem = findProblem(form.email, 'Enter your email.');
        setErrors({ email: emailProblem });
        if (emailProblem) {
            form.email.focus();
            return;
        }

        // Changes the button's words to "Sending link..."
        setSending(true);

        // A short pause (0.7 seconds) so the words can be read, and then
        // "Check your email" shows. This is only for looks: no email is
        // really sent yet.
        // LATER, if the team keeps email log in, the real email gets sent here
        // instead, with something like:
        //   await supabase.auth.resetPasswordForEmail(email, {
        //       redirectTo: window.location.origin + '/reset-password',
        //   });
        waitTimer.current = setTimeout(() => {
            setSending(false);
            setSentTo(email);
        }, 700);
    }

    return (
        // "about-site" gives the page the About page's light blue background, fonts,
        // and keyboard outlines. "signup-site" adds the Sign up page's background
        // (a faint grid and a soft glow, in index.css)
        <div className="about-site signup-site">
            {/* <title> is the name shown on the browser tab (WCAG).
                It changes with the screen, so the tab says what you're doing */}
            <title>{view === 'login' ? 'Log in | ScoutSearch' : 'Reset your password | ScoutSearch'}</title>

            {/* The bar at the top, the same one the Sign up page has. It has the
                logo and the section tabs. The logo goes back to the About page */}
            <header className="about-bar">
                <div className="about-inner about-bar-row">
                    <SmoothLink className="about-logo" to="/about">
                        <SiteLogo />
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
                    {/* The box shows one of three screens (see "view" above).
                        Each screen is wrapped in a Fragment with its own "key".
                        When the key changes, React builds that screen fresh
                        instead of reusing the old one, so its pieces ease in
                        one after another (the motion in index.css) and you can
                        see what changed */}

                    {/* Screen 1: the normal Log in form */}
                    {view === 'login' && (
                        <Fragment key="login">
                            {/* <h1> is the main heading. Each page should have only one.
                                tabIndex={-1} lets the code focus it (see the useEffect above)
                                without adding it to the Tab order */}
                            <h1 className="signup-title" ref={headingRef} tabIndex={-1}>Log in</h1>
                            <p className="signup-intro">Welcome back to ScoutSearch.</p>

                            {/* onSubmit={handleSubmit} runs the function above when the form is sent.
                                noValidate turns off the browser's own "Please fill out this
                                field" bubbles, so our red messages under the boxes show instead */}
                            <form onSubmit={handleSubmit} noValidate>
                                {/* htmlFor="email" connects this label to the input with id="email".
                                    Clicking the label focuses the input, and screen readers read
                                    the label out loud (WCAG) */}
                                <label htmlFor="email" className="signup-label">Email</label>
                                {/* type="email" checks it looks like an email address.
                                    autoComplete="email" lets the browser fill it in for you.
                                    required means it can't be empty (findProblem checks this).
                                    value and onChange keep what's typed in "email" (above).
                                    Typing also clears the red message ("...errors" copies the
                                    other boxes' messages, and email: '' empties this one).
                                    aria-invalid gives the box its red outline (index.css) and tells
                                    screen readers it has a problem. aria-describedby points at
                                    the red message below, so screen readers read it with the box */}
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="signup-input"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        setErrors({ ...errors, email: '' });
                                    }}
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby="email-error"
                                />
                                {/* The red reason under the box. It's empty when the box is fine */}
                                <p id="email-error" className="signup-field-error">{errors.email}</p>

                                <label htmlFor="password" className="signup-label">Password</label>
                                {/* type="password" hides what you type as dots.
                                    "current-password" lets password managers fill in a saved password.
                                    The rest works like the Email box above */}
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="signup-input"
                                    onChange={() => setErrors({ ...errors, password: '' })}
                                    aria-invalid={Boolean(errors.password)}
                                    aria-describedby="password-error"
                                />
                                <p id="password-error" className="signup-field-error">{errors.password}</p>

                                {/* "Forgot your password?" right under the password box.
                                    to="#forgot-password" adds #forgot-password to the
                                    address, which swaps the box to the reset form. Since the
                                    address changes, Back brings you here again.
                                    onClick clears any old "Check your email" and red
                                    messages, so the reset form always opens fresh */}
                                <p className="signup-forgot">
                                    <Link
                                        to="#forgot-password"
                                        className="signup-forgot-link"
                                        onClick={() => {
                                            setSentTo('');
                                            setErrors({});
                                        }}
                                    >
                                        Forgot your password?
                                    </Link>
                                </p>

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

                            {/* The "Continue with Google" button.
                                type="button" means it doesn't send the form.
                                It logs you in with Google (handleGoogle above) */}
                            <div className="signup-social-list">
                                {/* aria-label gives screen readers (and voice control) the
                                    full words, since the button only shows the name (WCAG) */}
                                <button type="button" className="signup-social-button" aria-label="Continue with Google" onClick={handleGoogle}>
                                    <ServiceLogo name="google" />
                                    Google
                                </button>
                            </div>
                        </Fragment>
                    )}

                    {/* Screen 2: the reset form (the address ends in #forgot-password) */}
                    {view === 'forgot' && (
                        <Fragment key="forgot">
                            <h1 className="signup-title" ref={headingRef} tabIndex={-1}>Reset your password</h1>
                            <p className="signup-intro">
                                Type the email you log in with, and we'll send you a link to make a new password.
                            </p>

                            {/* onSubmit={handleReset} runs the function above when the form is sent.
                                noValidate: our red message shows instead of the browser's bubble */}
                            <form onSubmit={handleReset} noValidate>
                                {/* id="reset-email" is different from the Log in form's
                                    id="email", because two things on a page can't share an id.
                                    The red message works like the Log in form's Email box */}
                                <label htmlFor="reset-email" className="signup-label">Email</label>
                                <input
                                    id="reset-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="signup-input"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        setErrors({ ...errors, email: '' });
                                    }}
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby="reset-email-error"
                                />
                                <p id="reset-email-error" className="signup-field-error">{errors.email}</p>

                                {/* aria-disabled (not "disabled") keeps the button reachable
                                    with Tab while it's working, and the words say what's
                                    happening. handleReset ignores clicks while it's on */}
                                <button type="submit" className="about-button signup-submit" aria-disabled={sending}>
                                    {sending ? 'Sending link...' : 'Send reset link'}
                                </button>
                            </form>
                        </Fragment>
                    )}

                    {/* Screen 3: "Check your email" (after the reset form is sent) */}
                    {view === 'sent' && (
                        <Fragment key="sent">
                            <h1 className="signup-title" ref={headingRef} tabIndex={-1}>Check your email</h1>
                            {/* It says "If there's an account" on purpose. Saying
                                "we found your account" would let anyone type in emails
                                to find out who has an account here. The email is in bold
                                so a typo is easy to spot */}
                            <p className="signup-intro">
                                If there's a ScoutSearch account for <span className="signup-sent-email">{sentTo}</span>, a link to make a new password is on its way.
                            </p>
                            <p className="signup-note">It can take a few minutes. If you don't see it, check your spam folder.</p>

                            {/* Goes back to the normal Log in form (yoursite.com/login,
                                without the # part). It's the main next step, so it gets
                                the sky-blue button look */}
                            <Link to="/login" className="about-button signup-submit signup-submit-link">Back to Log in</Link>

                            {/* Shows the reset form again, with the email still filled
                                in so it's easy to fix a typo */}
                            <button type="button" className="signup-secondary-button" onClick={() => setSentTo('')}>
                                Use a different email
                            </button>
                        </Fragment>
                    )}
                </div>

                {/* The line under the box. It changes with the screen.
                    Each version has its own key, so it's built fresh and eases
                    in too. "Check your email" has no line here, because its
                    "Back to Log in" button is already in the box */}
                {view === 'login' && (
                    // For people who don't have an account yet. It fades
                    // smoothly to the Sign up page
                    <p className="signup-switch" key="login">
                        New to ScoutSearch? <SmoothLink to="/signup">Sign up</SmoothLink>
                    </p>
                )}
                {view === 'forgot' && (
                    // For people who remembered their password after all
                    <p className="signup-switch" key="forgot">
                        Remembered it? <Link to="/login">Back to Log in</Link>
                    </p>
                )}
            </main>
        </div>
    )
}

// Lets App.jsx import this page.
export default Login
