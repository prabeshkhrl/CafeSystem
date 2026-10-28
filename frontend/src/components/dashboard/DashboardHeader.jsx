import { useState } from "react";
import { Menu, X, ChevronDown, LogOut, Store } from "lucide-react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const mobileLinks = [
  { to: "/dashboard", label: "Overview", end: true },
  { to: "/dashboard/orders", label: "Orders" },
  { to: "/dashboard/menu", label: "Menu" },
  { to: "/dashboard/reviews", label: "Reviews" },
  { to: "/dashboard/restaurant", label: "Restaurant" },
];

export default function DashboardHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden p-2 rounded-full hover:bg-gray-50"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <h1 className="hidden sm:block text-lg font-semibold text-gray-900">
          Dashboard
        </h1>

        {/* User chip */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role === "restaurantOwner"
                ? "Owner"
                : user?.role === "admin"
                ? "Admin"
                : user?.role}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 px-3 py-3 space-y-1">
          {mobileLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            <Store className="w-4 h-4" /> Back to site
          </NavLink>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </header>
  );
}