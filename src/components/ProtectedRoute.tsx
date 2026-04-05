/**
 * Protected Route Component
 *
 * Wraps routes that require authentication. Redirects to /auth
 * if the user is not logged in.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Spinner shown while checking authentication status
 */
const AuthCheckFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking auth status
  if (loading) {
    return <AuthCheckFallback />;
  }

  // If not authenticated, this component will redirect via useEffect
  // If authenticated, render the protected content
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
