import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const user = result.user;
      switch (user.role) {
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'faculty':
        case 'admin':
          navigate('/faculty-dashboard');
          break;
        case 'parent':
          navigate('/parent-dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>📚 Examination Result Portal</h1>
          <div className="nav-buttons">
            <Link to="/" className="button button-secondary">
              Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="form-container">
          <h2 className="center">Login</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-group center">
              <button type="submit" className="button button-primary" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          <p className="center">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>

          <div className="alert alert-info">
            <strong>Demo Credentials:</strong>
            <p>Student - student@example.com / password123</p>
            <p>Faculty - faculty@example.com / password123</p>
            <p>Parent - parent@example.com / password123</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
