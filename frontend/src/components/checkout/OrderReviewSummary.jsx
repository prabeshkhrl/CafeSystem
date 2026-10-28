import useCartStore from "../../store/useCartStore";

export default function OrderReviewSummary() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const tax = Math.round(subtotal * 0.13 * 100) / 100;
  const total = subtotal + deliveryFee + tax;

  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-gray-700 truncate">
              {item.quantity}× {item.name}
            </span>
            <span className="text-gray-500 shrink-0 ml-2">
              Rs. {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 text-sm border-t border-gray-100 pt-3">
        <Row label="Subtotal" value={subtotal} />
        <Row label="Delivery fee" value={deliveryFee} />
        <Row label="VAT (13%)" value={tax} />
        <div className="border-t border-gray-100 pt-2 mt-2 flex items-center justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold text-lg text-orange-600">
            Rs. {total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-gray-600">
      <span>{label}</span>
      <span>Rs. {value.toFixed(2)}</span>
    </div>
  );
}