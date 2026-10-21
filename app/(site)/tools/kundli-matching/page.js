import { ToolPage } from '../../../components/tools/ToolPage';
import { toolMeta } from '../../../components/tools/toolMeta';
import GunaWidget from '../../../components/tools/GunaWidget';
import { GunaTables } from '../../../components/tools/GunaTables';

export const metadata = toolMeta('kundli-matching');

export default function Page() {
  return <ToolPage slug="kundli-matching" after={<GunaTables />}><GunaWidget /></ToolPage>;
}
