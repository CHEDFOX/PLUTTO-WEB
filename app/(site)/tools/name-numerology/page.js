import { ToolPage } from '../../../components/tools/ToolPage';
import { toolMeta } from '../../../components/tools/toolMeta';
import { NameNumerologyWidget } from '../../../components/tools/NameNumerologyWidget';

export const metadata = toolMeta('name-numerology');

export default function Page() {
  return <ToolPage slug="name-numerology"><NameNumerologyWidget /></ToolPage>;
}
