/**
 * CHAT HOOKS — turning the Oracle's feature recommendation into something the
 * web can actually open.
 *
 * The reply may end by offering ONE feature ("Your timing ›"). The backend sends
 * it as { label, action }, where action is either
 *
 *   { type: 'open_feature', target: '<sectionId>' }   — the usual case
 *   { type: 'open', section: { … } }                  — a CONCEPT feature, whose
 *                                                       whole section is inlined
 *
 * The app opens the feature. The web used to send every hook to the app store
 * regardless of which feature it named, which meant three different
 * recommendations all landed in the same place. Now it opens the ones it can
 * genuinely render and falls back to the store only for the rest — so the
 * fallback means "this one really does need the app", not "the web gave up".
 */

/** The catalog section a hook points at, or null if it cannot be resolved. */
export function sectionForHook(hook, catalog) {
  const a = hook?.action || {};
  // A concept hook carries its section inline — no lookup needed.
  if (a.section && typeof a.section === 'object') return a.section;
  const id = typeof a.target === 'string' ? a.target : null;
  if (!id) return null;
  return (catalog?.sections || []).find((s) => s.id === id) || null;
}

/**
 * Can the web render this section as-is?
 *
 * Deliberately conservative. A section that needs an input flow the web has not
 * built (a partner's birth details, the horary number) would open into a dead
 * screen, which is worse than an honest "this lives in the app" — so it is
 * treated as not openable and the store link stands.
 */
export function openableOnWeb(section) {
  if (!section) return false;
  const fields = section?.config?.fields;
  if (Array.isArray(fields) && fields.length > 0) return false;
  // Readings need an endpoint to call; content tiles carry their copy already.
  return !!section.endpoint || section.feature_kind === 'content';
}
