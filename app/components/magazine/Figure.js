import Picture from './Picture';
import Plate from './Plate';
import { commons, commonsPage } from '../../lib/content/magazine';
import { TitlePlate } from './TitlePlate';

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
