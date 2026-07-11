import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import "./Layout.css";

const customerLinks = [
  { to: "/customer/dashboard", label: "Dashboard" },
  { to: "/customer/reservations", label: "My Reservations" },
  { to: "/customer/book", label: "Book a Table" },
];

/**
 * Layout wrapper for all /customer/* routes.
 * Navbar on top, sidebar on the left, page content in the center.
 */
const CustomerLayout = () => {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar links={customerLinks} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
