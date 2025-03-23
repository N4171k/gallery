import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Client } from 'appwrite';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Gallery from './components/Gallery.jsx';
import './App.css';

// Initialize Appwrite client
export const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67e0214f0022641c79aa');

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [coupleInfo, setCoupleInfo] = useState(null);

  const handleLogin = async (couple) => {
    setIsAuthenticated(true);
    setCoupleInfo(couple);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCoupleInfo(null);
    localStorage.removeItem('coupleId');
    localStorage.removeItem('malePartnerName');
    localStorage.removeItem('femalePartnerName');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/gallery" replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <Register />
              ) : (
                <Navigate to="/gallery" replace />
              )
            }
          />
          <Route
            path="/gallery"
            element={
              isAuthenticated ? (
                <Gallery onLogout={handleLogout} coupleInfo={coupleInfo} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/gallery" : "/login"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 