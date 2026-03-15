/**
 * Authentication service.
 *
 * Handles login and registration requests against the backend's
 * /api/auth endpoints.  All functions return the axios response
 * promise so callers (typically the AuthContext) can extract the
 * token and user payload from response.data.
 */

import api from './api';

/**
 * Authenticate an existing user.
 *
 * @param {Object} credentials - { username, password }
 * @returns {Promise} Resolves with { token, user } on success.
 */
export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

/**
 * Register a new user account.
 *
 * @param {Object} userData - { username, email, password, fullName }
 * @returns {Promise} Resolves with { token, user } on success.
 */
export const register = (userData) => {
  return api.post('/auth/register', userData);
};
