import { ToolPage } from '../../../components/tools/ToolPage';
import { toolMeta } from '../../../components/tools/toolMeta';
import { ChineseZodiacWidget } from '../../../components/tools/ChineseZodiacWidget';

export const metadata = toolMeta('chinese-zodiac');

export default function Page() {
  return <ToolPage slug="chinese-zodiac"><ChineseZodiacWidget /></ToolPage>;
}
