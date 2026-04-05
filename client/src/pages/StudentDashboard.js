import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resultAPI } from '../utils/api';
import '../App.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await resultAPI.getMyResults();
      setResults(response.data.results);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching results');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const downloadPDF = () => {
    // Generate simple CSV as PDF alternative
    const cols = ['Subject', 'Exam Type', 'Marks', 'Grade', 'Status'];
    const rows = results.map(r => [
      r.subject.name,
      r.exam.examType,
      r.marks,
      r.grade,
      r.status
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' + 
      [cols, ...rows].map(r => r.join(',')).join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'results.csv');
    link.click();
  };

  const filteredResults = results.filter(r => {
    if (semesterFilter && r.exam.semester.id !== parseInt(semesterFilter)) return false;
    if (examTypeFilter && r.exam.examType !== examTypeFilter) return false;
    return true;
  });

  const calculateStats = () => {
    if (filteredResults.length === 0) return null;

    const totalMarks = filteredResults.reduce((sum, r) => sum + r.marks, 0);
    const avgMarks = (totalMarks / filteredResults.length).toFixed(2);
    const passCount = filteredResults.filter(r => r.status === 'pass').length;
    const percentage = ((passCount / filteredResults.length) * 100).toFixed(2);

    return { avgMarks, percentage, passCount };
  };

  const stats = calculateStats();

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>📚 Student Dashboard</h1>
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
          <h2>Welcome, {user?.email}!</h2>
          {user?.student && <p>Roll Number: {user.student.rollNumber}</p>}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {stats && (
          <div className="card">
            <h3>Performance Summary</h3>
            <p><strong>Average Marks:</strong> {stats.avgMarks}</p>
            <p><strong>Pass Rate:</strong> {stats.percentage}%</p>
            <p><strong>Passing Subjects:</strong> {stats.passCount}/{filteredResults.length}</p>
          </div>
        )}

        <div className="filter-container">
          <div className="form-group">
            <label htmlFor="semesterFilter">Filter by Semester:</label>
            <select
              id="semesterFilter"
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
            >
              <option value="">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="examTypeFilter">Filter by Exam Type:</label>
            <select
              id="examTypeFilter"
              value={examTypeFilter}
              onChange={(e) => setExamTypeFilter(e.target.value)}
            >
              <option value="">All Exam Types</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>

          <div>
            <button onClick={downloadPDF} className="button button-secondary">
              📥 Download Results
            </button>
          </div>
        </div>

        {loading && <div className="loading">Loading results...</div>}

        {!loading && filteredResults.length > 0 ? (
          <div>
            <h3>Your Results ({filteredResults.length})</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Exam Type</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Semester</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result.id}>
                    <td>{result.subject.name}</td>
                    <td>{result.exam.examType}</td>
                    <td>{result.marks}</td>
                    <td><strong>{result.grade}</strong></td>
                    <td>
                      <span style={{
                        padding: '5px 10px',
                        borderRadius: '4px',
                        backgroundColor: result.status === 'pass' ? '#d4edda' : '#f8d7da',
                        color: result.status === 'pass' ? '#155724' : '#721c24'
                      }}>
                        {result.status.toUpperCase()}
                      </span>
                    </td>
                    <td>Sem {result.exam.semester.semesterNo}</td>
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

export default StudentDashboard;
