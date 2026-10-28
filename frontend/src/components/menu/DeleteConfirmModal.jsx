import { Loader2, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function DeleteConfirmModal({
  open,
  itemName,
  onClose,
  onConfirm,
  isLoading,
}) {
  return (
    <Modal open={open} onClose={onClose} title="Delete menu item?" size="sm">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <Trash2 className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <p className="text-sm text-gray-700">
            Are you sure you want to delete{" "}
            <strong className="text-gray-900">"{itemName}"</strong>?
          </p>
          <p className="text-xs text-gray-400 mt-1">
            This action cannot be undone. Existing orders that already
            contained this item are not affected.
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Delete
        </Button>
      </div>
    </Modal>
  );
}