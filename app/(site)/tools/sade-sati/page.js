import { ToolPage } from '../../../components/tools/ToolPage';
import { toolMeta } from '../../../components/tools/toolMeta';
import SadeSatiWidget from '../../../components/tools/SadeSatiWidget';
import { SadeSatiTable } from '../../../components/tools/SadeSatiTable';

export const metadata = toolMeta('sade-sati');

export default function Page() {
  return <ToolPage slug="sade-sati" after={<SadeSatiTable />}><SadeSatiWidget /></ToolPage>;
}
