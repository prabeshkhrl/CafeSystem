import OrderStatusBadge from "./OrderStatusBadge";
import OrderStatusSelect from "./OrderStatusSelect";
import EmptyState from "../common/EmptyState";
import { ShoppingBag } from "lucide-react";

export default function LiveOrderQueue({ orders, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100">
        <EmptyState
          icon={ShoppingBag}
          title="No orders here"
          description="New orders will show up here automatically."
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-50">
        {orders.map((order) => {
          const customer = order.customerId;
          const time = new Date(order.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={order._id} className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {order.orderNumber}
                    </h3>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    {time} · {customer?.name || "Customer"} ·{" "}
                    {customer?.phoneNumber || order.deliveryPhone}
                  </p>
                  <ul className="text-sm text-gray-600 space-y-0.5">
                    {order.items.map((it, i) => (
                      <li key={i}>
                        {it.quantity}× {it.name}
                        {it.specialInstructions && (
                          <span className="text-xs text-gray-400 italic ml-1">
                            — "{it.specialInstructions}"
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {order.deliveryNotes && (
                    <p className="text-xs text-gray-400 italic mt-2">
                      📝 {order.deliveryNotes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <p className="text-lg font-bold text-orange-600">
                    Rs. {order.total.toFixed(2)}
                  </p>
                  <OrderStatusSelect order={order} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}