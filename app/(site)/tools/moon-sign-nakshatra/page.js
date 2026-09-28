import { ToolPage, toolMeta } from '../../../components/site/tools/Tool';
import MoonWidget from '../../../components/site/tools/MoonWidget';

export const metadata = toolMeta('moon-sign-nakshatra');

export default function Page() {
  return <ToolPage slug="moon-sign-nakshatra"><MoonWidget /></ToolPage>;
}
