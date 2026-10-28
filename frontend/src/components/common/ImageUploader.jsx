import { useRef, useState, useCallback } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "../../lib/uploadImage";


export default function ImageUploader({
  value,
  onChange,
  folder = "foodhub",
  aspect = "square", // "square" | "banner" | "logo"
  label,
  hint,
  error,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState("");

  const aspectClass = {
    square: "aspect-square",
    banner: "aspect-[3/1]",
    logo: "aspect-square max-w-[120px]",
  }[aspect];

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      setLocalError("");
      setUploading(true);
      setProgress(0);
      try {
        const url = await uploadImage(file, {
          folder,
          onProgress: setProgress,
        });
        onChange(url);
      } catch (err) {
        setLocalError(err.message || "Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [folder, onChange]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ""; // allow re-uploading same file
  };

  const removeImage = () => {
    setLocalError("");
    onChange("");
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed overflow-hidden transition ${aspectClass} ${
          error || localError
            ? "border-red-300 bg-red-50/30"
            : dragOver
            ? "border-orange-400 bg-orange-50"
            : value
            ? "border-transparent bg-gray-50"
            : "border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50"
        }`}
      >
        {/* Image preview */}
        {value && !uploading && (
          <>
            <img
              src={value}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Upload in progress */}
        {uploading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            <div className="w-full max-w-[140px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{progress}%</span>
          </div>
        )}

        {/* Empty state */}
        {!value && !uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              {dragOver ? (
                <UploadCloud className="w-5 h-5 text-orange-500" />
              ) : (
                <ImageIcon className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <p className="text-xs text-gray-500 leading-tight">
              <span className="font-semibold text-orange-500">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-[10px] text-gray-400">JPG, PNG, WEBP · max 5 MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileInput}
        className="hidden"
      />

      {(error || localError) && (
        <p className="mt-1 text-xs text-red-600">{error || localError}</p>
      )}
      {!error && !localError && hint && (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      )}
    </div>
  );
}