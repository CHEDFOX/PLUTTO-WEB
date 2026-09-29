import { permanentRedirect } from 'next/navigation';

// The years live under this path; the bare path is the sky-calendar hub.
export default function Page() { permanentRedirect('/sky-calendar'); }
