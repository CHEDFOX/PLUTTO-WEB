import Link from 'next/link';
import { LINK } from '../doc/classes';

const sl = (s) => s.toLowerCase();
export const signLink = (s) => <Link href={`/zodiac-signs/${sl(s)}`} className={LINK}>{s}</Link>;
export const list = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
