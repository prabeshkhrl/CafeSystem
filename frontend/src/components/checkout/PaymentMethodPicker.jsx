import { Banknote, Wallet, CreditCard } from "lucide-react";

const methods = [
  {
    value: "Cash on Delivery",
    label: "Cash on Delivery",
    desc: "Pay when your food arrives",
    icon: Banknote,
  },
  {
    value: "eSewa",
    label: "eSewa",
    desc: "Pay with your eSewa wallet",
    icon: Wallet,
  },
  {
    value: "Khalti",
    label: "Khalti",
    desc: "Pay with your Khalti wallet",
    icon: CreditCard,
  },
];

export default function PaymentMethodPicker({ value, onChange }) {
  return (
    <div className="space-y-2">
      {methods.map((m) => {
        const Icon = m.icon;
        const active = value === m.value;
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition ${
              active
                ? "border-orange-400 bg-orange-50 ring-2 ring-orange-100"
                : "border-gray-200 bg-white hover:border-orange-200"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                active
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{m.label}</p>
              <p className="text-xs text-gray-500">{m.desc}</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                active ? "border-orange-500" : "border-gray-300"
              }`}
            >
              {active && (
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}