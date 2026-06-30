// The Oracle. The single sacred place where gold lives.
// Pure CSS — no canvas, no JS, no images. Crafted radial gradients
// plus a soft breathing animation.

export default function Orb({ size = 'lg' }) {
  const dim = size === 'sm' ? 'h-[260px] w-[260px]' : 'h-[460px] w-[460px] md:h-[520px] md:w-[520px]';
  return (
    <div className={`relative ${dim} select-none`} aria-hidden="true">
      {/* outer halo — diffuse warm bloom */}
      <div className="orb-halo" />
      {/* the body */}
      <div className="orb-body" />
      {/* upper-left specular highlight */}
      <div className="orb-spec" />
      {/* fine rim — top edge */}
      <div className="orb-rim" />
      {/* slow rotating shimmer */}
      <div className="orb-shimmer" />
    </div>
  );
}
