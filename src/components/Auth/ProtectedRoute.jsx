/**
 * ProtectedRoute component.
 *
 * Implements the "guard" pattern for authenticated routes:
 *   - If the user IS authenticated, render the child content (via Outlet
 *     for nested routes, or children for wrapper usage).
 *   - If the user is NOT authenticated, redirect to /login using the
 *     declarative <Navigate> component so the browser URL updates cleanly.
 *
 * This component should wrap any <Route> that requires a valid session.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If the user has no valid token, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render nested routes (Outlet) or wrapped children
  return children || <Outlet />;
};

export default ProtectedRoute;
