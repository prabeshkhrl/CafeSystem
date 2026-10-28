import { ShoppingBag } from "lucide-react";
import OrderCard from "./OrderCard";
import EmptyState from "../common/EmptyState";
import SkeletonCard from "../common/SkeletonCard";

export default function OrderList({ orders, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No orders yet"
        description="Once you place an order, it will show up here."
        actionLabel="Browse restaurants"
        actionTo="/restaurants"
      />
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}