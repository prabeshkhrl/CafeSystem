import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IconButton from "../ui/IconButton";
import useCartStore from "../../store/useCartStore";

export default function CartButton() {
  const navigate = useNavigate();
  const count = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <IconButton badge={count} onClick={() => navigate("/cart")} aria-label="Cart">
      <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-orange-500 transition" />
    </IconButton>
  );
}