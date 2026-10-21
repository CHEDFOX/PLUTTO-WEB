import Words from '../motion/Words';

export function H2({ children, className = '' }) {
  return (
    <h2 className={`text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white ${className}`}>
      {typeof children === 'string' ? <Words text={children} stagger={0.06} /> : children}
    </h2>
  );
}
