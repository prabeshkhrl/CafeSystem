import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import useRestaurant from "../../hooks/useRestaurant";
import useAuthStore from "../../store/useAuthStore";
import { useUpdateRestaurant } from "../../hooks/useRestaurantMutations";
import RestaurantForm from "../../components/restaurant/RestaurantForm";
import RestaurantInfoCard from "../../components/restaurant/RestaurantInfoCard";
import RestaurantToggleActive from "../../components/restaurant/RestaurantToggleActive";

export default function DashboardRestaurantPage() {
  const restaurantId = useAuthStore((s) => s.user?.restaurantId);
  const { data: restaurant, isLoading, error } = useRestaurant(restaurantId);
  const update = useUpdateRestaurant();

  if (!restaurantId) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500">
            No restaurant is linked to your account. Contact an admin.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="h-96 bg-white rounded-2xl border border-gray-100 animate-pulse" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-red-600 text-sm">
            {error?.response?.data?.message || "Failed to load restaurant."}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (values) => {
    // isActive is toggled separately — don't send it here
    const { isActive, ...payload } = values;
    await update.mutateAsync(payload);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant</h1>
          <p className="text-gray-500 mt-1">
            Manage your restaurant profile, images, and availability.
          </p>
        </div>

        <Link
          to={`/restaurants/${restaurant._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 transition"
        >
          View public page
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <RestaurantForm
              initial={restaurant}
              onSubmit={handleSubmit}
              isLoading={update.isPending}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <RestaurantToggleActive isActive={restaurant.isActive} />
          <RestaurantInfoCard restaurant={restaurant} />
        </div>
      </div>
    </div>
  );
}