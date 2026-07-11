import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";

/**
 * Top navigation bar shown on all authenticated pages.
 * Displays the app name and a logout button with the current user's name.
 */
const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <span className="navbar-brand">Restaurant Reservations</span>

      <div className="navbar-right">
        {user && (
          <>
            <span className="navbar-user">
              {user.name} ({user.role})
            </span>
            <button className="btn btn-outline btn-sm" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
