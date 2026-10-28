import FormField from "../auth/FormField";

export default function AddressForm({ value, onChange, errors = {} }) {
  const update = (key) => (e) =>
    onChange({ ...value, [key]: e.target.value });

  return (
    <div className="space-y-4">
      <FormField
        label="Delivery Address"
        placeholder="e.g., Lazimpat, Kathmandu 44600"
        value={value.deliveryAddress}
        onChange={update("deliveryAddress")}
        error={errors.deliveryAddress}
        required
      />
      <FormField
        label="Phone Number"
        placeholder="+977-9800000000"
        value={value.deliveryPhone}
        onChange={update("deliveryPhone")}
        error={errors.deliveryPhone}
        required
      />
      <FormField
        label="Delivery Notes"
        hint="Optional — e.g., Ring the bell twice"
      >
        <textarea
          rows={2}
          value={value.deliveryNotes}
          onChange={update("deliveryNotes")}
          placeholder="Any instructions for the delivery person?"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition placeholder:text-gray-400 resize-none"
        />
      </FormField>
    </div>
  );
}