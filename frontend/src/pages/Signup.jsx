// Signup.jsx is the Sign up page (yoursite.com/signup).
// For now it only shows a thank-you message. It doesn't really create an
// account yet, because the site doesn't have a backend (server and database) yet.

// useState lets the page remember a value and redraw itself when it changes.
import { useState } from 'react';
// Link makes a clickable link to another page of our site.
import { Link } from 'react-router';

function Signup() {
    // "message" is the text shown under the form. It starts empty ('').
    // Calling setMessage('...') changes it, and React updates the page.
    const [message, setMessage] = useState('');

    // Runs when the form is submitted (the Sign up button is clicked,
    // or Enter is pressed).
    function handleSubmit(event) {
        // Normally submitting a form reloads the whole page. This stops that.
        event.preventDefault();
        // event.target is the form. .name is the input with name="name",
        // and .value is what the user typed in it.
        const name = event.target.name.value;
        // The backticks ` ` let you put a variable inside text with ${ }.
        setMessage(`Thanks for signing up, ${name}!`);
    }

    return (
        // "page" is the shared page layout in index.css
        <div className="page">
            {/* The blue title box at the top */}
            <h1 className="page-title">Sign up</h1>

            {/* onSubmit={handleSubmit} runs the function above when the form is sent.
                "form-box" is the white box around the form */}
            <form onSubmit={handleSubmit} className="form-box">
                {/* htmlFor="name" connects this label to the input with id="name".
                    Clicking the label focuses the input, and screen readers read
                    the label out loud (WCAG) */}
                <label htmlFor="name">Name</label>
                {/* autoComplete="name" lets the browser fill in your name.
                    required means the form can't be sent while it's empty */}
                <input id="name" name="name" type="text" autoComplete="name" required />

                <label htmlFor="email">Email</label>
                {/* type="email" checks it looks like an email address */}
                <input id="email" name="email" type="email" autoComplete="email" required />

                <label htmlFor="password">Password</label>
                {/* type="password" hides what you type as dots.
                    "new-password" tells password managers to suggest a strong new password */}
                <input id="password" name="password" type="password" autoComplete="new-password" required />

                {/* type="submit" means clicking this button sends the form */}
                <button type="submit" className="form-button">Sign up</button>

                {/* Shows the message. role="status" makes screen readers read the
                    message out loud when it appears (WCAG) */}
                <p role="status" className="form-message">{message}</p>
            </form>

            {/* Link back to the About page */}
            <Link to="/about" className="back-link">Back to About</Link>
        </div>
    )
}

// Lets App.jsx import this page.
export default Signup
