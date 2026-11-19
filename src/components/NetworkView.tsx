import type { NetworkNode, SimMessage } from '../types/network';
import { NodeCard } from './NodeCard';
export function NetworkView({
  nodes,
  messages,
  onToggle,
}: {
  nodes: NetworkNode[];
  messages: SimMessage[];
  onToggle: (id: number) => void;
}) {
  return (
    <section className='panel network-panel'>
      <div className='panel-heading'>
        <div>
          <h2>Network topology</h2>
          <p>Click a node to simulate failure or recovery</p>
        </div>
        <span className='live-tag'>
          <i /> SIMULATED
        </span>
      </div>
      <div className='network-stage'>
        <div className='connection-ring' />
        {nodes.map((n) => (
          <div key={n.id} className={`node-position pos-${n.id}`}>
            <NodeCard node={n} onToggle={onToggle} />
          </div>
        ))}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`packet packet-${m.type.toLowerCase()}`}
            style={{ '--from': m.from, '--to': m.to } as React.CSSProperties}
          >
            <span>{m.label}</span>
          </div>
        ))}
      </div>
      <div className='network-legend'>
        <span>
          <i className='legend leader' />
          Leader
        </span>
        <span>
          <i className='legend active' />
          Active node
        </span>
        <span>
          <i className='legend failed' />
          Failed node
        </span>
      </div>
    </section>
  );
}
