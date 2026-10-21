import Spotlight from '../motion/Spotlight';

export function Tile({ className = '', children }) {
  return (
    <Spotlight
      glow="rgba(17,17,17,0.05)"
      className={`relative overflow-hidden rounded-[2px] bg-black p-7 ring-1 ring-white transition-transform duration-500 hover:-translate-y-1 md:p-8 ${className}`}
    >
      <div className="relative z-10 h-full">{children}</div>
    </Spotlight>
  );
}
