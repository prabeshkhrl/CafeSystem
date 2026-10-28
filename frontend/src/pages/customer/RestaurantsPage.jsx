import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useRestaurants from "../../hooks/useRestaurants";
import RestaurantList from "../../components/restaurant/RestaurantList";
import RestaurantFilters from "../../components/restaurant/RestaurantFilters";
import useDebounce from "../../hooks/useDebounce";

export default function RestaurantsPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    isActive: undefined,
  });
  const debouncedSearch = useDebounce(filters.search, 400);

  const { data, isLoading, error } = useRestaurants({
    search: debouncedSearch,
    isActive: filters.isActive,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover restaurants
        </h1>
        <p className="text-gray-500">
          Order from {data?.total || 0} restaurants near you.
        </p>
      </div>

      <RestaurantFilters value={filters} onChange={setFilters} />
      <RestaurantList
        restaurants={data?.data || []}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}