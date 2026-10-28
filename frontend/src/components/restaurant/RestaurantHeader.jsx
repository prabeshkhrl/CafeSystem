import { MapPin, Phone, Clock } from "lucide-react";
import StarRating from "../common/StarRating";

export default function RestaurantHeader({ restaurant }) {
  return (
    <div className="relative">
      {/* Banner */}
      <div className="aspect-[3/1] sm:aspect-[4/1] bg-gradient-to-br from-yellow-100 to-orange-100 overflow-hidden">
        {restaurant.restaurantBanner ? (
          <img
            src={restaurant.restaurantBanner}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🍽️
          </div>
        )}
      </div>

      {/* Info card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 relative bg-white rounded-2xl border border-gray-100 shadow-md p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            {/* Logo */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shrink-0 overflow-hidden">
              {restaurant.restaurantLogo ? (
                <img
                  src={restaurant.restaurantLogo}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                restaurant.name?.charAt(0).toUpperCase()
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {restaurant.name}
                </h1>
                {!restaurant.isActive && (
                  <span className="bg-gray-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    Closed
                  </span>
                )}
              </div>

              {restaurant.about && (
                <p className="text-sm text-gray-500 mb-2">{restaurant.about}</p>
              )}

              <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500">
                {restaurant.averageRating > 0 && (
                  <StarRating
                    value={restaurant.averageRating}
                    count={restaurant.totalReviews}
                    size="md"
                  />
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {restaurant.address}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {restaurant.phoneNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  20-30 min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}