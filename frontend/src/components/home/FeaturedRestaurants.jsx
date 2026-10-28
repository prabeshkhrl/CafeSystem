import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useRestaurants from "../../hooks/useRestaurants";
import RestaurantCard from "../restaurant/RestaurantCard";
import SkeletonCard from "../common/SkeletonCard";

export default function FeaturedRestaurants() {
  const { data, isLoading } = useRestaurants({ page: 1 });

  // Top 6 by rating (backend already sorts by createdAt — we sort locally)
  const featured = (data?.data || [])
    .slice()
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 6);

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Featured restaurants
            </h2>
            <p className="text-gray-500 mt-1">
              Top-rated places near you right now.
            </p>
          </div>
          <Link
            to="/restaurants"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition"
          >
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No restaurants available yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((r) => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1 text-sm font-medium text-orange-500"
          >
            See all restaurants <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}