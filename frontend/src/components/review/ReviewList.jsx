import { MessageSquare } from "lucide-react";
import ReviewCard from "./ReviewCard";
import EmptyState from "../common/EmptyState";
import Button from "../ui/Button";

export default function ReviewList({
  reviews,
  isLoading,
  page = 1,
  pages = 1,
  onPageChange,
  onDelete,        // ← new
  deletingId,      // ← new (which review is being deleted)
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!reviews?.length) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No reviews yet"
        description="Be the first to share your experience with this restaurant."
      />
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <ReviewCard
          key={r._id}
          review={r}
          onDelete={onDelete}
          isDeleting={deletingId === r._id}
        />
      ))}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500 px-3">
            Page {page} of {pages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}