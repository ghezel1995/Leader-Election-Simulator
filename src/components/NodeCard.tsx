import type { NetworkNode } from '../types/network';
export function NodeCard({
  node,
  onToggle,
}: {
  node: NetworkNode;
  onToggle: (id: number) => void;
}) {
  const state =
    node.status === 'failed' ? 'failed' : node.isLeader ? 'leader' : 'active';
  return (
    <button
      className={`node-card ${state}`}
      onClick={() => onToggle(node.id)}
      aria-label={`Node ${node.id}, ${state}. Click to toggle`}
    >
      <div className='node-top'>
        <span className='node-icon'>
          {node.status === 'failed' ? '×' : '⌘'}
        </span>
        <span className={`state-dot ${state}`} />
      </div>
      <div className='node-name'>Node {node.id}</div>
      <div className='node-status'>
        {state === 'leader' ? 'LEADER' : state.toUpperCase()}
      </div>
      <div className='node-action'>
        {node.status === 'failed' ? 'Click to recover' : 'Click to crash'}
      </div>
    </button>
  );
}
