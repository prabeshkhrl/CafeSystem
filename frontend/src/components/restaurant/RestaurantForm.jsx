import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import FormField from "../auth/FormField";
import ImageUploader from "../common/ImageUploader";
import Button from "../ui/Button";

const PAYMENT_METHODS = ["Cash on Delivery", "eSewa", "Khalti"];

const initialForm = {
  name: "",
  about: "",
  address: "",
  phoneNumber: "",
  restaurantLogo: "",
  restaurantBanner: "",
  paymentMethods: ["Cash on Delivery"],
  isActive: true,
};

export default function RestaurantForm({ initial, onSubmit, isLoading }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        about: initial.about || "",
        address: initial.address || "",
        phoneNumber: initial.phoneNumber || "",
        restaurantLogo: initial.restaurantLogo || "",
        restaurantBanner: initial.restaurantBanner || "",
        paymentMethods: initial.paymentMethods || ["Cash on Delivery"],
        isActive: initial.isActive ?? true,
      });
    }
  }, [initial]);

  const update = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: "" }));
    setServerError("");
  };

  const togglePayment = (method) => {
    setForm((f) => {
      const has = f.paymentMethods.includes(method);
      return {
        ...f,
        paymentMethods: has
          ? f.paymentMethods.filter((m) => m !== method)
          : [...f.paymentMethods, method],
      };
    });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Required";
    if (form.paymentMethods.length === 0)
      e.paymentMethods = "Pick at least one payment method";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await onSubmit(form);
      setSavedAt(Date.now());
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {savedAt && !isLoading && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700">
          Saved successfully.
        </div>
      )}

      <ImageUploader
        label="Restaurant Banner"
        value={form.restaurantBanner}
        onChange={(url) =>
          setForm((f) => ({ ...f, restaurantBanner: url }))
        }
        folder="foodhub/banners"
        aspect="banner"
        hint="Wide image — recommended 1200×400 px."
      />

      <div className="grid sm:grid-cols-[120px_1fr] gap-6 items-start">
        <ImageUploader
          label="Logo"
          value={form.restaurantLogo}
          onChange={(url) =>
            setForm((f) => ({ ...f, restaurantLogo: url }))
          }
          folder="foodhub/logos"
          aspect="logo"
        />

        <div className="space-y-4">
          <FormField
            label="Restaurant Name"
            placeholder="Pizza Palace"
            value={form.name}
            onChange={update("name")}
            error={errors.name}
            required
          />
          <FormField label="About" hint="Short description">
            <textarea
              rows={3}
              value={form.about}
              onChange={update("about")}
              placeholder="Wood-fired pizza in the heart of Thamel..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition placeholder:text-gray-400 resize-none"
            />
          </FormField>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          label="Address"
          placeholder="Thamel, Kathmandu"
          value={form.address}
          onChange={update("address")}
          error={errors.address}
          required
        />
        <FormField
          label="Phone Number"
          placeholder="+977-9800000000"
          value={form.phoneNumber}
          onChange={update("phoneNumber")}
          error={errors.phoneNumber}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Methods
        </label>
        <div className="flex gap-2 flex-wrap">
          {PAYMENT_METHODS.map((m) => {
            const active = form.paymentMethods.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => togglePayment(m)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                  active
                    ? "bg-orange-50 border-orange-200 text-orange-600"
                    : "bg-white border-gray-200 text-gray-600 hover:border-orange-200"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
        {errors.paymentMethods && (
          <p className="text-xs text-red-600 mt-1">{errors.paymentMethods}</p>
        )}
      </div>

      <div className="flex justify-end pt-3 border-t border-gray-100">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}