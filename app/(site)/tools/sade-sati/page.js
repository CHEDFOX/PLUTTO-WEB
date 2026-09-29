import { ToolPage, toolMeta } from '../../../components/site/tools/Tool';
import SadeSatiWidget from '../../../components/site/tools/SadeSatiWidget';
import { SadeSatiTable } from '../../../components/site/tools/Extras';

export const metadata = toolMeta('sade-sati');

export default function Page() {
  return <ToolPage slug="sade-sati" after={<SadeSatiTable />}><SadeSatiWidget /></ToolPage>;
}
