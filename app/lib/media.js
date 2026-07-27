/**
 * MEDIA — catalog media keys → real URLs.
 *
 * The catalog refers to media WITHOUT an extension ("features/prashna"), while the
 * files on disk have one. The backend's media manifest lists every static file, so
 * we fetch it once and index by stem to resolve a key to its actual path.
 */

import { API_BASE } from './api';

let _index = null;
let _pending = null;

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

async function loadIndex() {
  if (_index) return _index;
  if (_pending) return _pending;
  _pending = (async () => {
    try {
      const r = await fetch(`${API_BASE}/api/public/media-manifest`);
      const m = await r.json();
      const idx = {};
      for (const rel of Object.keys(m?.files || {})) {
        const stem = rel.replace(/\.[^./]+$/, '');
        // Prefer an image when both an image and a video exist for one stem —
        // the web renderer uses <img> unless the caller asks for video.
        if (!idx[stem] || (IMAGE_EXT.test(rel) && !IMAGE_EXT.test(idx[stem]))) {
          idx[stem] = rel;
        }
        idx[rel] = rel; // exact keys resolve too
      }
      _index = idx;
      return idx;
    } catch {
      _index = {};
      return _index;
    }
  })();
  return _pending;
}

/** Warm the manifest early (call once when the app mounts). */
export function preloadMedia() {
  loadIndex();
}

/** Resolve a catalog media key to a URL, or null. Sync — returns null until warm. */
export function mediaUrl(key) {
  if (!key || typeof key !== 'string') return null;
  if (/^https?:\/\//.test(key)) return key;
  const idx = _index;
  if (!idx) {
    loadIndex();
    // Manifest not warm yet: a bare key with an extension still works.
    return /\.[a-z0-9]+$/i.test(key) ? `${API_BASE}/static/${key}` : null;
  }
  const rel = idx[key] || idx[key.replace(/^\/+/, '')];
  return rel ? `${API_BASE}/static/${rel}` : null;
}

export function isVideo(url) {
  return !!url && VIDEO_EXT.test(url);
}

/** Async variant for first paint — waits for the manifest. */
export async function resolveMedia(key) {
  await loadIndex();
  return mediaUrl(key);
}
