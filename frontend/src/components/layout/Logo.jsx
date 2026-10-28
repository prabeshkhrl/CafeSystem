import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

export default function Logo({ to = "/" }) {
  return (
    <Link to={to} className="flex items-center gap-2 shrink-0">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
        <UtensilsCrossed className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight">
        Food<span className="text-orange-500">Hub</span>
      </span>
    </Link>
  );
}