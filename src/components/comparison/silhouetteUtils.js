/**
 * Parses the natural aspect ratio (width/height) from a PhyloPic raster URL.
 * URLs encode dimensions, e.g. ".../raster/512x254.png" → 512/254 ≈ 2.02
 * Returns null if no URL or no match (caller should use a fallback).
 */
export function parseSilhouetteAspect(url) {
  if (!url) return null
  const m = url.match(/(\d+)x(\d+)\.png$/)
  return m ? parseInt(m[1]) / parseInt(m[2]) : null
}
