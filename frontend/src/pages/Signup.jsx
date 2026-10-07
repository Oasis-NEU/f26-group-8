import { useState } from 'react';
import { Link } from 'react-router';

function Signup() {
    const [message, setMessage] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        const name = event.target.name.value;
        setMessage(`Thanks for signing up, ${name}!`);
    }

    return (
        <div className="page">
            <h1 className="page-title">Sign up</h1>

            <form onSubmit={handleSubmit} className="card">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" autoComplete="name" required />

                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required />

                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" autoComplete="new-password" required />

                <button type="submit" className="btn-primary">Sign up</button>

                <p role="status" className="message">{message}</p>
            </form>

            <Link to="/about" className="link">Back to About</Link>
        </div>
    )
}

export default Signup
