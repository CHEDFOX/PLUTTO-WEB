/**
 * A REAL SCREEN — a capture of the app itself.
 *
 * These images are not drawings. They are the mobile app's own components
 * (src/render, src/screens) rendered by react-native-web at 393 × 852 pt and
 * 3× scale, fed the live catalog the backend builds and the backend's own
 * static files, and captured. The only web-side adjustments are the ones that
 * make a browser behave like the phone: the safe-area insets pinned to an
 * iPhone 15's, the input's focus ring removed, the multiline box held to the
 * one-line height iOS gives it, and the system face mapped to Inter where SF
 * is not installed. Regenerate them with the harness, never edit them.
 */

import Image from 'next/image';

export default function Shot({ src, alt }) {
  return (
    <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 320px, 260px" className="object-cover" />
  );
}
