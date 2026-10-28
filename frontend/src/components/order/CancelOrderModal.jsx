import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useCancelOrder } from "../../hooks/useOrderMutations";

const COMMON_REASONS = [
  "Ordered by mistake",
  "Changed my mind",
  "Taking too long",
  "Found a better option",
  "Wrong items in cart",
  "Other",
];

export default function CancelOrderModal({ open, orderId, onClose }) {
  const [selected, setSelected] = useState("");
  const [otherText, setOtherText] = useState("");
  const [error, setError] = useState("");

  const cancel = useCancelOrder();

  const finalReason =
    selected === "Other" ? otherText.trim() : selected;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) {
      setError("Please select a reason");
      return;
    }
    if (selected === "Other" && !otherText.trim()) {
      setError("Please describe your reason");
      return;
    }

    setError("");
    try {
      await cancel.mutateAsync({ id: orderId, reason: finalReason });
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to cancel order"
      );
    }
  };

  const handleClose = () => {
    if (cancel.isPending) return;
    setSelected("");
    setOtherText("");
    setError("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Cancel order" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-100">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-800 leading-relaxed">
            Once you cancel, the order can't be restored. If the restaurant
            has already started preparing your food, this option will be
            unavailable.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Why are you cancelling? <span className="text-orange-500">*</span>
          </label>
          <div className="space-y-1.5">
            {COMMON_REASONS.map((r) => (
              <label
                key={r}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition ${
                  selected === r
                    ? "border-orange-300 bg-orange-50"
                    : "border-gray-200 hover:border-orange-200"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={selected === r}
                  onChange={(e) => {
                    setSelected(e.target.value);
                    setError("");
                  }}
                  className="accent-orange-500"
                />
                <span className="text-sm text-gray-700">{r}</span>
              </label>
            ))}
          </div>
        </div>

        {selected === "Other" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Please describe
            </label>
            <textarea
              rows={3}
              value={otherText}
              onChange={(e) => {
                setOtherText(e.target.value);
                setError("");
              }}
              maxLength={200}
              placeholder="Tell us more..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              {otherText.length}/200
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={cancel.isPending}
          >
            Keep order
          </Button>
          <Button
            type="submit"
            disabled={cancel.isPending}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {cancel.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Cancel order
          </Button>
        </div>
      </form>
    </Modal>
  );
}