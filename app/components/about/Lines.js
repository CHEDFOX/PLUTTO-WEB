/** The longer passages: small, quiet, one line per line, a breath between stanzas. */
export function Lines({ text }) {
  return text.split('\n\n').map((stanza, i) => (
    <span key={i} className={`block ${i ? 'mt-5' : ''}`}>
      {stanza.split('\n').map((l) => <span key={l} className="block">{l}</span>)}
    </span>
  ));
}
