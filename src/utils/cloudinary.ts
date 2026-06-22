// Inject Cloudinary delivery transformations into an upload URL so the
// CDN serves the best format (AVIF/WebP) and an automatic quality level
// for the requesting client. Optional width is added when provided so
// Cloudinary returns an appropriately sized variant.
//
// Non-Cloudinary URLs are returned unchanged. URLs that already include
// a transformation segment after `/upload/` are also returned unchanged
// so we don't double-stack transformations.
export function optimizeCloudinary(url: string, width?: number): string {
  if (!url.includes("res.cloudinary.com")) return url;
  const marker = "/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;

  const after = url.slice(i + marker.length);
  // If a transformation block is already present (anything before the
  // version `v123...` segment), leave the URL alone.
  if (!/^v\d+\//.test(after)) return url;

  const parts = ["f_auto", "q_auto"];
  if (width && width > 0) {
    parts.push(`w_${Math.round(width)}`, "c_limit", "dpr_auto");
  }
  return `${url.slice(0, i + marker.length)}${parts.join(",")}/${after}`;
}
