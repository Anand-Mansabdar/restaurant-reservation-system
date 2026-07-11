import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../Loader/Loader";

/**
 * Wraps routes that require authentication and optionally a specific role.
 *
 * Props:
 *  - children: the protected page/layout
 *  - allowedRoles: optional array, e.g. ["admin"] or ["customer"]
 *
 * Behaviour:
 *  1. While auth state is loading → show <Loader />
 *  2. No user → redirect to /login
 *  3. User exists but role not in allowedRoles → redirect to their own dashboard
 *  4. Otherwise → render children
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the user's own dashboard instead of showing a blank forbidden page
    const home = user.role === "admin" ? "/admin/dashboard" : "/customer/dashboard";
    return <Navigate to={home} replace />;
  }

  return children;
};

export default ProtectedRoute;
