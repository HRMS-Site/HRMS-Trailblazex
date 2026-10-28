import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { canAccessModule, type AppModule } from "@/lib/permissions";

export function ProtectedRoute({ module }: { module?: AppModule }) {
  const { user, requiresLogin } = useAuth();
  const location = useLocation();

  if (requiresLogin && !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (module && requiresLogin && user && !canAccessModule(user.role, module)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}
