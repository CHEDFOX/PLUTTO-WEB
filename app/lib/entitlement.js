/**
 * ENTITLEMENT — mirrors the mobile gate (src/render/subscription.js isGated).
 *
 * A section is locked when the subscription is enabled AND the section is listed
 * in subscription.gates (or requires the entitlement) AND the user isn't a
 * subscriber. The gate list is backend-controlled, so web and mobile lock exactly
 * the same features. Never widen or bypass this — a gate removed here is revenue
 * lost and a promise broken.
 */

export function isEntitled(session) {
  return !!session?.entitlement?.active;
}

export function isGated(section, catalog, entitled) {
  const sub = catalog?.subscription;
  if (!sub?.enabled || !section) return false;
  if (entitled) return false;
  const ent = sub.entitlement || 'pro';
  const requires =
    (Array.isArray(section.requires) && section.requires.includes(ent)) ||
    (Array.isArray(sub.gates) && sub.gates.includes(section.id));
  return !!requires;
}
