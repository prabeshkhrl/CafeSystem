import { useState, useRef } from "react";
import { Loader2, ImagePlus, X, CheckCircle2, Trash2 } from "lucide-react";
import StarRating from "./StarRating";
import Button from "../ui/Button";
import {
  useCreateReview,
  useDeleteReview,
} from "../../hooks/useReviewMutations";

export default function ReviewForm({ order, existingReview, onSuccess }) {
  const [form, setForm] = useState({
    rating: 0,
    foodRating: 0,
    deliveryRating: 0,
    serviceRating: 0,
    comment: "",
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const create = useCreateReview();
  const del = useDeleteReview();

  /* ---------------------------------------------------------------- */
  /*  Already reviewed → show thank-you + delete option                */
  /* ---------------------------------------------------------------- */
  if (existingReview || done) {
    const reviewId =
      typeof existingReview === "string"
        ? existingReview
        : existingReview?._id;

    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-green-800">
              Thanks for your review!
            </p>
            <p className="text-sm text-green-600">
              Your feedback helps other customers.
            </p>

            {reviewId && (
              <div className="mt-3 pt-3 border-t border-green-200">
                {!confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete my review
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-red-700">
                      Delete this review? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="px-3 py-1 rounded-lg text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          del.mutate(reviewId, {
                            onSuccess: () => {
                              setConfirmDelete(false);
                              setDone(false);
                              onSuccess?.();
                            },
                          })
                        }
                        disabled={del.isPending}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60"
                      >
                        {del.isPending && (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {del.isError && (
                  <p className="mt-2 text-xs text-red-600">
                    {del.error?.response?.data?.message ||
                      "Failed to delete review"}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Form state                                                      */
  /* ---------------------------------------------------------------- */
  const update = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const handleImageChange = (url) => {
    if (!url || typeof url !== "string") return;
    setForm((f) => {
      if (f.images.includes(url)) return f;
      if (f.images.length >= 5) return f;
      return { ...f, images: [...f.images, url] };
    });
  };

  const removeImage = (i) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, idx) => idx !== i),
    }));
  };

  const validate = () => {
    const e = {};
    if (form.rating < 1) e.rating = "Please rate the restaurant";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setServerError("");

    try {
      await create.mutateAsync({
        orderId: order._id,
        rating: form.rating,
        foodRating: form.foodRating || null,
        deliveryRating: form.deliveryRating || null,
        serviceRating: form.serviceRating || null,
        comment: form.comment.trim(),
        images: form.images,
      });
      setDone(true);
      onSuccess?.();
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Failed to submit review. Try again."
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 mb-1">Rate your order</h3>
      <p className="text-sm text-gray-500 mb-6">
        How was your experience with{" "}
        {order.restaurantId?.name || "the restaurant"}?
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {serverError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {/* Overall rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall rating <span className="text-orange-500">*</span>
          </label>
          <StarRating
            value={form.rating}
            onChange={update("rating")}
            size="lg"
          />
          {errors.rating && (
            <p className="mt-1 text-xs text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* Sub-ratings */}
        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <SubRating
            label="Food"
            value={form.foodRating}
            onChange={update("foodRating")}
          />
          <SubRating
            label="Delivery"
            value={form.deliveryRating}
            onChange={update("deliveryRating")}
          />
          <SubRating
            label="Service"
            value={form.serviceRating}
            onChange={update("serviceRating")}
          />
        </div>

        {/* Comment */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your review
          </label>
          <textarea
            rows={4}
            value={form.comment}
            onChange={(e) => update("comment")(e.target.value)}
            placeholder="Tell others what you liked (or didn't)..."
            maxLength={1000}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            {form.comment.length}/1000
          </p>
        </div>

        {/* Photos */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add photos{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {form.images.map((url, i) => (
              <div
                key={url + i}
                className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-100"
              >
                <img
                  src={url}
                  alt={`Review photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-gray-700 hover:text-red-600"
                  aria-label="Remove photo"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {form.images.length < 5 && (
              <AddPhotoTile onUpload={handleImageChange} />
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Up to 5 photos. JPG, PNG, or WEBP.
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={create.isPending}
          className="w-full"
        >
          {create.isPending && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          Submit Review
        </Button>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Sub-rating row                                                      */
/* -------------------------------------------------------------------- */
function SubRating({ label, value, onChange }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
      <StarRating value={value} onChange={onChange} size="md" />
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Add-photo tile                                                      */
/* -------------------------------------------------------------------- */
function AddPhotoTile({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const { uploadImage } = await import("../../lib/uploadImage");
      const url = await uploadImage(file, { folder: "foodhub/reviews" });
      onUpload(url);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500 transition disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
        ) : (
          <>
            <ImagePlus className="w-5 h-5" />
            <span className="text-[10px] font-medium">Add photo</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && <p className="text-xs text-red-600 w-full">{error}</p>}
    </>
  );
}