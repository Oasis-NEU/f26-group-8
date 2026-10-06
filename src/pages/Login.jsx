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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">Login</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-500 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                    <input
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-500 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {error && <p role="alert" className="text-red-700 mb-4">{error}</p>}
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                >
                    Login
                </button>
            </form>
            <Link to="/about" className="mt-6 text-blue-700 underline">
                Back to About
            </Link>
        </div>
    )
}
export default Login;