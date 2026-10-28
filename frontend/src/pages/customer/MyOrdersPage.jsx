import { useState } from "react";
import useMyOrders from "../../hooks/useMyOrders";
import OrderList from "../../components/order/OrderList";
import OrderFilterBar from "../../components/order/OrderFilterBar";

export default function MyOrdersPage() {
  const [status, setStatus] = useState("");
  const { data, isLoading } = useMyOrders({ status });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
      <p className="text-gray-500 mb-6">Track and manage your orders.</p>

      <OrderFilterBar value={status} onChange={setStatus} />
      <OrderList orders={data?.data || []} isLoading={isLoading} />
    </div>
  );
}