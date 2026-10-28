import { useState } from "react";
import useRestaurantOrders from "../../hooks/useRestaurantOrders";
import LiveOrderQueue from "../../components/order/LiveOrderQueue";
import OrderFilterBar from "../../components/order/OrderFilterBar";

export default function DashboardOrdersPage() {
  const [status, setStatus] = useState("");
  const { data, isLoading } = useRestaurantOrders({ status });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">
          Live queue — updates automatically every 15 seconds.
        </p>
      </div>

      <OrderFilterBar value={status} onChange={setStatus} />
      <LiveOrderQueue orders={data?.data || []} isLoading={isLoading} />
    </div>
  );
}