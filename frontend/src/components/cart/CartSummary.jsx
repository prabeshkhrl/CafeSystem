export default function CartSummary({ subtotal }) {
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const tax = Math.round(subtotal * 0.13 * 100) / 100; // 13% VAT
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="space-y-2 text-sm">
      <Row label="Subtotal" value={subtotal} />
      <Row label="Delivery fee" value={deliveryFee} />
      <Row label="VAT (13%)" value={tax} />
      <div className="border-t border-gray-100 pt-2 mt-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">Total</span>
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