import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import AddressForm from "./AddressForm";
import PaymentMethodPicker from "./PaymentMethodPicker";
import OrderReviewSummary from "./OrderReviewSummary";
import Button from "../ui/Button";
import api from "../../lib/api";
import useCartStore from "../../store/useCartStore";
import { toast } from "../../lib/toast";

export default function CheckoutForm() {
  const navigate = useNavigate();
  const { items, restaurantId, clearCart, subtotal } = useCartStore();

  const [form, setForm] = useState({
    deliveryAddress: "",
    deliveryPhone: "",
    deliveryNotes: "",
    paymentMethod: "Cash on Delivery",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const sum = subtotal();

  const validate = () => {
    const e = {};
    if (!form.deliveryAddress.trim()) e.deliveryAddress = "Required";
    if (!form.deliveryPhone.trim()) e.deliveryPhone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      setServerError("Your cart is empty");
      return;
    }

    setLoading(true);
    setServerError("");
    try {
      const payload = {
        restaurantId,
        items: items.map((i) => ({
          menuItemId: i._id,
          quantity: i.quantity,
          specialInstructions: i.specialInstructions || "",
        })),
        paymentMethod: form.paymentMethod,
        deliveryAddress: form.deliveryAddress,
        deliveryPhone: form.deliveryPhone,
        deliveryNotes: form.deliveryNotes,
        deliveryFee: 50,
        tax: Math.round(sum * 0.13 * 100) / 100,
      };

      const { data } = await api.post("/orders", payload);

      clearCart();
      toast.success("Order placed! We're on it 🍳");
      navigate(`/orders/${data.data._id}/success`, { replace: true });
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-8">
          {serverError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <section className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4">Delivery Details</h2>
            <AddressForm value={form} onChange={setForm} errors={errors} />
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4">Payment Method</h2>
            <PaymentMethodPicker
              value={form.paymentMethod}
              onChange={(v) => setForm((f) => ({ ...f, paymentMethod: v }))}
            />
          </section>
        </div>

        {/* Right: summary + place order */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <OrderReviewSummary />

            <Button
              type="submit"
              size="lg"
              disabled={loading || items.length === 0}
              className="w-full mt-6"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Placing order..." : (
                <>
                  Place Order <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full mt-3 text-sm text-gray-500 hover:text-orange-500 transition flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}