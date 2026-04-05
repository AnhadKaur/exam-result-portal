import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import ParentDashboard from './pages/ParentDashboard';
import AddResult from './pages/AddResult';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute requiredRole={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/faculty-dashboard"
            element={
              <ProtectedRoute requiredRole={['faculty', 'admin']}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/add-result"
            element={
              <ProtectedRoute requiredRole={['faculty', 'admin']}>
                <AddResult />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/parent-dashboard"
            element={
              <ProtectedRoute requiredRole={['parent']}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
