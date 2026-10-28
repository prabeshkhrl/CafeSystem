import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Star,
  Store,
  Users,
  LogOut,
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

const ownerLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { to: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/dashboard/reviews", label: "Reviews", icon: Star },
  { to: "/dashboard/restaurant", label: "Restaurant", icon: Store },
];

const adminOnlyLinks = [
  { to: "/dashboard/admins", label: "Admins", icon: Users },
];

export default function DashboardSidebar() {
  const { user, logout } = useAuthStore();
  const links =
    user?.role === "restaurantOwner"
      ? [...ownerLinks, ...adminOnlyLinks]
      : ownerLinks;

  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-gray-100 flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">
            Food<span className="text-orange-500">Hub</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          <Store className="w-4 h-4" />
          Back to site
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}