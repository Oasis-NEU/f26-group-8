// Login.jsx is the Log in page (yoursite.com/login).
// For now it only shows a welcome message. It doesn't really log anyone in yet,
// because the site doesn't have a backend (server and database) yet.

// useState lets the page remember a value and redraw itself when it changes.
import {useState} from 'react';
// Link makes a clickable link to another page of our site.
import { Link } from 'react-router';

function Login() {
    // "message" is the text shown under the form. It starts empty ('').
    // Calling setMessage('...') changes it, and React updates the page.
    const [message, setMessage] = useState('');

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
    }

return (
    // "page" is the shared page layout in index.css
    <div className="page">
        {/* The blue title box at the top */}
        <h1 className="page-title">Log in</h1>

        {/* onSubmit={handleSubmit} runs the function above when the form is sent.
            "card" is the white box around the form */}
        <form onSubmit={handleSubmit} className="card">
            {/* htmlFor="email" connects this label to the input with id="email".
                Clicking the label focuses the input, and screen readers read
                the label out loud (WCAG) */}
            <label htmlFor="email">Email</label>
            {/* type="email" checks it looks like an email address.
                autoComplete="email" lets the browser fill it in for you.
                required means the form can't be sent while it's empty */}
            <input id="email" name="email" type="email" autoComplete="email" required />

            <label htmlFor="password">Password</label>
            {/* type="password" hides what you type as dots.
                "current-password" lets password managers fill in a saved password */}
            <input id="password" name="password" type="password" autoComplete="current-password" required />

            {/* type="submit" means clicking this button sends the form */}
            <button type="submit" className="btn-primary">Log in</button>

            {/* Shows the message. role="status" makes screen readers read the
                message out loud when it appears (WCAG) */}
            <p role="status" className='message'>{message}</p>
        </form>

        {/* Link back to the About page */}
        <Link to="/about" className="link">Back to About</Link>
        </div>
    )
}

// Lets App.jsx import this page.
export default Login
