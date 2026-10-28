import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import { toast } from "../../lib/toast";

export default function UserDropdown() {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!user) return null;

  const initials = user.name?.charAt(0).toUpperCase() || "U";
  const isStaff =
    user.role === "restaurantOwner" || user.role === "admin";

  const handleLogout = () => {
    logout();
    toast.info("You've been logged out");
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-50 transition"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium">
          {user.name?.split(" ")[0]}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <DropItem to="/profile" icon={User} label="My Profile" onClick={() => setOpen(false)} />
          {isStaff && (
            <DropItem
              to="/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              onClick={() => setOpen(false)}
            />
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

function DropItem({ to, icon: Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}