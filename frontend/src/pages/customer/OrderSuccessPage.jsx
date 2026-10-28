import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ShoppingBag, ChefHat } from "lucide-react";
import Button from "../../components/ui/Button";
import useOrder from "../../hooks/useOrder";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const { data: order } = useOrder(id);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order placed!
        </h1>
        <p className="text-gray-500 mb-2">
          Thank you for your order. We're preparing it now.
        </p>
        {order?.orderNumber && (
          <p className="text-sm text-gray-400 mb-8">
            Order #{order.orderNumber}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button as="link" to={`/orders/${id}`} variant="primary" size="lg">
            <ChefHat className="w-4 h-4" />
            Track order
          </Button>
          <Button as="link" to="/restaurants" variant="secondary" size="lg">
            <ShoppingBag className="w-4 h-4" />
            Order more
          </Button>
        </div>
      </div>
    </div>
  );
}