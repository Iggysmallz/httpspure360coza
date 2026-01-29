import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, useProfile } from "@/hooks/useProfile";

type AllowedRole = "admin" | "client" | "worker";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AllowedRole[];
  requireProfileComplete?: boolean;
}

const ProtectedRoute = ({
  children,
  allowedRoles,
  requireProfileComplete = false,
}: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { data: role, isLoading: roleLoading } = useUserRole();
  const { profile, isLoading: profileLoading } = useProfile();

  const isLoading = authLoading || roleLoading || profileLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check role if specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role as AllowedRole)) {
      // Redirect based on role
      if (role === "admin") {
        return <Navigate to="/admin" replace />;
      } else if (role === "worker") {
        return <Navigate to="/worker-dashboard" replace />;
      } else {
        return <Navigate to="/client-dashboard" replace />;
      }
    }
  }

  // Check profile completion for workers
  if (requireProfileComplete && role === "worker") {
    if (!profile?.profile_completed) {
      return <Navigate to="/complete-profile" replace />;
    }
    if (profile.worker_status !== "approved") {
      return <Navigate to="/pending-approval" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
