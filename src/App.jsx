import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import {
  getStoredToken,
  getStoredUser,
  setUnauthorizedHandler,
  authService
} from './services/api';

export default function App() {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    // When a protected API request encounters an expired/invalid token (HTTP 401),
    // automatically reset the session state to bring the user back to the login view.
    setUnauthorizedHandler(() => {
      setToken(null);
      setUser(null);
    });
  }, []);

  const handleLoginSuccess = (authenticatedUser, authToken) => {
    setUser(authenticatedUser);
    setToken(authToken);
  };

  const handleLogout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {isAuthenticated ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
