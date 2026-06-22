// Inject Cloudinary delivery transformations into an upload URL so the
// CDN serves the best format (AVIF/WebP) and a good automatic quality
// level. Optional `width` is added when provided so Cloudinary returns
// an appropriately sized variant.
//
// IMPORTANT: we deliberately do NOT use `dpr_auto`. Chrome removed the
// `DPR` / `Ch-DPR` client-hint headers, so `dpr_auto` collapses to 1.0
// on every modern browser and yields blurry images on retina displays.
// Callers are expected to request a width that covers the target
// device pixel density themselves (e.g. via `cloudinarySrcSet`).
//
// SVG sources are returned unchanged. Applying `f_auto` to an SVG makes
// Cloudinary rasterize it to a fixed-pixel image, which destroys the
// vector's crispness and is exactly the opposite of an "optimization".
//
// Non-Cloudinary URLs are returned unchanged. URLs that already include
// a transformation segment after `/upload/` are also returned unchanged
// so we don't double-stack transformations.
export function optimizeCloudinary(url: string, width?: number): string {
  if (!url.includes("res.cloudinary.com")) return url;
  // SVG: serve the vector untouched so it stays sharp at any zoom/DPR.
  if (/\.svg(\?|$)/i.test(url)) return url;

  const marker = "/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;

  const after = url.slice(i + marker.length);
  // Only the bare `vXXXX/path` form (no existing transformations) is
  // rewritten — leave anything with a transformation block alone.
  if (!/^v\d+\//.test(after)) return url;

  const parts = ["f_auto", "q_auto:good"];
  if (width && width > 0) {
    parts.push(`w_${Math.round(width)}`, "c_limit");
  }
  return `${url.slice(0, i + marker.length)}${parts.join(",")}/${after}`;
}

/**
 * Build a Cloudinary `srcSet` string at the supplied pixel widths so
 * the browser can pick the right one for the viewport / DPR.
 *
 * For SVG sources the helper returns an empty string — `srcset` is
 * meaningless for a vector image, so the caller should just rely on
 * the plain `src` attribute and skip `srcset` entirely.
 */
export function cloudinarySrcSet(url: string, widths: readonly number[]): string {
  if (/\.svg(\?|$)/i.test(url)) return "";
  return widths
    .map((w) => `${optimizeCloudinary(url, w)} ${w}w`)
    .join(", ");
}
