import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Extract the public_id from a Cloudinary URL.
 *   https://res.cloudinary.com/demo/image/upload/v1730012345/foodhub/reviews/abc123.jpg
 *   → foodhub/reviews/abc123
 *
 * Returns null if the URL is not a Cloudinary URL.
 */
export function extractPublicId(url) {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return null;
  }

  // split on "/upload/" and take the rest
  const afterUpload = url.split("/upload/")[1];
  if (!afterUpload) return null;

  // strip the optional version prefix "v1234567890/"
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");

  // strip file extension
  const withoutExt = withoutVersion.replace(/\.[a-z0-9]+$/i, "");

  return withoutExt;
}

/**
 * Delete a single Cloudinary image by URL.
 * Returns { ok: true } or { ok: false, error }.
 * Never throws — safe to loop over arrays.
 */
export async function deleteCloudinaryImage(url) {
  const publicId = extractPublicId(url);
  if (!publicId) return { ok: false, error: "Not a Cloudinary URL" };

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true, // purge CDN cache too
    });
    if (result.result === "ok" || result.result === "not found") {
      return { ok: true, result: result.result };
    }
    return { ok: false, error: result.result };
  } catch (err) {
    console.error("Cloudinary delete error:", publicId, err.message);
    return { ok: false, error: err.message };
  }
}

/**
 * Delete multiple images. Returns a summary — never throws.
 */
export async function deleteCloudinaryImages(urls = []) {
  const results = await Promise.all(
    urls.filter(Boolean).map((url) => deleteCloudinaryImage(url))
  );
  return results;
}