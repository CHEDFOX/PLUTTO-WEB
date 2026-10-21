import { Week } from './plates/Week';
import { Zodiacs } from './plates/Zodiacs';
import { Odu } from './plates/Odu';

const PLATES = { week: Week, zodiacs: Zodiacs, odu: Odu };

/** `fit="height"` fills a box of fixed height (a card); the default fills the width. */
export default function Plate({ name, fit = 'width', className = '' }) {
  const P = PLATES[name];
  if (!P) return null;
  const size = fit === 'height' ? '[&_svg]:h-full [&_svg]:w-auto' : '[&_svg]:h-auto [&_svg]:w-full';
  return <div className={`text-white ${size} ${className}`}><P /></div>;
}
