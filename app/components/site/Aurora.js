/**
 * AURORA — colour, at the size of a room.
 *
 * The page is black and stays black; these are three or four very large, very
 * soft washes of the library's own shelf colours sitting behind the type at a
 * few percent opacity. Big and dim reads as depth and as expense. Small and
 * bright reads as a toy, which is why none of these is ever a visible shape:
 * the blur is larger than the blob.
 *
 * Pure CSS radial gradients, no canvas, no animation, no cost. Decorative, so
 * it is hidden from the accessibility tree.
 */

export default function Aurora({ blobs = [], className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            transform: 'translate(-50%, -50%)',
            // The falloff is the gradient's own — a CSS blur would need room
            // the section does not have, and gets clipped into a rectangle.
            background: `radial-gradient(circle, ${b.color} 0%, ${b.color}77 34%, transparent 72%)`,
            opacity: b.opacity ?? 0.16,
          }}
        />
      ))}
    </div>
  );
}
