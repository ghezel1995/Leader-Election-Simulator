import type { ElectionStep, NetworkNode, SimMessage } from '../types/network';

const msg = (
  id: number,
  from: number,
  to: number,
  type: SimMessage['type'],
  label: string,
): SimMessage => ({ id, from, to, type, label });

export function buildBullyElection(
  nodes: NetworkNode[],
  nextId: () => number,
): ElectionStep[] {
  const alive = nodes
    .filter((n) => n.status === 'active')
    .map((n) => n.id)
    .sort((a, b) => a - b);
  if (!alive.length)
    return [
      {
        title: 'No active nodes',
        detail: 'All nodes are offline. Restore a node to run an election.',
        messages: [],
      },
    ];
  const initiator = alive[0];
  const higher = alive.filter((id) => id > initiator);
  const steps: ElectionStep[] = [
    {
      title: `Node ${initiator} starts an election`,
      detail: higher.length
        ? `Node ${initiator} sends ELECTION messages to every active node with a higher ID.`
        : `Node ${initiator} has the highest active ID, so it can become leader.`,
      messages: higher.map((id) =>
        msg(nextId(), initiator, id, 'ELECTION', 'ELECTION'),
      ),
    },
  ];
  if (higher.length) {
    steps.push({
      title: 'Higher-ID nodes respond',
      detail: `Active nodes with higher IDs respond OK. The highest active node continues the election.`,
      messages: higher.map((id) => msg(nextId(), id, initiator, 'OK', 'OK')),
    });
    const winner = alive[alive.length - 1];
    if (winner !== initiator)
      steps.push({
        title: `Node ${winner} takes over`,
        detail: `No active node has a higher ID than Node ${winner}. It announces itself as coordinator.`,
        messages: alive
          .filter((id) => id !== winner)
          .map((id) => msg(nextId(), winner, id, 'COORDINATOR', 'COORDINATOR')),
        leader: winner,
      });
    else
      steps.push({
        title: `Node ${winner} takes over`,
        detail:
          'This node has the highest active ID and announces itself as coordinator.',
        messages: [],
        leader: winner,
      });
  } else {
    steps.push({
      title: `Node ${initiator} is elected`,
      detail:
        'No higher-ID active nodes responded. The initiator announces itself as coordinator.',
      messages: alive
        .filter((id) => id !== initiator)
        .map((id) =>
          msg(nextId(), initiator, id, 'COORDINATOR', 'COORDINATOR'),
        ),
      leader: initiator,
    });
  }
  return steps;
}

export function buildRingElection(
  nodes: NetworkNode[],
  nextId: () => number,
): ElectionStep[] {
  const alive = nodes
    .filter((n) => n.status === 'active')
    .map((n) => n.id)
    .sort((a, b) => a - b);
  if (!alive.length)
    return [
      {
        title: 'No active nodes',
        detail: 'All nodes are offline. Restore a node to run an election.',
        messages: [],
      },
    ];
  const initiator = alive[0];
  const winner = alive[alive.length - 1];
  const steps: ElectionStep[] = [];
  let candidate = initiator;
  for (let i = 0; i < alive.length; i++) {
    const from = alive[i];
    const to = alive[(i + 1) % alive.length];
    candidate = Math.max(candidate, alive[(i + 1) % alive.length]);
    steps.push({
      title: `Election token: Node ${from} → Node ${to}`,
      detail: `The election message circulates through active nodes. Highest ID observed so far: ${candidate}.`,
      messages: [msg(nextId(), from, to, 'TOKEN', `ID ${candidate}`)],
    });
  }
  steps.push({
    title: `Node ${winner} wins the ring election`,
    detail: `After one circulation, the highest active ID (${winner}) is selected and a coordinator announcement travels around the ring.`,
    messages: alive.map((id, i) =>
      msg(
        nextId(),
        winner,
        alive[(i + 1) % alive.length],
        'COORDINATOR',
        'COORDINATOR',
      ),
    ),
    leader: winner,
  });
  return steps;
}
