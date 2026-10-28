import { Star } from "lucide-react";
import StarRating from "./StarRating";

export default function ReviewSummaryBox({ restaurant }) {
  const rating = restaurant?.averageRating || 0;
  const count = restaurant?.totalReviews || 0;

  // Simplified distribution — you can fetch real distribution later
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    percent: 0,
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 mb-4">Customer reviews</h3>

      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">
            {rating.toFixed(1)}
          </div>
          <StarRating value={rating} size="md" />
          <p className="text-xs text-gray-400 mt-1">{count} reviews</p>
        </div>

        <div className="flex-1 space-y-1.5">
          {distribution.map(({ star, percent }) => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-gray-500">{star}</span>
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}