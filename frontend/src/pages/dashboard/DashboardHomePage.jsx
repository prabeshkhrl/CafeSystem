import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import useDashboardStats from "../../hooks/useDashboardStats";
import useRestaurantOrders from "../../hooks/useRestaurantOrders";
import StatsRow from "../../components/dashboard/StatsRow";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";

export default function DashboardHomePage() {
  const { stats, isLoading } = useDashboardStats();
  const { data: ordersData, isLoading: ordersLoading } = useRestaurantOrders({
    page: 1,
  });

  const recent = (ordersData?.data || []).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your restaurant today.
        </p>
      </div>

      <StatsRow stats={stats} isLoading={isLoading} />

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link
            to="/dashboard/orders"
            className="text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {ordersLoading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm">
            No orders yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((order) => (
              <Link
                key={order._id}
                to={`/dashboard/orders?focus=${order._id}`}
                className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-gray-50 transition"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {order.orderNumber} · {order.customerId?.name || "Customer"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.items.length} items · Rs. {order.total.toFixed(2)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}