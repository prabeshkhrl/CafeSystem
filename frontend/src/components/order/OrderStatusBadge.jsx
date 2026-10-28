const config = {
  placed: { label: "Placed", cls: "bg-blue-50 text-blue-600 border-blue-100" },
  confirmed: { label: "Confirmed", cls: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  preparing: { label: "Preparing", cls: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  ready: { label: "Ready", cls: "bg-orange-50 text-orange-600 border-orange-100" },
  out_for_delivery: { label: "Out for delivery", cls: "bg-purple-50 text-purple-600 border-purple-100" },
  delivered: { label: "Delivered", cls: "bg-green-50 text-green-600 border-green-100" },
  cancelled: { label: "Cancelled", cls: "bg-gray-100 text-gray-500 border-gray-200" },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-600 border-red-100" },
};

export default function OrderStatusBadge({ status }) {
  const c = config[status] || { label: status, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.cls}`}>
      {c.label}
    </span>
  );
}