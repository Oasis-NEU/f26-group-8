import {useState} from 'react';
import { Link } from 'react-router';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
        event.preventDefault();

        // Perform login logic here
        if (email === '' || password === '') {
            setError('Please enter both email and password.');
            return;
        }

        // Login Success 
        setError('The login worked! Redirecting to the dashboard...');
    }
    return(
        <div className="page">
            <h1 className="page-title">Login</h1>
            <form onSubmit={handleSubmit} className="card">
                <div className="field">
                    <label htmlFor="email" className="label">Email</label>
                    <input
                        type="email"
                        id="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="field">
                    <label htmlFor="password" className="label">Password</label>
                    <input
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                    />
                </div>
                {error && <p role="alert" className="error">{error}</p>}
                <button type="submit" className="btn-primary">
                    Login
                </button>
            </form>
            <Link to="/about" className="link">
                Back to About
            </Link>
        </div>
    )
}
export default Login;