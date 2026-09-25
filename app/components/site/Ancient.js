/**
 * THE OLDEST QUESTION — the same question, in the scripts that first asked it.
 *
 * Ten real words from ten real places, each the word that culture used for
 * fate, for asking, for knowing: the ankh carved at Saqqara, NAM·TAR pressed
 * into Sumerian clay, the 卜 that IS the crack in a Shang oracle bone, the
 * maxim cut over the door at Delphi. Nothing here is invented — every glyph is
 * the Unicode sign the scholars use, and the four scripts a phone has no face
 * for (hieroglyphs, cuneiform, runes, ogham) ship as subset fonts of a few
 * hundred bytes each, served from this origin (see globals.css).
 *
 * It sits under the library's marquee: the cards are how the world asked; this
 * is how far back the asking goes.
 */

import { Note } from './ink/Ink';

const WORDS = [
  { glyph: '𓋹', font: 'script-hiero', say: 'ankh', means: 'life', where: 'Egypt · c. 3000 BC' },
  { glyph: '𒉆𒋻', font: 'script-cunei', say: 'nam·tar', means: 'fate, as decreed', where: 'Sumer · c. 2500 BC' },
  { glyph: '卜', font: 'script-cjk', say: 'bǔ', means: 'to divine — the crack in the bone', where: 'Shang China · c. 1200 BC' },
  { glyph: 'ज्योतिष', font: '', say: 'jyotiṣa', means: 'the science of light', where: 'India · c. 1200 BC' },
  { glyph: 'γνῶθι σεαυτόν', font: '', say: 'gnōthi seauton', means: 'know thyself', where: 'Delphi · c. 500 BC' },
  { glyph: 'גורל', font: '', say: 'goral', means: 'the lot that is cast', where: 'Judea · c. 500 BC' },
  { glyph: 'fata viam invenient', font: 'italic', say: 'Virgil', means: 'the fates will find a way', where: 'Rome · 19 BC' },
  { glyph: '᚛ᚑᚌᚐᚋ᚜', font: 'script-ogham', say: 'ogam', means: 'the tree letters', where: 'Ireland · c. 400 AD' },
  { glyph: 'ᚹᚣᚱᛞ', font: 'script-runic', say: 'wyrd', means: 'what becomes', where: 'the North · c. 700 AD' },
  { glyph: 'قسمة', font: '', say: 'qisma', means: 'your portion — kismet', where: 'Arabia · c. 700 AD' },
];

export default function Ancient() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="flex items-end gap-4">
        <Note tilt={-2.5} className="mb-1">the same question, asked for five thousand years</Note>
      </div>
      <ul data-no-auto-case className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {WORDS.map((w, i) => (
          <li key={w.say} className="group relative overflow-hidden rounded-[22px] bg-[#0c0c11] p-5 ring-1 ring-white/[0.08] transition-transform duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.35}s` }}>
            <div className={`ancient-glyph min-h-[64px] text-[40px] leading-none text-white transition-transform duration-500 group-hover:scale-[1.06] ${w.font}`}
                 style={w.glyph.length > 6 ? { fontSize: 22, lineHeight: 1.15, paddingTop: 6 } : undefined}>
              {w.glyph}
            </div>
            <div className="mt-4 text-[15px] font-semibold text-white">{w.say}</div>
            <div className="mt-0.5 text-[13px] leading-snug text-white/55">{w.means}</div>
            <div className="mt-3 text-[11px] uppercase tracking-[0.14em] text-white/30">{w.where}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
