import { Navigate } from "react-router-dom";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import useCartStore from "../../store/useCartStore";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);

//   if (items.length === 0) {
//     return <Navigate to="/cart" replace />;
//   }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}