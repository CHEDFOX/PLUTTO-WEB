import { KICKER } from './classes';

/** When Commons does not answer: the story's name, set as a title page. */
export function TitlePlate({ a }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
      <span className={KICKER}>{a.kicker}</span>
      <span className="max-w-[18ch] font-display text-[22px] leading-tight text-white">{a.title}</span>
    </div>
  );
}
