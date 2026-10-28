import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ChevronDown } from "lucide-react";
import api from "../../lib/api";

/**
 * Valid transitions — must match backend ALLOWED_TRANSITIONS.
 */
const TRANSITIONS = {
  placed: ["confirmed", "cancelled", "rejected"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
  rejected: [],
};

const labelMap = {
  confirmed: "Confirm",
  preparing: "Start preparing",
  ready: "Mark ready",
  out_for_delivery: "Out for delivery",
  delivered: "Mark delivered",
  cancelled: "Cancel",
  rejected: "Reject",
};

export default function OrderStatusSelect({ order }) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (nextStatus) => {
      const { data } = await api.patch(`/orders/${order._id}/status`, {
        status: nextStatus,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurant-orders"] });
      qc.invalidateQueries({ queryKey: ["order", order._id] });
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      setOpen(false);
    },
  });

  const allowed = TRANSITIONS[order.status] || [];

  if (allowed.length === 0) {
    return (
      <span className="text-xs text-gray-400 italic">No action</span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={mutation.isPending}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold hover:shadow-md transition disabled:opacity-60"
      >
        {mutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        Update
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
            {allowed.map((s) => (
              <button
                key={s}
                onClick={() => mutation.mutate(s)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 transition ${
                  s === "cancelled" || s === "rejected"
                    ? "text-red-600"
                    : "text-gray-700"
                }`}
              >
                {labelMap[s] || s}
              </button>
            ))}
          </div>
        </>
      )}

      {mutation.isError && (
        <p className="text-xs text-red-600 mt-1">
          {mutation.error?.response?.data?.message || "Failed"}
        </p>
      )}
    </div>
  );
}