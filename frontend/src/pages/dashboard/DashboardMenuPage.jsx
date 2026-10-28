import useDashboardMenuItems from "../../hooks/useDashboardMenuItems";
import MenuItemTable from "../../components/menu/MenuItemTable";

export default function DashboardMenuPage() {
  const { data, isLoading, error } = useDashboardMenuItems();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
        <p className="text-gray-500 mt-1">
          Manage your restaurant's menu items and availability.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          {error.response?.data?.message || "Failed to load menu items"}
        </div>
      )}

      <MenuItemTable items={data?.data || []} isLoading={isLoading} />
    </div>
  );
}