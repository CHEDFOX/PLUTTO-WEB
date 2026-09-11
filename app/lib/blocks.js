/**
 * BLOCK ADAPTER — every feature-endpoint shape → one { hook, blocks, sections }
 * envelope the renderer understands.
 *
 * This mirrors buildBlocks() in the mobile app (src/render/blocks.js) so both
 * clients render identical content from identical responses. Keep them in step:
 * a new backend shape must be handled in both.
 */

export function buildBlocks(section, raw) {
  raw = raw || {};
  const ttl = section?.title;

  // Content tile — the data lives in the catalog entry itself, no endpoint.
  if (section?.feature_kind === 'content' || section?.template === 'content') {
    const c = section.content || raw.content || {};
    return {
      hook: { title: c.title, body: c.body, cta: c.action_label, media: section.media },
      blocks: [
        c.title && { type: 'heading', text: c.title },
        c.body && { type: 'paragraph', text: c.body },
      ].filter(Boolean),
    };
  }

  // PAGED READING — `pages`, the shape most of what the backend writes comes
  // back in: a tradition, an observation, your places, a person, a concept. It
  // was not handled here at all, so every one of those features fell through to
  // the bottom of this function and rendered as its own title and nothing else.
  //
  // Passed through as pages rather than flattened into blocks, because the beats
  // are written to be read one at a time (see REEL_ARC on the backend) and a
  // flattened column loses the thing that makes them work. `config` rides along:
  // the backdrop, its dim and blur live there.
  if (Array.isArray(raw.pages) && raw.pages.length) {
    return {
      hook: { title: raw.title || ttl, body: raw.pages[0]?.body, media: raw.pages[0]?.media || section?.media },
      blocks: [],
      pages: raw.pages,
      config: { ...(section?.config || {}), ...(raw.config || {}) },
    };
  }

  // Composed envelope — ordered sub-sections (+ a linear blocks tail).
  if (Array.isArray(raw.sections)) {
    return { hook: raw.hook || {}, blocks: raw.blocks || [], sections: raw.sections };
  }

  // Already a block envelope — pass straight through.
  if (Array.isArray(raw.blocks)) {
    return { hook: raw.hook || {}, blocks: raw.blocks };
  }

  // Story shape (past life, life story…).
  if (Array.isArray(raw.segments)) {
    return {
      hook: { title: ttl, body: raw.segments[0], media: section?.media },
      blocks: [
        ttl && { type: 'heading', text: ttl },
        section?.media && { type: 'image', media: section.media, rounded: true },
        { type: 'story', segments: raw.segments },
      ].filter(Boolean),
    };
  }

  // Hook-style reading (chart overview, compatibility hook, generic).
  const r = raw.overview || raw.reading || raw.readings || raw;
  const hookTitle = r?.hook_title || raw.hook_title;
  if (hookTitle) {
    const body = r?.hook_body || raw.hook_body;
    const cta = r?.cta_dive || raw.cta_dive;
    return {
      hook: { title: hookTitle, body, cta, secret: r?.secret, media: section?.media },
      blocks: [
        { type: 'heading', text: hookTitle },
        body && { type: 'paragraph', text: body },
      ].filter(Boolean),
    };
  }

  // Prose reading — most endpoints return one LLM `reading` string.
  if (typeof raw.reading === 'string' && raw.reading.trim()) {
    const paras = raw.reading.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    return {
      hook: { title: ttl, body: paras[0], media: section?.media },
      blocks: [
        ttl && { type: 'heading', text: ttl },
        ...paras.map((p) => ({ type: 'paragraph', text: p })),
      ].filter(Boolean),
    };
  }

  // today-deep bundle: { days: { 'YYYY-MM-DD': {...} } }. Prefer the device's LOCAL
  // date so a bundle cached yesterday still shows today's reading.
  if (raw.days && typeof raw.days === 'object') {
    const d = new Date();
    const localToday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
    const day = raw.days[localToday] || raw.days[Object.keys(raw.days)[0]] || {};
    return {
      hook: { title: day.hook_title || ttl, body: day.hook_body, cta: day.cta_dive, media: section?.media },
      blocks: [
        day.hook_title && { type: 'heading', text: day.hook_title },
        day.hook_body && { type: 'paragraph', text: day.hook_body },
      ].filter(Boolean),
    };
  }

  // Nothing recognized — show only what the backend actually returned.
  return {
    hook: { title: ttl, media: section?.media },
    blocks: ttl ? [{ type: 'heading', text: ttl }] : [],
  };
}

/**
 * READING RULE — Title-Case every word of a reading body, exactly as the mobile
 * app does, so both clients read identically. Only the first letter of each word
 * is forced up, so acronyms and contractions survive (KP, BaZi, don't → Don't).
 * Backend off-switch: theme.titleCaseReadings === false leaves copy verbatim.
 */
export function titleCaseWords(v, theme) {
  if (typeof v !== 'string') return v;
  if (theme && theme.titleCaseReadings === false) return v;
  return v.replace(/(^|[^\p{L}\p{N}'])(\p{L})/gu, (_, pre, ch) => pre + ch.toUpperCase());
}
