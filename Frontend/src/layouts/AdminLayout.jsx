import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import "./Layout.css";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/reservations", label: "All Reservations" },
  { to: "/admin/tables", label: "Manage Tables" },
];

/**
 * Layout wrapper for all /admin/* routes.
 * Navbar on top, sidebar on the left, page content in the center.
 */
const AdminLayout = () => {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar links={adminLinks} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
