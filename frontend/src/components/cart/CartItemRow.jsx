import { Trash2 } from "lucide-react";
import QuantityStepper from "./QuantityStepper";

export default function CartItemRow({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100 shrink-0">
        {item.menuItemImage ? (
          <img
            src={item.menuItemImage}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">
            🍕
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 truncate">
          {item.name}
        </h4>
        <p className="text-xs text-gray-500">
          Rs. {item.price.toFixed(2)} each
        </p>

        <div className="flex items-center justify-between mt-2">
          <QuantityStepper
            value={item.quantity}
            onChange={(q) => onQuantityChange(item._id, q)}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">
              Rs. {(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => onRemove(item._id)}
              className="text-gray-400 hover:text-red-500 transition p-1"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}