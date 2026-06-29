// The sacred glyph. Gold only.
// Used as wordmark suffix and as the section/divider mark.

export default function Mark({ className = '', size = 'inline' }) {
  const sized = size === 'inline' ? 'text-[0.7em]' : '';
  return (
    <span
      aria-hidden="true"
      className={`text-gold ${sized} ${className}`}
      style={{ fontFeatureSettings: '"liga" 0' }}
    >
      ✦
    </span>
  );
}
