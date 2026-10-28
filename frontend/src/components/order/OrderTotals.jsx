export default function OrderTotals({ order }) {
  return (
    <div className="space-y-1.5 text-sm">
      <Row label="Subtotal" value={order.subtotal} />
      <Row label="Delivery fee" value={order.deliveryFee} />
      <Row label="VAT" value={order.tax} />
      {order.discount > 0 && (
        <Row label="Discount" value={-order.discount} />
      )}
      <div className="border-t border-gray-100 pt-2 mt-2 flex items-center justify-between">
        <span className="font-bold">Total</span>
        <span className="font-bold text-lg text-orange-600">
          Rs. {order.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-gray-600">
      <span>{label}</span>
      <span>
        {value < 0 ? "-" : ""}Rs. {Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}