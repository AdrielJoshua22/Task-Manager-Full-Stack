import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('usuarioTaskApp') || null;
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !currentUser ? (
              <Login onLoginSuccess={setCurrentUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            currentUser ? (
              <Dashboard currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

      </Routes>
    </Router>
  );
}

export default App;