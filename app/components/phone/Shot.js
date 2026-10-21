/**
 * A capture of the real app: its own components rendered by react-native-web at 393x852 pt, 3x, on the
 * backend's catalog, by tools/app-screens. Regenerate the images with that harness; never edit them.
 */

import Image from 'next/image';

export default function Shot({ src, alt }) {
  return (
    <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 320px, 260px" className="object-cover" />
  );
}
