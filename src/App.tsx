import { useElection } from './hooks/useElection';
import { NetworkView } from './components/NetworkView';
import { EventLog } from './components/EventLog';
export default function App() {
  const sim = useElection();
  const active = sim.nodes.filter((n) => n.status === 'active').length;
  return (
    <main className='app-shell'>
      <header className='topbar'>
        <a className='brand'>
          <span className='brand-icon'>⌘</span>
          <span>
            LE<span className='brand-accent'>LAB</span>
          </span>
        </a>
        <div className='topbar-right'>
          <span className='status-chip'>
            <i /> Simulation environment
          </span>
          <span className='avatar'>TS</span>
        </div>
      </header>
      <section className='hero'>
        <div className='eyebrow'>
          <span /> DISTRIBUTED SYSTEMS · INTERACTIVE LAB
        </div>
        <h1>
          Leader Election <span>Simulator</span>
        </h1>
        <p>
          Explore how distributed nodes coordinate, detect failures, and elect a
          new leader.
        </p>
      </section>
      <section className='metrics'>
        <div className='metric panel'>
          <span className='metric-label'>ACTIVE NODES</span>
          <strong>
            {active}
            <small>/ 5</small>
          </strong>
          <span className='metric-foot'>Nodes currently online</span>
        </div>
        <div className='metric panel'>
          <span className='metric-label'>CURRENT LEADER</span>
          <strong className='leader-value'>
            {sim.leader ? `Node ${sim.leader}` : '—'}
          </strong>
          <span className='metric-foot'>
            {sim.leader ? 'Coordinator elected' : 'No coordinator'}
          </span>
        </div>
        <div className='metric panel'>
          <span className='metric-label'>MESSAGES SENT</span>
          <strong>{sim.totalMessages}</strong>
          <span className='metric-foot'>Across election attempts</span>
        </div>
        <div className='metric panel'>
          <span className='metric-label'>ALGORITHM</span>
          <strong className='algo-value'>
            {sim.algorithm === 'bully' ? 'Bully' : 'Ring'}
          </strong>
          <span className='metric-foot'>Election strategy</span>
        </div>
      </section>
      <section className='control-row panel'>
        <div className='algorithm-control'>
          <span className='metric-label'>ELECTION ALGORITHM</span>
          <div className='segmented'>
            <button
              className={sim.algorithm === 'bully' ? 'selected' : ''}
              onClick={() => sim.setAlgorithm('bully')}
              disabled={sim.running}
            >
              Bully
            </button>
            <button
              className={sim.algorithm === 'ring' ? 'selected' : ''}
              onClick={() => sim.setAlgorithm('ring')}
              disabled={sim.running}
            >
              Ring
            </button>
          </div>
        </div>
        <div className='control-actions'>
          <button
            className='btn secondary'
            onClick={sim.stepOnce}
            disabled={sim.running}
          >
            <span>◧</span> Step
          </button>
          <button
            className='btn primary'
            onClick={sim.running ? sim.stop : sim.start}
          >
            <span>{sim.running ? 'Ⅱ' : '▶'}</span>{' '}
            {sim.running ? 'Stop' : 'Start election'}
          </button>
          <button className='btn reset' onClick={sim.reset}>
            <span>↻</span> Reset
          </button>
        </div>
      </section>
      <div className='content-grid'>
        <NetworkView
          nodes={sim.nodes}
          messages={sim.messages}
          onToggle={sim.toggleNode}
        />
        <EventLog logs={sim.logs} />
      </div>
      <footer>
        <span>
          LE LAB <span className='footer-dot'>•</span> Leader Election
          visualizer
        </span>
        <span>Built for learning distributed systems</span>
      </footer>
    </main>
  );
}
