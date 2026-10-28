import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderCard({ order }) {
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      to={`/orders/${order._id}`}
      className="block bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold text-gray-900 truncate">
              {order.restaurantId?.name || "Restaurant"}
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-gray-400 mb-2">
            {order.orderNumber} · {date}
          </p>
          <p className="text-sm text-gray-600">
            {itemCount} {itemCount === 1 ? "item" : "items"} · Rs.{" "}
            {order.total.toFixed(2)}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 mt-1" />
      </div>
    </Link>
  );
}