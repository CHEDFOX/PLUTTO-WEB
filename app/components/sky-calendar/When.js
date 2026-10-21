/** A sky-calendar instant: printed in UTC in the HTML, the reader's local time filled in after hydration (ui/LocalTime). */
import LocalTime from '../ui/LocalTime';
import { utcShort, utcTime } from '../../lib/astro/skycal';

export const When = ({ t }) => (<><span className="tabular-nums">{utcShort(t)}, {utcTime(t)} UTC</span><br /><span className="text-[12px] text-white/45">your time: <LocalTime t={t} utc="—" /></span></>);
