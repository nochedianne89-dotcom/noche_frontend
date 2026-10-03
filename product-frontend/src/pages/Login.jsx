import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- import Link
import api from '../api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/auth/login', { username, password });
            localStorage.setItem('access_token', res.data.tokens.access_token);
            localStorage.setItem('refresh_token', res.data.tokens.refresh_token);
            navigate('/products');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div style={{ maxWidth: 300, margin: '100px auto', fontFamily: 'sans-serif' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input placeholder="Username" value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: '100%', marginBottom: 10, padding: 8 }} />
                <input type="password" placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', marginBottom: 10, padding: 8 }} />
                <button type="submit" style={{ width: '100%', padding: 10 }}>Login</button>
            </form>

            {/* Register link */}
            <p style={{ marginTop: 10 }}>
                Don’t have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}
