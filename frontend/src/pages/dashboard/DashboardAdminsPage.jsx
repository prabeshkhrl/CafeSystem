import useAuthStore from "../../store/useAuthStore";
import { useMyAdmins } from "../../hooks/useAdmins";
import AdminListTable from "../../components/dashboard/AdminListTable";
import { Navigate } from "react-router-dom";

export default function DashboardAdminsPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, error } = useMyAdmins();

  // Defensive: only owners should ever reach this page
  if (user?.role !== "restaurantOwner") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admins</h1>
        <p className="text-gray-500 mt-1">
          Invite people to help manage your restaurant. Admins can handle
          orders, menu, and reviews — but not create other admins.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          {error.response?.data?.message || "Failed to load admins"}
        </div>
      )}

      <AdminListTable admins={data?.data || []} isLoading={isLoading} />
    </div>
  );
}