import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import CartItemRow from "./CartItemRow";
import CartSummary from "./CartSummary";
import CartEmptyState from "./CartEmptyState";
import Button from "../ui/Button";
import useCartStore from "../../store/useCartStore";
import { toast } from "../../lib/toast";

export default function CartDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const {
    items,
    restaurantId,
    updateQuantity,
    removeItem,
    subtotal,
    clearCart,
  } = useCartStore();

  const sum = subtotal();
  const count = items.reduce((s, i) => s + i.quantity, 0);

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">
            Your Cart {count > 0 && <span className="text-gray-400 font-normal">({count})</span>}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-50 transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <CartEmptyState onClose={onClose} />
          ) : (
            <div className="px-5">
              {items.map((item) => (
                <CartItemRow
                  key={item._id}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-4">
            <CartSummary subtotal={sum} />
            <Button size="lg" onClick={handleCheckout} className="w-full">
              Checkout <ArrowRight className="w-4 h-4" />
            </Button>
            <button
              onClick={() => {
                if (window.confirm("Clear all items from cart?")){ 
                  clearCart();
                 toast.info("Cart cleared");}
              }}
              className="w-full text-xs text-gray-400 hover:text-red-500 transition"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}