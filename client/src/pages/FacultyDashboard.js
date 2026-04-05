import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resultAPI } from '../utils/api';
import '../App.css';

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchResults();
    fetchStats();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await resultAPI.getResults();
      setResults(response.data.results);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching results');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await resultAPI.getStats();
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteResult = async (id) => {
    if (!window.confirm('Are you sure you want to delete this result?')) return;
    
    try {
      await resultAPI.deleteResult(id);
      fetchResults();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting result');
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>📚 Faculty Dashboard</h1>
          <div className="nav-buttons">
            <span>{user?.email}</span>
            <button onClick={handleLogout} className="button button-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Welcome, {user?.email}!</h2>
            <button onClick={() => navigate('/add-result')} className="button button-primary">
              ➕ Add New Result
            </button>
          </div>
          <p>Manage student examination results</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {stats && (
          <div className="card">
            <h3>Results Statistics</h3>
            <p><strong>Total Results:</strong> {stats.totalResults}</p>
            <p><strong>Pass:</strong> {stats.passCount} | <strong>Fail:</strong> {stats.failCount}</p>
            <p><strong>Average Marks:</strong> {stats.averageMarks}</p>
            <p><strong>Grade Distribution:</strong></p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>A: {stats.gradeDistribution.A}</li>
              <li>B: {stats.gradeDistribution.B}</li>
              <li>C: {stats.gradeDistribution.C}</li>
              <li>D: {stats.gradeDistribution.D}</li>
              <li>F: {stats.gradeDistribution.F}</li>
            </ul>
          </div>
        )}

        {loading && <div className="loading">Loading results...</div>}

        {!loading && results.length > 0 ? (
          <div>
            <h3>All Results ({results.length})</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Subject</th>
                  <th>Exam Type</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td>{result.student.rollNumber}</td>
                    <td>{result.subject.name}</td>
                    <td>{result.exam.examType}</td>
                    <td>{result.marks}</td>
                    <td><strong>{result.grade}</strong></td>
                    <td>
                      <span style={{
                        padding: '5px 10px',
                        borderRadius: '4px',
                        backgroundColor: result.status === 'pass' ? '#d4edda' : '#f8d7da',
                        color: result.status === 'pass' ? '#155724' : '#721c24',
                        fontSize: '0.9rem'
                      }}>
                        {result.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteResult(result.id)}
                        className="button button-danger"
                        style={{ padding: '5px 10px', fontSize: '0.9rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <div className="alert alert-info">No results found</div>
        )}
      </div>
    </>
  );
};

export default FacultyDashboard;
