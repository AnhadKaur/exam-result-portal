import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resultAPI } from '../utils/api';
import '../App.css';

const AddResult = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    examId: '',
    marks: ''
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await resultAPI.addResult({
        studentId: parseInt(formData.studentId),
        subjectId: parseInt(formData.subjectId),
        examId: parseInt(formData.examId),
        marks: parseFloat(formData.marks)
      });

      navigate('/faculty-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding result');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>📚 Add Result</h1>
          <div className="nav-buttons">
            <button onClick={() => navigate('/faculty-dashboard')} className="button button-secondary">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="form-container">
          <h2>Add New Result</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="studentId">Student ID:</label>
              <input
                type="number"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleFormChange}
                placeholder="Enter student ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subjectId">Subject ID:</label>
              <input
                type="number"
                id="subjectId"
                name="subjectId"
                value={formData.subjectId}
                onChange={handleFormChange}
                placeholder="Enter subject ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="examId">Exam ID:</label>
              <input
                type="number"
                id="examId"
                name="examId"
                value={formData.examId}
                onChange={handleFormChange}
                placeholder="Enter exam ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="marks">Marks:</label>
              <input
                type="number"
                id="marks"
                name="marks"
                value={formData.marks}
                onChange={handleFormChange}
                placeholder="Enter marks"
                step="0.1"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="button button-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Result'}
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => navigate('/faculty-dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddResult;