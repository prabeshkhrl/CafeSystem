import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";
import PasswordInput from "./PasswordInput";
import Button from "../ui/Button";
import api from "../../lib/api";
import useAuthStore from "../../store/useAuthStore";
import { toast } from "../../lib/toast";
export default function RestaurantRegisterForm() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    // owner
    name: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    // restaurant
    restaurantName: "",
    about: "",
    address: "",
    restaurantPhoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
    setServerError("");
  };

  const validate = () => {
    const e = {};
    ["name", "username", "email", "password", "restaurantName", "address", "restaurantPhoneNumber"].forEach(
      (k) => {
        if (!form[k]?.trim()) e[k] = "Required";
      }
    );
    if (form.password && form.password.length < 6) e.password = "At least 6 characters";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register/restaurant", {
        ...form,
        email: form.email.toLowerCase(),
      });

      useAuthStore.setState({ token: data.token, user: data.data.user });
      setUser(data.data.user);
      toast.success("Restaurant created! Head to your dashboard to add a menu.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {serverError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* ───── Owner account ───── */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Your Account</h3>
        <div className="space-y-4">
          <FormField label="Full Name" placeholder="John Doe" value={form.name} onChange={update("name")} error={errors.name} required />
          <FormField label="Username" placeholder="pizzaowner" value={form.username} onChange={update("username")} error={errors.username} required />
          <FormField label="Email" type="email" placeholder="owner@pizzapalace.com" value={form.email} onChange={update("email")} error={errors.email} required />
          <FormField label="Password" required error={errors.password}>
            <PasswordInput value={form.password} onChange={update("password")} error={errors.password} placeholder="At least 6 characters" autoComplete="new-password" />
          </FormField>
          <FormField label="Phone Number" placeholder="+977-9800000000" value={form.phoneNumber} onChange={update("phoneNumber")} error={errors.phoneNumber} />
        </div>
      </div>

      {/* ───── Restaurant details ───── */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Restaurant Details</h3>
        <div className="space-y-4">
          <FormField label="Restaurant Name" placeholder="Pizza Palace" value={form.restaurantName} onChange={update("restaurantName")} error={errors.restaurantName} required />
          <FormField
            label="About"
            error={errors.about}
            hint="A short description (optional)"
          >
            <textarea
              rows={3}
              placeholder="Wood-fired pizza in the heart of Thamel..."
              value={form.about}
              onChange={update("about")}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition placeholder:text-gray-400 resize-none"
            />
          </FormField>
          <FormField label="Address" placeholder="Thamel, Kathmandu" value={form.address} onChange={update("address")} error={errors.address} required />
          <FormField label="Restaurant Phone" placeholder="+977-9800000000" value={form.restaurantPhoneNumber} onChange={update("restaurantPhoneNumber")} error={errors.restaurantPhoneNumber} required />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={loading} className="w-full mt-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Creating account..." : "Create Restaurant Account"}
      </Button>

      <p className="text-center text-sm text-gray-500 pt-2">
        Already have an account?{" "}
        <Link to="/auth" className="font-semibold text-orange-500 hover:text-orange-600">
          Sign in
        </Link>
      </p>
    </form>
  );
}