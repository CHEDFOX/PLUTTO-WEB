import { ToolPage, toolMeta } from '../../../components/site/tools/Tool';
import { ChineseZodiacWidget } from '../../../components/site/tools/Widgets';

export const metadata = toolMeta('chinese-zodiac');

export default function Page() {
  return <ToolPage slug="chinese-zodiac"><ChineseZodiacWidget /></ToolPage>;
}
