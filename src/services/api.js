/**
 * Centralized Axios instance for all API communication.
 *
 * - baseURL is set to '/api' so that Vite's dev-server proxy can forward
 *   requests to the Spring Boot backend without CORS issues.
 * - A request interceptor automatically attaches the JWT token (if present
 *   in localStorage) to every outgoing request's Authorization header.
 * - A response interceptor watches for 401 Unauthorized replies, which
 *   indicate an expired or invalid token.  When one is detected it clears
 *   the persisted auth state and redirects the user to the login page so
 *   they can re-authenticate.
 */

import axios from 'axios';

// ------------------------------------------------------------------
// Create a shared axios instance with sensible defaults
// ------------------------------------------------------------------
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ------------------------------------------------------------------
// REQUEST INTERCEPTOR
// Runs before every request leaves the browser.
// If a JWT token exists in localStorage we attach it as a Bearer token
// so the backend can authenticate the caller.
// ------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // If something goes wrong while preparing the request, reject
    // immediately so the calling code can handle it.
    return Promise.reject(error);
  }
);

// ------------------------------------------------------------------
// RESPONSE INTERCEPTOR
// Runs after every response is received.
// A 401 status means the token is missing, expired, or invalid.
// In that case we:
//   1. Remove stale auth data from localStorage.
//   2. Redirect to /login so the user can sign in again.
// All other errors are passed through untouched.
// ------------------------------------------------------------------
api.interceptors.response.use(
  (response) => {
    // Successful responses (2xx) pass straight through.
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear persisted auth state so the app treats the user as
      // unauthenticated on the next render cycle.
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to the login page.  Using window.location ensures the
      // redirect works regardless of which router context we are in.
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
