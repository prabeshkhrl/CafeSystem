import { toast as sonnerToast } from "sonner";

const DEFAULT_OPTS = {
  duration: 3500,
  closeButton: true,
};

/**
 * Pull a human-readable message out of anything:
 *  - Axios error  → err.response.data.message
 *  - JS Error     → err.message
 *  - string       → itself
 *  - fallback     → "Something went wrong"
 */
export function extractErrorMessage(err, fallback = "Something went wrong") {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    fallback
  );
}

export const toast = {
  success(message, opts = {}) {
    sonnerToast.success(message, { ...DEFAULT_OPTS, ...opts });
  },

  error(message, opts = {}) {
    sonnerToast.error(message, { ...DEFAULT_OPTS, duration: 4500, ...opts });
  },

  info(message, opts = {}) {
    sonnerToast(message, { ...DEFAULT_OPTS, ...opts });
  },

  warning(message, opts = {}) {
    sonnerToast.warning(message, { ...DEFAULT_OPTS, ...opts });
  },

  /**
   * Auto-resolve an error from a mutation:
   *   catch (err) { toast.fromError(err); }
   */
  fromError(err, fallback) {
    toast.error(extractErrorMessage(err, fallback));
  },

  /**
   * Show progress, then success/failure automatically:
   *   toast.promise(api.post(...), {
   *     loading: "Saving...",
   *     success: "Saved!",
   *     error: "Failed to save",
   *   });
   */
  promise(promise, messages) {
    return sonnerToast.promise(promise, {
      loading: messages.loading || "Loading...",
      success: messages.success || "Success",
      error: (err) =>
        typeof messages.error === "function"
          ? messages.error(err)
          : messages.error || extractErrorMessage(err),
    });
  },

  dismiss: sonnerToast.dismiss,
};