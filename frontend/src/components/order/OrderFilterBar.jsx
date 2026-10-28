const tabs = [
  { value: "", label: "All" },
  { value: "placed", label: "Placed" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "On the way" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrderFilterBar({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition ${
            value === t.value
              ? "bg-orange-500 text-white shadow-md"
              : "bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}