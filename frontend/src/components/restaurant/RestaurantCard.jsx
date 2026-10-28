import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import StarRating from "../common/StarRating";

export default function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurants/${restaurant._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200"
    >
      {/* Banner */}
      <div className="aspect-[4/3] bg-gradient-to-br from-yellow-100 to-orange-100 relative overflow-hidden">
        {restaurant.restaurantBanner ? (
          <img
            src={restaurant.restaurantBanner}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}

        {!restaurant.isActive && (
          <span className="absolute top-3 left-3 bg-gray-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Closed
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 truncate group-hover:text-orange-500 transition">
            {restaurant.name}
          </h3>
          {restaurant.averageRating > 0 && (
            <StarRating
              value={restaurant.averageRating}
              count={restaurant.totalReviews}
            />
          )}
        </div>

        {restaurant.about && (
          <p className="text-sm text-gray-500 line-clamp-1 mb-2">
            {restaurant.about}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[140px]">{restaurant.address}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            20-30 min
          </span>
        </div>
      </div>
    </Link>
  );
}