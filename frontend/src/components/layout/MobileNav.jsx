import { NavLink } from "react-router-dom";
import { getVisibleLinks } from "./navLinks";
import Button from "../ui/Button";

export default function MobileNav({ user, onClose }) {
  const links = getVisibleLinks(user);

  return (
    <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/"}
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-orange-50 text-orange-600"
                : "text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}

      {!user && (
        <div className="pt-2 space-y-2">
          <Button as="link" to="/auth" variant="secondary" className="w-full" onClick={onClose}>
            Login
          </Button>
          <Button as="link" to="/auth/register" variant="primary" className="w-full" onClick={onClose}>
            Sign Up
          </Button>
        </div>
      )}
    </div>
  );
}