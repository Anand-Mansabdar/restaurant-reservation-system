import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Loader from "../components/Loader/Loader";

// Layouts
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Customer pages
import CustomerDashboard from "../pages/customer/Dashboard";
import MyReservations from "../pages/customer/MyReservations";
import BookReservation from "../pages/customer/BookReservation";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import AllReservations from "../pages/admin/AllReservations";
import ManageTables from "../pages/admin/ManageTables";

/**
 * Redirects "/" to the appropriate dashboard based on the user's role,
 * or to /login if unauthenticated.
 */
const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/customer/dashboard" replace />
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="reservations" element={<MyReservations />} />
        <Route path="book" element={<BookReservation />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="reservations" element={<AllReservations />} />
        <Route path="tables" element={<ManageTables />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
