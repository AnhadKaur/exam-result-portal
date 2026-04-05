import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'student':
        return '/student-dashboard';
      case 'faculty':
      case 'admin':
        return '/faculty-dashboard';
      case 'parent':
        return '/parent-dashboard';
      default:
        return '/';
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>📚 Examination Result Portal</h1>
          <div className="nav-buttons">
            {user ? (
              <>
                <span>{user.email}</span>
                <Link to={getDashboardLink()} className="button button-primary">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="button button-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="button button-primary">
                  Login
                </Link>
                <Link to="/register" className="button button-secondary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container home-container">
        <h1>Welcome to Examination Result Portal</h1>
        <p>View your academic results and performance metrics</p>

        {user ? (
          <div>
            <p className="card">
              <strong>Welcome, {user.email}!</strong>
            </p>
            <Link to={getDashboardLink()} className="button button-primary">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="home-buttons">
            <Link to="/login" className="button button-primary">
              Login
            </Link>
            <Link to="/register" className="button button-secondary">
              Register
            </Link>
          </div>
        )}

        <div style={{ marginTop: '3rem' }}>
          <h3>Quick Links</h3>
          <div className="card">
            <p><strong>For Students:</strong> View your results, performance metrics, and download reports</p>
            <p><strong>For Faculty:</strong> Add and manage student results</p>
            <p><strong>For Parents:</strong> Monitor your child's academic performance</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
