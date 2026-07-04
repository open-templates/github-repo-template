import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthContext";
import { Loader2Icon } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If route requires auth but user is not logged in, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in and trying to access auth pages, redirect to dashboard
  const authPages = ["login", "signup", "recover-password", "reset-password"];
  const currentPath = location.pathname.split("/")[1];

  if (
    !requireAuth &&
    user &&
    authPages.includes(currentPath)
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
