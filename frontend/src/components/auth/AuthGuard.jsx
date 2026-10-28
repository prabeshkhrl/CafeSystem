import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

export default function AuthGuard({ children }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}