import { ToolPage, toolMeta } from '../../../components/site/tools/Tool';
import GunaWidget from '../../../components/site/tools/GunaWidget';
import { GunaTables } from '../../../components/site/tools/Extras';

export const metadata = toolMeta('kundli-matching');

export default function Page() {
  return <ToolPage slug="kundli-matching" after={<GunaTables />}><GunaWidget /></ToolPage>;
}
