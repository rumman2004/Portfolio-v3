import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * ProtectedRoute component to wrap around admin routes.
 * It checks if the user is authenticated. If not, redirects to login.
 */
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-md-primary" role="status" aria-label="Checking admin session"></div>
      </div>
    );
  }

  // The server-owned cookie is not readable from JavaScript. The user state is
  // populated by /admin/me after that cookie is checked.
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child routes (e.g., Admin Dashboard, etc.)
  return <Outlet />;
};

export default ProtectedRoute;
