import { NavLink } from "react-router-dom";
import "./Sidebar.css";

/**
 * Generic sidebar navigation.
 *
 * Props:
 *  - links: array of { to: string, label: string }
 *
 * Uses NavLink so the active route is automatically highlighted.
 */
const Sidebar = ({ links }) => {
  return (
    <aside className="sidebar">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
