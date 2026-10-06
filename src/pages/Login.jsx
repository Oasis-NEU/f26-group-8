import {useState} from 'react';
import { Link } from 'react-router';

function Login() {
    const [message, setMessage] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        const email = event.target.email.value;
        setMessage(`Welcome, ${email}!`);
    }

return (
    <div className="page">
        <h1 className="page-title">Log in</h1>

        <form onSubmit={handleSubmit} className="card">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required />

            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />

            <button type="submit" className="btn-primary">Log in</button>

            <p role="status" className='message'>{message}</p>
        </form>
        
        <Link to="/about" className="link">Back to About</Link>
        </div>
    )  
}

export default Login