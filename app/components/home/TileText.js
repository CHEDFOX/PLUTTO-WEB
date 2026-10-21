export function TileText({ title, body }) {
  return (
    <>
      <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-white md:text-[24px]">{title}</h3>
      <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-white/55">{body}</p>
    </>
  );
}
