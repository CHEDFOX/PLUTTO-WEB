/**
 * A frieze of ten words for fate and divination, each in its own script as the Unicode sign scholars use. The four
 * scripts a phone has no font for (hieroglyphs, cuneiform, runes, ogham) ship as subset fonts from this origin
 * (CSP font-src 'self', see globals.css). On a phone it scrolls sideways with snap.
 */

import { Note } from '../ink/Note';

const WORDS = [
  { glyph: '𓋹', font: 'script-hiero', say: 'ankh', means: 'life', where: 'Egypt', when: '3000 BC' },
  { glyph: '𒉆𒋻', font: 'script-cunei', size: 34, say: 'nam·tar', means: 'fate, as decreed', where: 'Sumer', when: '2500 BC' },
  { glyph: '卜', font: 'script-cjk', say: 'bǔ', means: 'to divine', where: 'Shang China', when: '1200 BC' },
  { glyph: 'ज्योतिष', font: '', small: true, say: 'jyotiṣa', means: 'the science of light', where: 'India', when: '1200 BC' },
  { glyph: 'γνῶθι', font: '', small: true, say: 'gnōthi', means: 'know thyself', where: 'Delphi', when: '500 BC' },
  { glyph: 'גורל', font: '', size: 36, say: 'goral', means: 'the lot that is cast', where: 'Judea', when: '500 BC' },
  { glyph: 'fata', font: 'italic', small: true, say: 'fata viam', means: 'the fates will find a way', where: 'Rome', when: '19 BC' },
  { glyph: '᚛ᚑᚌᚐᚋ᚜', font: 'script-ogham', size: 30, say: 'ogam', means: 'the tree letters', where: 'Ireland', when: '400 AD' },
  { glyph: 'ᚹᚣᚱᛞ', font: 'script-runic', size: 30, say: 'wyrd', means: 'what becomes', where: 'the North', when: '700 AD' },
  { glyph: 'قسمة', font: '', size: 34, say: 'qisma', means: 'kismet', where: 'Arabia', when: '700 AD' },
];

export default function Ancient() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="px-6">
        <Note tilt={-2.5}>before there were answers, there were signs.</Note>
      </div>
      <div className="frieze mt-6 border-y border-white/[0.1]">
        <ol data-no-auto-case className="flex snap-x snap-mandatory overflow-x-auto md:grid md:grid-cols-10 md:overflow-visible">
          {WORDS.map((w, i) => (
            <li key={w.say}
                className="group relative min-w-[46%] flex-none snap-start border-r border-white/[0.07] px-4 py-8 text-center last:border-r-0 sm:min-w-[32%] md:min-w-0 md:px-2 md:py-10"
                style={{ animationDelay: `${i * 0.12}s` }}>
              <div className={`ancient-glyph flex h-[76px] items-end justify-center text-white transition-transform duration-500 group-hover:-translate-y-1 ${w.font}`}
                   style={{ fontSize: w.size || (w.small ? 30 : 48), lineHeight: 1 }}>
                {w.glyph}
              </div>
              <div className="mt-5 text-[14px] font-semibold text-white">{w.say}</div>
              <div className="mx-auto mt-1 max-w-[14ch] text-[12.5px] leading-snug text-white/50">{w.means}</div>
              <div className="mt-3 text-[10.5px] uppercase tracking-[0.16em] text-white/30">{w.where}</div>
              <div className="text-[10.5px] uppercase tracking-[0.16em] text-white/30">{w.when}</div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
