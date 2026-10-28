import { NavLink } from "react-router-dom";
import { getVisibleLinks } from "./navLinks";

export default function DesktopNav({ user }) {
  const links = getVisibleLinks(user);

  return (
    <nav className="hidden md:flex items-center gap-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/"}
          className={({ isActive }) =>
            `px-4 py-2 rounded-full text-sm font-medium transition ${
              isActive
                ? "bg-orange-50 text-orange-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-orange-500"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}