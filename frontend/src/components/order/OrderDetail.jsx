import { useState } from "react";
import { MapPin, Phone, MessageSquare, XCircle } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderTimeline from "./OrderTimeline";
import OrderItemRow from "./OrderItemRow";
import OrderTotals from "./OrderTotals";
import CancelOrderModal from "./CancelOrderModal";
import Button from "../ui/Button";

// Customer can cancel only before "preparing"
const CANCELLABLE_STATUSES = ["placed", "confirmed"];

export default function OrderDetail({ order }) {
  const [cancelOpen, setCancelOpen] = useState(false);

  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  return (
    <>
      <div className="space-y-6">
        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">
                  {order.restaurantId?.name || "Restaurant"}
                </h2>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-xs text-gray-400">
                {order.orderNumber} ·{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            {canCancel && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCancelOpen(true)}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <XCircle className="w-4 h-4" />
                Cancel order
              </Button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm pt-4 border-t border-gray-100">
            <InfoRow
              icon={MapPin}
              label="Delivery to"
              value={order.deliveryAddress}
            />
            <InfoRow icon={Phone} label="Phone" value={order.deliveryPhone} />
            {order.deliveryNotes && (
              <InfoRow
                icon={MessageSquare}
                label="Notes"
                value={order.deliveryNotes}
              />
            )}
          </div>

          {/* Cancellation banner (if cancelled) */}
          {order.status === "cancelled" && (
            <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-0.5">
                Order cancelled
              </p>
              {order.cancelReason && (
                <p className="text-xs text-gray-500">
                  Reason: {order.cancelReason}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Two-col: timeline + items */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Status</h3>
            <OrderTimeline
              status={order.status}
              history={order.statusHistory}
            />
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-2">Items</h3>
            <div className="mb-4">
              {order.items.map((item, i) => (
                <OrderItemRow key={i} item={item} />
              ))}
            </div>
            <OrderTotals order={order} />
          </div>
        </div>
      </div>

      <CancelOrderModal
        open={cancelOpen}
        orderId={order._id}
        onClose={() => setCancelOpen(false)}
      />
    </>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-700 break-words">{value}</p>
      </div>
    </div>
  );
}