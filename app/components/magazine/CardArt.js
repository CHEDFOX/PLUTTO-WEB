import Picture from './Picture';
import Plate from './Plate';
import { commons } from '../../lib/content/magazine';
import { TitlePlate } from './TitlePlate';

/** The picture a card shows: the photograph in black and white (colour on hover), or the plate. */
export function CardArt({ a, eager }) {
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
