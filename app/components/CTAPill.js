import Link from 'next/link';

// Default: white pill with black text — primary CTA on black bg.
// variant="ghost" → outlined transparent pill, white text.

export default function CTAPill({
  href,
  children,
  variant = 'primary',
  className = '',
  external = false,
}) {
  const base =
    'inline-flex items-center justify-center rounded-full px-8 py-4 text-[11px] uppercase tracking-[0.32em] transition-all duration-300';
  const styles =
    variant === 'primary'
      ? 'bg-white text-black hover:bg-gold hover:text-black'
      : 'border border-white/30 text-white hover:border-white hover:bg-white/5';
  const Comp = external ? 'a' : Link;
  const extraProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};
  return (
    <Comp href={href} className={`${base} ${styles} ${className}`} {...extraProps}>
      {children}
    </Comp>
  );
}
