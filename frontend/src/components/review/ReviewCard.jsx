import { useState } from "react";
import { MessageCircle, Trash2, Loader2 } from "lucide-react";
import StarRating from "./StarRating";

export default function ReviewCard({ review, onDelete, isDeleting = false }) {
  const [confirming, setConfirming] = useState(false);

  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const customer = review.customerId;
  const initials = customer?.name?.charAt(0).toUpperCase() || "U";

  const handleDelete = async () => {
    try {
      await onDelete(review._id);
      setConfirming(false);
    } catch {
      /* error surfaces via parent state */
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {customer?.name || "Anonymous"}
              </p>
              <p className="text-xs text-gray-400">{date}</p>
            </div>

            <div className="flex items-center gap-2">
              <StarRating value={review.rating} size="sm" />

              {onDelete && !confirming && (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="p-1 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                  aria-label="Delete review"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Delete confirmation */}
          {confirming && (
            <div className="mt-2 p-2.5 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 flex-wrap">
              <p className="text-xs text-red-700 flex-1">
                Delete this review?
              </p>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={isDeleting}
                className="px-2.5 py-1 rounded-md text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60"
              >
                {isDeleting && <Loader2 className="w-3 h-3 animate-spin" />}
                Delete
              </button>
            </div>
          )}

          {/* Comment */}
          {review.comment && (
            <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
              {review.comment}
            </p>
          )}

          {/* Images */}
          {review.images?.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {review.images.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100"
                >
                  <img
                    src={url}
                    alt={`Review ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </a>
              ))}
            </div>
          )}

          {/* Owner reply */}
          {review.ownerReply?.text && (
            <div className="mt-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
              <div className="flex items-center gap-1.5 mb-1">
                <MessageCircle className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-semibold text-orange-600">
                  Response from restaurant
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {review.ownerReply.text}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}