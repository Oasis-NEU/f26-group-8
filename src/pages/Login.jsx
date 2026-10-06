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
            <Link to="/about" className="link">
                Back to About
            </Link>
        </div>
    )
}
export default Login;