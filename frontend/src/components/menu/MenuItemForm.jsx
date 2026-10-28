import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import FormField from "../auth/FormField";
import ImageUploader from "../common/ImageUploader";
import Button from "../ui/Button";

const CATEGORIES = [
  "Pizza", "Burgers", "Rice", "Curry", "Sides",
  "Desserts", "Beverages", "Salads", "Other",
];

const initialForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  menuItemImage: "",
  isAvailable: true,
};

export default function MenuItemForm({ initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        price: initial.price?.toString() ?? "",
        category: initial.category || "",
        description: initial.description || "",
        menuItemImage: initial.menuItemImage || "",
        isAvailable: initial.isAvailable ?? true,
      });
    } else {
      setForm(initialForm);
    }
  }, [initial]);

  const update = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: "" }));
    setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.category.trim()) e.category = "Required";
    const p = Number(form.price);
    if (!form.price || isNaN(p) || p < 0) e.price = "Must be ≥ 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
      });
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="grid sm:grid-cols-[1fr_180px] gap-4">
        <div className="space-y-4">
          <FormField
            label="Item Name"
            placeholder="e.g., Margherita Pizza"
            value={form.name}
            onChange={update("name")}
            error={errors.name}
            required
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              label="Price (Rs.)"
              type="number"
              step="0.01"
              min="0"
              placeholder="12.99"
              value={form.price}
              onChange={update("price")}
              error={errors.price}
              required
            />

            <FormField label="Category" required error={errors.category}>
              <input
                list="categories"
                value={form.category}
                onChange={update("category")}
                placeholder="e.g., Pizza"
                className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm outline-none transition placeholder:text-gray-400 ${
                  errors.category
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                }`}
              />
              <datalist id="categories">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </FormField>
          </div>
        </div>

        <ImageUploader
          label="Image"
          value={form.menuItemImage}
          onChange={(url) =>
            setForm((f) => ({ ...f, menuItemImage: url }))
          }
          folder="foodhub/menu-items"
          aspect="square"
        />
      </div>

      <FormField label="Description" hint="Optional">
        <textarea
          rows={3}
          value={form.description}
          onChange={update("description")}
          placeholder="Classic pizza with fresh mozzarella, tomato sauce, and basil."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition placeholder:text-gray-400 resize-none"
        />
      </FormField>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.isAvailable}
          onChange={update("isAvailable")}
          className="w-4 h-4 rounded accent-orange-500"
        />
        <span className="text-sm text-gray-700">Available for ordering</span>
      </label>

      <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {initial ? "Save Changes" : "Create Item"}
        </Button>
      </div>
    </form>
  );
}