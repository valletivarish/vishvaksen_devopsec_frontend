/**
 * Authentication context and provider.
 *
 * Centralises all auth-related state (user object, JWT token) and
 * exposes login / register / logout actions to every component in
 * the tree via React context.
 *
 * Usage:
 *   import { useAuth } from '../context/AuthContext';
 *   const { user, login, logout, isAuthenticated } = useAuth();
 */

import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

// ------------------------------------------------------------------
// Context creation
// ------------------------------------------------------------------
const AuthContext = createContext(null);

// ------------------------------------------------------------------
// Provider component
// ------------------------------------------------------------------
export const AuthProvider = ({ children }) => {
  // Hydrate initial state from localStorage so the user stays logged
  // in across page refreshes.
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored && stored !== 'undefined' ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const navigate = useNavigate();

  /**
   * Authenticate with the backend using username + password.
   * On success the token and user profile are persisted to
   * localStorage and component state so the rest of the app
   * can react immediately.
   *
   * @param {Object} credentials - { username, password }
   * @returns {Object} The user profile returned by the server.
   */
  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    const { token: jwt, user: profile } = response.data;

    // Persist to localStorage so the axios interceptor and future
    // page loads can pick them up.
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(profile));

    setToken(jwt);
    setUser(profile);

    return profile;
  }, []);

  /**
   * Create a new account and automatically log the user in.
   *
   * @param {Object} userData - { username, email, password, fullName }
   * @returns {Object} The newly created user profile.
   */
  const register = useCallback(async (userData) => {
    const response = await authService.register(userData);
    const { token: jwt, user: profile } = response.data;

    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(profile));

    setToken(jwt);
    setUser(profile);

    return profile;
  }, []);

  /**
   * Log the current user out by clearing all persisted auth state
   * and redirecting to the login page.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);

    navigate('/login');
  }, [navigate]);

  // Derived boolean -- true when a token is present.
  const isAuthenticated = !!token;

  // Memoize the context value to avoid unnecessary re-renders of
  // consumers when the provider re-renders for unrelated reasons.
  const value = useMemo(
    () => ({ user, token, login, register, logout, isAuthenticated }),
    [user, token, login, register, logout, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ------------------------------------------------------------------
// Custom hook for convenient access
// ------------------------------------------------------------------

/**
 * Consume the auth context.  Throws if called outside an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
