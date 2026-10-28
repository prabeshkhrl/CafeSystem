import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CartItemRow from "../../components/cart/CartItemRow";
import CartSummary from "../../components/cart/CartSummary";
import CartEmptyState from "../../components/cart/CartEmptyState";
import Button from "../../components/ui/Button";
import useCartStore from "../../store/useCartStore";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, subtotal, clearCart } =
    useCartStore();
  const sum = subtotal();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <CartEmptyState />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Continue shopping
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            {items.map((item) => (
              <CartItemRow
                key={item._id}
                item={item}
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
          <button
            onClick={() => {
              if (window.confirm("Clear all items from cart?")) clearCart();
            }}
            className="mt-3 text-xs text-gray-400 hover:text-red-500 transition"
          >
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <CartSummary subtotal={sum} />
            <Button
              size="lg"
              onClick={() => navigate("/checkout")}
              className="w-full mt-5"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}