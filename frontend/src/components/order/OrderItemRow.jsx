export default function OrderItemRow({ item }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">
          {item.quantity}× {item.name}
        </p>
        {item.specialInstructions && (
          <p className="text-xs text-gray-500 italic mt-0.5">
            "{item.specialInstructions}"
          </p>
        )}
      </div>
      <span className="text-sm text-gray-600 shrink-0">
        Rs. {item.lineTotal.toFixed(2)}
      </span>
    </div>
  );
}