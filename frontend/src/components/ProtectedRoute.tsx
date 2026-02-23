import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, loading } = useAuth();

  // Show a blank screen or a sleek loading spinner while checking the token
  if (loading) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If there is no token, kick them back to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If they have a token, let them into the Dashboard
  return <>{children}</>;
}
