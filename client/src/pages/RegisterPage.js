import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [rollNumber, setRollNumber] = useState('');
  const [year, setYear] = useState('1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (role === 'student' && (!rollNumber || !year)) {
      setError('Roll number and year are required for students');
      return;
    }

    setLoading(true);

    const result = await register(email, password, role, rollNumber, year);

    if (result.success) {
      navigate(role === 'student' ? '/student-dashboard' : '/');
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
          <h2 className="center">Register</h2>

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
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>

            {role === 'student' && (
              <>
                <div className="form-group">
                  <label htmlFor="rollNumber">Roll Number:</label>
                  <input
                    type="text"
                    id="rollNumber"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="Enter your roll number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="year">Year:</label>
                  <select
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </>
            )}

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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="form-group center">
              <button type="submit" className="button button-primary" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <p className="center">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
