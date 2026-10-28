import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

export default function RoleGuard({ allowedRoles = [], children }) {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/auth" replace />;
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}