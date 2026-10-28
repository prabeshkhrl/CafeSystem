import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useOrder from "../../hooks/useOrder";
import OrderDetail from "../../components/order/OrderDetail";
import ReviewForm from "../../components/review/ReviewForm";
import SkeletonCard from "../../components/common/SkeletonCard";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading, error } = useOrder(id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </Link>

      {isLoading && <SkeletonCard className="h-64" />}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">
          {error.response?.data?.message || "Failed to load order"}
        </div>
      )}

      {order && (
        <>
          <OrderDetail order={order} />
          {order.status === "delivered" && (
            <ReviewForm order={order} existingReview={order.reviewId} />
          )}
        </>
      )}
    </div>
  );
}