/**
 * Uploads a file to Cloudinary using an unsigned upload preset.
 * @param {File} file
 * @param {Object} opts
 * @param {(percent: number) => void} [opts.onProgress]
 * @param {string} [opts.folder]
 * @returns {Promise<string>} secure_url of the uploaded asset
 */
export async function uploadImage(file, { onProgress, folder } = {}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !preset) {
    throw new Error(
      "Cloudinary env vars missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env"
    );
  }

  if (!file) throw new Error("No file provided");

  // 5 MB hard cap
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File must be under 5 MB");
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowed.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WEBP images are allowed");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  if (folder) formData.append("folder", folder);

  // Use XMLHttpRequest for upload progress (fetch has no progress events)
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    );

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(res.secure_url);
        } else {
          reject(new Error(res.error?.message || "Upload failed"));
        }
      } catch {
        reject(new Error("Invalid upload response"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}