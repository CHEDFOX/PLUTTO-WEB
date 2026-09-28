import { ToolPage, toolMeta } from '../../../components/site/tools/Tool';
import { LifePathWidget } from '../../../components/site/tools/Widgets';

export const metadata = toolMeta('life-path-number');

export default function Page() {
  return <ToolPage slug="life-path-number"><LifePathWidget /></ToolPage>;
}
