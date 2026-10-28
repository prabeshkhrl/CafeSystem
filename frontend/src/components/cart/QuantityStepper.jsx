import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ value, onChange, min = 1 }) {
  return (
    <div className="inline-flex items-center bg-gray-50 rounded-full">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-orange-500 transition disabled:opacity-40 disabled:hover:bg-gray-50 disabled:hover:text-gray-600"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-semibold">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-orange-500 transition"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}