import { Check } from "lucide-react";

const steps = [
  { key: "placed", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "out_for_delivery", label: "On the way" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderTimeline({ status, history = [] }) {
  if (["cancelled", "rejected"].includes(status)) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
        This order was <strong>{status}</strong>.
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        const event = history.find((h) => h.status === step.key);

        return (
          <div key={step.key} className="flex items-start gap-3">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                done
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-400"
              } ${active ? "ring-4 ring-orange-100" : ""}`}
            >
              {done ? <Check className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-current" />}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className={`text-sm font-semibold ${done ? "text-gray-900" : "text-gray-400"}`}>
                {step.label}
              </p>
              {event?.at && (
                <p className="text-xs text-gray-400">
                  {new Date(event.at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}