import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, userLoading, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Show loading while checking user
  if ((!user && token) || userLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Redirect if no token or no user
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the protected children
  return <>{children}</>;
}
