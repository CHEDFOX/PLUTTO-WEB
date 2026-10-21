import Link from 'next/link';
import { LINK } from '../doc/classes';

/** A fact's value: plain text, or segments where some are links. */
export function Val({ v }) {
  if (!Array.isArray(v)) return v;
  return v.map((x, i) => (typeof x === 'string' ? x : <Link key={i} href={x.href} className={LINK}>{x.t}</Link>));
}
