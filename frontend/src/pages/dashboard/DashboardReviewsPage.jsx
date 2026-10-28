import { useState } from "react";
import { MessageSquare } from "lucide-react";
import useDashboardReviews from "../../hooks/useDashboardReviews";
import useRestaurant from "../../hooks/useRestaurant";
import useAuthStore from "../../store/useAuthStore";
import StarRating from "../../components/review/StarRating";
import OwnerReplyBox from "../../components/review/OwnerReplyBox";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/common/EmptyState";

export default function DashboardReviewsPage() {
  const restaurantId = useAuthStore((s) => s.user?.restaurantId);
  const { data: restaurant } = useRestaurant(restaurantId);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useDashboardReviews({ page });

  const reviews = data?.data || [];
  const totalPages = data?.pages || 1;

  const avg = restaurant?.averageRating || 0;
  const total = restaurant?.totalReviews || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-500 mt-1">
            Read customer feedback and reply to reviews.
          </p>
        </div>
      </div>

      {/* Summary strip */}
      {total > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {avg.toFixed(1)}
            </div>
            <StarRating value={avg} size="sm" />
            <p className="text-xs text-gray-400 mt-1">{total} reviews</p>
          </div>
          <div className="flex-1 text-sm text-gray-500 leading-relaxed">
            Keep an eye on feedback and reply to reviews — showing you care
            builds trust with future customers.
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-white rounded-2xl border border-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100">
          <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            description="Reviews will appear here after customers order and rate your restaurant."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const customer = review.customerId;
            const initials =
              customer?.name?.charAt(0).toUpperCase() || "U";
            const date = new Date(review.createdAt).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" }
            );

            return (
              <div
                key={review._id}
                className="bg-white rounded-2xl border border-gray-100 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {customer?.name || "Customer"}
                        </p>
                        <p className="text-xs text-gray-400">{date}</p>
                      </div>
                      <StarRating value={review.rating} size="sm" />
                    </div>

                    {review.comment && (
                      <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                        {review.comment}
                      </p>
                    )}

                    {review.images?.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {review.images.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100"
                          >
                            <img
                              src={url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    )}

                    <OwnerReplyBox review={review} />
                  </div>
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500 px-3">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}