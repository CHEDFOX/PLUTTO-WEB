import { RefHub } from '../../components/reference/RefHub';
import { hubMeta } from '../../components/reference/refMeta';

export const metadata = hubMeta('signs');
export default function Page() { return <RefHub keyName="signs" />; }
