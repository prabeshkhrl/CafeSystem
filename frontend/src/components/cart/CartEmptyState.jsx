import { ShoppingCart } from "lucide-react";
import Button from "../ui/Button";

export default function CartEmptyState({ onClose }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
        <ShoppingCart className="w-8 h-8 text-orange-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        Your cart is empty
      </h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        Add items from a restaurant to get started.
      </p>
      <Button as="link" to="/restaurants" onClick={onClose}>
        Browse restaurants
      </Button>
    </div>
  );
}