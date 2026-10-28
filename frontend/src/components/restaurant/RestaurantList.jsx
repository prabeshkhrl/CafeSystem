import RestaurantCard from "./RestaurantCard";
import SkeletonCard from "../common/SkeletonCard";
import EmptyState from "../common/EmptyState";
import { Store } from "lucide-react";

export default function RestaurantList({ restaurants, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600">Failed to load restaurants.</p>
      </div>
    );
  }

  if (!restaurants?.length) {
    return (
      <EmptyState
        icon={Store}
        title="No restaurants found"
        description="Try adjusting your search or filters."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((r) => (
        <RestaurantCard key={r._id} restaurant={r} />
      ))}
    </div>
  );
}