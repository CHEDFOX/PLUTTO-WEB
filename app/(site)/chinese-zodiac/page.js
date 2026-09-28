import { RefHub, hubMeta } from '../../components/site/Ref';

export const metadata = hubMeta('animals');
export default function Page() { return <RefHub keyName="animals" />; }
