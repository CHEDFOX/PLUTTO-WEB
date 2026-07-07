// Ported from XOOTEQ. Circle (Q body) + inner X + a revolving tail whose
// base snaps between "at the arm tip" (looks like an extension of the X)
// and "at the circle edge" (a short stub touching the circle). The circle's
// stroke alternates between primary blue and white in lockstep with the
// tail's rest/move cadence.
//
// All animation is pure SMIL — no JS, no CSS keyframes.

const BLUE = '#6C82B8';
const WHITE = '#F0F0F0';

export default function LogoMark({ className = '' }) {
  return (
    <svg
      viewBox="-30 -30 160 160"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Plutto logo"
      role="img"
    >
      {/* Circle body — alternates blue → white → blue → white in a 36s cycle */}
      <circle cx="45" cy="45" r="28">
        <animate
          attributeName="stroke"
          dur="36s"
          repeatCount="indefinite"
          values={`${BLUE}; ${BLUE}; ${WHITE}; ${WHITE}; ${BLUE}; ${BLUE}; ${WHITE}; ${WHITE}; ${BLUE}; ${BLUE}; ${WHITE}; ${WHITE}; ${BLUE}; ${BLUE}; ${WHITE}; ${WHITE}; ${BLUE}`}
          keyTimes="0; 0.01389; 0.01389; 0.193; 0.193; 0.26389; 0.26389; 0.443; 0.443; 0.51389; 0.51389; 0.693; 0.693; 0.76389; 0.76389; 0.943; 1"
          calcMode="discrete"
        />
      </circle>

      {/* Inner X arms */}
      <line x1="34" y1="34" x2="56" y2="56" />
      <line x1="56" y1="34" x2="34" y2="56" />

      {/* Revolving tail */}
      <line x2="87.4" y2="87.4">
        <animate
          attributeName="x1"
          dur="36s"
          repeatCount="indefinite"
          values="56; 64.8; 64.8; 56; 56; 64.8; 64.8; 56; 56; 64.8; 64.8; 56; 56; 64.8; 64.8; 56"
          keyTimes="0; 0.01389; 0.0833; 0.25; 0.25; 0.26389; 0.3333; 0.50; 0.50; 0.51389; 0.5833; 0.75; 0.75; 0.76389; 0.8333; 1"
          calcMode="spline"
          keySplines="0.4 0 0.7 1; 0 0 1 1; 0.4 0 0.4 1; 0 0 1 1; 0.4 0 0.7 1; 0 0 1 1; 0.4 0 0.4 1; 0 0 1 1; 0.4 0 0.7 1; 0 0 1 1; 0.4 0 0.4 1; 0 0 1 1; 0.4 0 0.7 1; 0 0 1 1; 0.4 0 0.4 1"
        />
        <animate
          attributeName="y1"
          dur="36s"
          repeatCount="indefinite"
          values="56; 64.8; 64.8; 56; 56; 64.8; 64.8; 56; 56; 64.8; 64.8; 56; 56; 64.8; 64.8; 56"
          keyTimes="0; 0.01389; 0.0833; 0.25; 0.25; 0.26389; 0.3333; 0.50; 0.50; 0.51389; 0.5833; 0.75; 0.75; 0.76389; 0.8333; 1"
          calcMode="spline"
          keySplines="0.4 0 0.7 1; 0 0 1 1; 0.4 0 0.4 1; 0 0 1 1; 0.4 0 0.7 1; 0 0 1 1; 0.4 0 0.4 1; 0 0 1 1; 0.4 0 0.7 1; 0 0 1 1; 0.4 0 0.4 1; 0 0 1 1; 0.4 0 0.7 1; 0 0 1 1; 0.4 0 0.4 1"
        />
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur="36s"
          repeatCount="indefinite"
          values="0 45 45; 90 45 45; 90 45 45; 180 45 45; 180 45 45; 270 45 45; 270 45 45; 360 45 45; 360 45 45"
          keyTimes="0; 0.0833; 0.25; 0.3333; 0.5; 0.5833; 0.75; 0.8333; 1"
          calcMode="spline"
          keySplines="0.45 0 0.55 1; 0 0 1 1; 0.45 0 0.55 1; 0 0 1 1; 0.45 0 0.55 1; 0 0 1 1; 0.45 0 0.55 1; 0 0 1 1"
        />
      </line>
    </svg>
  );
}
