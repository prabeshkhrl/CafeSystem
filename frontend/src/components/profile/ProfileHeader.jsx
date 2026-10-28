import { Mail, Phone, Calendar, Shield } from "lucide-react";

const ROLE_LABEL = {
  customer: "Customer",
  restaurantOwner: "Restaurant Owner",
  admin: "Admin",
};

const ROLE_COLOR = {
  customer: "bg-blue-50 text-blue-600",
  restaurantOwner: "bg-orange-50 text-orange-600",
  admin: "bg-indigo-50 text-indigo-600",
};

export default function ProfileHeader({ user }) {
  if (!user) return null;

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-2xl font-bold flex items-center justify-center shadow-md shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {user.name}
            </h1>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                ROLE_COLOR[user.role] || "bg-gray-100 text-gray-600"
              }`}
            >
              {ROLE_LABEL[user.role] || user.role}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-2 truncate">
            @{user.username}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </span>
            {user.phoneNumber && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {user.phoneNumber}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Joined {joined}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}