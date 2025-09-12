import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, token } = useSelector((state: RootState) => state.auth);

  if (!token || !user) {
    // Redirect to login page with return url
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
