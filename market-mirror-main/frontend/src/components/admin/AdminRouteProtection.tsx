import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingState from "@/components/LoadingState";

interface AdminRouteProtectionProps {
  children: React.ReactNode;
}

const AdminRouteProtection = ({ children }: AdminRouteProtectionProps) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    // Give a moment for role checking to complete
    const timer = setTimeout(() => {
      setIsCheckingRole(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking auth and role
  if (isLoading || isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Verifying admin access..." size="lg" />
      </div>
    );
  }

  // Not logged in - redirect to admin login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Logged in but not admin - show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin dashboard. This area is restricted to administrators only.
          </p>
          <div className="space-y-2">
            <a 
              href="/"
              className="inline-block btn-primary px-6 py-2 rounded"
            >
              Go to Homepage
            </a>
            <div>
              <a 
                href="/admin/login"
                className="text-primary hover:underline text-sm"
              >
                Try admin login with different account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin user - allow access
  return <>{children}</>;
};

export default AdminRouteProtection;
