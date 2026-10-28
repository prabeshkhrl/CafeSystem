import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import useCartStore from "../../store/useCartStore";
import { toast } from "../../lib/toast";

export default function MenuItemCard({ item, restaurant }) {
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const quantityInCart = useCartStore(
    (s) => s.items.find((i) => i._id === item._id)?.quantity || 0
  );

  const handleAdd = () => {
    if (!restaurant.isActive) return;
    addItem(item, restaurant._id);
    toast.success(`${item.name} added to cart`);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 transition">
      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
            {item.description}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2">
          <span className="text-lg font-bold text-orange-600">
            Rs. {item.price.toFixed(2)}
          </span>
          {!item.isAvailable && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              Unavailable
            </span>
          )}
          {quantityInCart > 0 && (
            <span className="text-xs bg-orange-50 text-orange-600 font-medium px-2 py-0.5 rounded-full">
              {quantityInCart} in cart
            </span>
          )}
        </div>
      </div>

      {/* Image + Add button */}
      <div className="relative shrink-0">
        <div className="w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100">
          {item.menuItemImage ? (
            <img
              src={item.menuItemImage}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              🍕
            </div>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={!item.isAvailable || !restaurant.isActive}
          className={`absolute -bottom-2 right-2 w-9 h-9 rounded-full shadow-md flex items-center justify-center transition ${
            !item.isAvailable || !restaurant.isActive
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : justAdded
              ? "bg-green-500 text-white"
              : "bg-white border border-orange-200 text-orange-500 hover:bg-orange-500 hover:text-white"
          }`}
          aria-label={`Add ${item.name} to cart`}
        >
          {justAdded ? (
            <span className="text-xs font-bold">✓</span>
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}