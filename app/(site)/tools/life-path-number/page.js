import { ToolPage } from '../../../components/tools/ToolPage';
import { toolMeta } from '../../../components/tools/toolMeta';
import { LifePathWidget } from '../../../components/tools/LifePathWidget';

export const metadata = toolMeta('life-path-number');

export default function Page() {
  return <ToolPage slug="life-path-number"><LifePathWidget /></ToolPage>;
}
