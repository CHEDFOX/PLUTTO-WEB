import { ToolPage, toolMeta } from '../../../components/site/tools/Tool';
import { NameNumerologyWidget } from '../../../components/site/tools/Widgets';

export const metadata = toolMeta('name-numerology');

export default function Page() {
  return <ToolPage slug="name-numerology"><NameNumerologyWidget /></ToolPage>;
}
