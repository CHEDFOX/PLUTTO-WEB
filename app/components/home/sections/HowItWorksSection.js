import FadeUp from '../../motion/FadeUp';
import Story from '../Story';
import { H2 } from '../H2';

export default function HowItWorksSection() {
  return (
    <section id="how" className="lazy-section scroll-mt-20 border-t border-white/[0.08] pt-24 md:pt-32">
      <FadeUp className="px-6 text-center">
        <H2>How it gets to know you.</H2>
      </FadeUp>
      <div className="mt-6 md:mt-0">
        <Story />
      </div>
    </section>
  );
}
