import type { LogEntry } from '../types/network';
export function EventLog({ logs }: { logs: LogEntry[] }) {
  return (
    <section className='panel log-panel'>
      <div className='panel-heading'>
        <div>
          <h2>Event stream</h2>
          <p>Election activity and node events</p>
        </div>
        <span className='count-pill'>{logs.length} events</span>
      </div>
      <div className='log-list'>
        {logs.length === 0 ? (
          <div className='empty-log'>
            No events yet. Start an election or change a node state.
          </div>
        ) : (
          logs.map((l) => (
            <div className='log-entry' key={l.id}>
              <span className={`log-mark ${l.tone ?? 'info'}`} />
              <time>{l.time}</time>
              <p>{l.text}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
