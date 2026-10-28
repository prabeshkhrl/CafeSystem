import { MapPin, Phone, Star, CreditCard, CheckCircle2, XCircle } from "lucide-react";
import StarRating from "../common/StarRating";

export default function RestaurantInfoCard({ restaurant }) {
  if (!restaurant) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <div>
        <h3 className="font-bold text-gray-900 mb-1">{restaurant.name}</h3>
        {restaurant.about && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {restaurant.about}
          </p>
        )}
      </div>

      {restaurant.averageRating > 0 && (
        <div className="flex items-center gap-2">
          <StarRating
            value={restaurant.averageRating}
            count={restaurant.totalReviews}
            size="md"
          />
        </div>
      )}

      <div className="space-y-2 text-sm">
        <InfoRow icon={MapPin} value={restaurant.address} />
        <InfoRow icon={Phone} value={restaurant.phoneNumber} />
        <InfoRow
          icon={CreditCard}
          value={restaurant.paymentMethods?.join(" · ") || "—"}
        />
        <InfoRow
          icon={restaurant.isActive ? CheckCircle2 : XCircle}
          value={restaurant.isActive ? "Currently active" : "Currently inactive"}
          iconClass={restaurant.isActive ? "text-green-500" : "text-gray-400"}
        />
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, value, iconClass = "text-gray-400" }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconClass}`} />
      <span className="text-gray-700 break-words">{value}</span>
    </div>
  );
}