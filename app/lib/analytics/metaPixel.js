/**
 * Report an event to Meta through the site's loader (app/api/meta/pixel). A no-op until the pixel is on and, in
 * ASK_FIRST_COUNTRIES, until the visitor has said yes.
 */
export function track(name, data, opts) {
  try { window.plutto_meta?.track(name, data, opts); } catch {}
}
