import { useToggleRestaurantActive } from "../../hooks/useRestaurantMutations";

export default function RestaurantToggleActive({ isActive }) {
  const toggle = useToggleRestaurantActive();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-1">
            {isActive ? "Restaurant is open" : "Restaurant is closed"}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {isActive
              ? "Customers can browse your menu and place orders."
              : "Your menu is visible but orders are disabled."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => toggle.mutate()}
          disabled={toggle.isPending}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:opacity-60 ${
            isActive ? "bg-orange-500" : "bg-gray-200"
          }`}
          aria-label="Toggle restaurant active status"
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
              isActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {toggle.isError && (
        <p className="text-xs text-red-600 mt-2">
          {toggle.error?.response?.data?.message ||
            "Failed to update status"}
        </p>
      )}
    </div>
  );
}