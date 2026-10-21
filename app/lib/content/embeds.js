/** The calculators other sites may embed, and where each credits back to. */
export const EMBEDS = {
  'moon-sign-nakshatra': { title: 'Moon sign, nakshatra and dasha calculator', page: '/tools/moon-sign-nakshatra', height: 760, credit: 'Moon sign calculator' },
  'kundli-matching': { title: 'Kundli matching (Guna Milan)', page: '/tools/kundli-matching', height: 980, credit: 'Kundli matching calculator' },
};

export const snippet = (tool) => {
  const e = EMBEDS[tool];
  return `<iframe src="https://plutto.space/embed/${tool}" title="${e.title}" width="100%" height="${e.height}" style="border:0;max-width:720px;background:#000;border-radius:16px" loading="lazy"></iframe>\n<p style="font-size:13px">${e.credit} by <a href="https://plutto.space${e.page}">Plutto</a></p>`;
};
