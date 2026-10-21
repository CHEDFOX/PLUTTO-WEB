/**
 * THE MAGAZINE'S PARTS — the card a story is filed under, the page of the app a
 * story opens into, and the picture at the head of a story.
 *
 * Server markup like the reading pages (Doc.js): every word is in the HTML as
 * sent. Only the photograph is a client component, so it can fall back to a
 * drawn plate when Commons does not answer.
 */
import Link from 'next/link';
import Image from 'next/image';
import Picture from './Picture';
import Plate from './Plates';
import { commons, commonsPage, readMinutes, APP_PAGE } from '../../../lib/content/magazine';

export const KICKER = 'font-mono text-[11px] uppercase tracking-[0.2em] text-sindoor';
export const LABEL = 'font-mono text-[11px] uppercase tracking-[0.2em] text-white/55';

/** When Commons does not answer: the story's name, set as a title page. */
function TitlePlate({ a }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
      <span className={KICKER}>{a.kicker}</span>
      <span className="max-w-[18ch] font-display text-[22px] leading-tight text-white">{a.title}</span>
    </div>
  );
}

/** The picture a card shows: the photograph in black and white (colour on hover), or the plate. */
function CardArt({ a, eager }) {
  if (a.image) {
    return (
      <Picture
        src={commons(a.image.file, 960)}
        alt={a.image.alt}
        eager={eager}
        className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
        fallback={<TitlePlate a={a} />}
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center p-5">
      <Plate name={a.plate} fit="height" className="h-full" />
    </div>
  );
}

/** A story as the contents page files it. `wide` sets it across the page, picture left. */
export function ArticleCard({ a, wide = false, eager = false, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <Link href={`/magazine/${a.slug}`} className={`group block ${wide ? 'grid items-center gap-8 md:grid-cols-2' : ''}`}>
      <div className={`relative overflow-hidden bg-white/[0.04] ring-1 ring-white/15 ${wide ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        <CardArt a={a} eager={eager} />
      </div>
      <div className={`min-w-0 ${wide ? '' : 'mt-5'}`}>
        <p className={KICKER}>{a.kicker}</p>
        <H className={`mt-2 font-display leading-[1.12] tracking-[-0.01em] text-white decoration-1 underline-offset-4 group-hover:underline ${wide ? 'text-[clamp(1.6rem,3vw,2.3rem)]' : 'text-[23px]'}`}>
          {a.title}
        </H>
        <p className={`mt-3 leading-relaxed text-white/65 ${wide ? 'text-[17px]' : 'text-[15px]'}`}>{a.standfirst}</p>
        <p className={`mt-4 ${LABEL}`}>{readMinutes(a)} min read</p>
      </div>
    </Link>
  );
}

/** A page of the app, in a phone's frame, opening the app. */
export function AppPage({ k, size = 'strip', cta = 'Open in the app' }) {
  const p = APP_PAGE[k];
  if (!p) return null;
  return (
    <Link href="/app" className={`group block shrink-0 snap-start ${size === 'strip' ? 'w-[188px] md:w-[208px]' : 'w-full max-w-[240px]'}`}>
      <div className="rounded-[26px] bg-white p-[6px] shadow-[0_24px_40px_-24px_rgba(17,17,17,0.55)] transition-transform duration-500 group-hover:-translate-y-1.5">
        <Image
          src={`/magazine/app/${p.key}.webp`}
          width={540}
          height={1043}
          alt={`${p.title}, a page of the Plutto app`}
          className="block h-auto w-full rounded-[20px]"
          sizes="240px"
        />
      </div>
      {size === 'strip' ? (
        <>
          <p className="mt-4 font-display text-[19px] leading-tight text-white">{p.title}</p>
          <p className="mt-1.5 text-[14px] leading-snug text-white/60">{p.line}</p>
        </>
      ) : null}
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white underline-offset-4 group-hover:underline">{cta} →</p>
    </Link>
  );
}

/** The head of a story: the photograph with its caption and credit, or the plate. */
export function Figure({ a }) {
  if (!a.image) {
    return (
      <figure className="mx-auto mt-12 max-w-2xl px-6">
        <div className="mx-auto max-w-[520px]"><Plate name={a.plate} /></div>
        <figcaption className="mx-auto mt-6 max-w-xl text-center text-[14px] leading-relaxed text-white/60">{a.plateCaption}</figcaption>
      </figure>
    );
  }
  const { file, alt, caption, credit, small } = a.image;
  return (
    <figure className={`mx-auto mt-12 px-6 ${small ? 'max-w-lg' : 'max-w-5xl'}`}>
      <div className={`overflow-hidden bg-white/[0.04] ${small ? 'ring-1 ring-white/20 p-3' : ''}`}>
        <Picture
          src={commons(file, small ? 500 : 1280)}
          alt={alt}
          eager
          className="mx-auto block max-h-[80vh] w-full object-contain"
          fallback={<div className="aspect-[4/3]"><TitlePlate a={a} /></div>}
        />
      </div>
      <figcaption className="mt-4 max-w-3xl text-[13px] leading-relaxed text-white/60">
        <span className="block">{caption}</span>
        <a href={commonsPage(file)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-white/45 underline decoration-white/25 underline-offset-4 hover:text-white">
          {credit}
        </a>
      </figcaption>
    </figure>
  );
}
