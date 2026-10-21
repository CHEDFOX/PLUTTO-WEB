export function StatusBar({ time }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between text-white" style={{ height: 54, padding: '0 30px 0 50px' }}>
      <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.4, width: 54, textAlign: 'center' }}>{time}</span>
      <span className="flex items-center" style={{ gap: 6, marginRight: 4 }} aria-hidden="true">
        <svg width="19" height="12" viewBox="0 0 19 12" fill="white"><rect x="0" y="7.5" width="3.2" height="4.5" rx="0.9" /><rect x="5.1" y="5.2" width="3.2" height="6.8" rx="0.9" /><rect x="10.2" y="2.7" width="3.2" height="9.3" rx="0.9" /><rect x="15.3" y="0" width="3.2" height="12" rx="0.9" /></svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="white"><path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5l1.2-1.2A10.6 10.6 0 0 0 8.5.6 10.6 10.6 0 0 0 1 3.6l1.2 1.2a8.9 8.9 0 0 1 6.3-2.5Z" /><path d="M8.5 5.7c1.5 0 2.9.6 3.9 1.5l1.2-1.2a7.3 7.3 0 0 0-10.2 0l1.2 1.2c1-1 2.4-1.5 3.9-1.5Z" /><path d="M8.5 9.1c.6 0 1.2.2 1.6.6L8.5 11.4 6.9 9.7c.4-.4 1-.6 1.6-.6Z" /></svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke="white" strokeOpacity=".35" /><rect x="2" y="2" width="20" height="9" rx="2.5" fill="white" /><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="white" fillOpacity=".4" /></svg>
      </span>
    </div>
  );
}
