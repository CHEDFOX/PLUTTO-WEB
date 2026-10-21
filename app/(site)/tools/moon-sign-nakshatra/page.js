import { ToolPage } from '../../../components/tools/ToolPage';
import { toolMeta } from '../../../components/tools/toolMeta';
import MoonWidget from '../../../components/tools/MoonWidget';

export const metadata = toolMeta('moon-sign-nakshatra');

export default function Page() {
  return <ToolPage slug="moon-sign-nakshatra"><MoonWidget /></ToolPage>;
}
