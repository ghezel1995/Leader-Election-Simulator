import { useCallback, useEffect, useRef, useState } from 'react';
import { buildBullyElection, buildRingElection } from '../algorithms/elections';
import type {
  Algorithm,
  ElectionStep,
  LogEntry,
  NetworkNode,
  SimMessage,
} from '../types/network';

const initialNodes = (): NetworkNode[] =>
  Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    status: 'active',
    isLeader: i === 4,
  }));

export function useElection() {
  const [nodes, setNodes] = useState<NetworkNode[]>(initialNodes);
  const [algorithm, setAlgorithm] = useState<Algorithm>('bully');
  const [steps, setSteps] = useState<ElectionStep[]>([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [messages, setMessages] = useState<SimMessage[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const messageId = useRef(1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const leader = nodes.find((n) => n.isLeader)?.id ?? null;
  const addLog = useCallback(
    (text: string, tone: LogEntry['tone'] = 'info') =>
      setLogs((prev) =>
        [
          {
            id: Date.now() + Math.random(),
            time: new Date().toLocaleTimeString(),
            text,
            tone,
          },
          ...prev,
        ].slice(0, 80),
      ),
    [],
  );
  const stop = useCallback(() => {
    setRunning(false);
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);
  const reset = useCallback(() => {
    stop();
    setNodes(initialNodes());
    setSteps([]);
    setStepIndex(-1);
    setLogs([]);
    setMessages([]);
    setTotalMessages(0);
    messageId.current = 1;
  }, [stop]);
  const toggleNode = useCallback(
    (id: number) => {
      stop();
      setSteps([]);
      setStepIndex(-1);
      setMessages([]);
      setNodes((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                status: n.status === 'active' ? 'failed' : 'active',
                isLeader: false,
              }
            : n,
        ),
      );
      addLog(
        `Node ${id} ${nodes.find((n) => n.id === id)?.status === 'active' ? 'failed' : 'recovered'}.`,
        'warning',
      );
    },
    [stop, addLog, nodes],
  );
  const prepare = useCallback(() => {
    stop();
    setMessages([]);
    const idGen = () => messageId.current++;
    const next =
      algorithm === 'bully'
        ? buildBullyElection(nodes, idGen)
        : buildRingElection(nodes, idGen);
    setSteps(next);
    setStepIndex(-1);
    setNodes((prev) => prev.map((n) => ({ ...n, isLeader: false })));
    setTotalMessages(
      (prev) => prev + next.reduce((sum, s) => sum + s.messages.length, 0),
    );
    addLog(
      `${algorithm === 'bully' ? 'Bully' : 'Ring'} election started.`,
      'info',
    );
    return next;
  }, [algorithm, nodes, stop, addLog]);
  const advance = useCallback(
    (sequence = steps) => {
      const nextIndex = stepIndex + 1;
      if (nextIndex >= sequence.length) {
        stop();
        addLog('Election sequence finished.', 'success');
        return;
      }
      const step = sequence[nextIndex];
      setStepIndex(nextIndex);
      setMessages(step.messages);
      addLog(
        `${step.title} — ${step.detail}`,
        step.leader ? 'success' : 'info',
      );
      if (step.leader)
        setNodes((prev) =>
          prev.map((n) => ({ ...n, isLeader: n.id === step.leader })),
        );
      if (nextIndex === sequence.length - 1) stop();
    },
    [steps, stepIndex, stop, addLog],
  );
  const start = useCallback(() => {
    const sequence = prepare();
    setRunning(true);
    let idx = -1;
    timer.current = setInterval(() => {
      idx++;
      if (idx >= sequence.length) {
        stop();
        addLog('Election sequence finished.', 'success');
        return;
      }
      const step = sequence[idx];
      setStepIndex(idx);
      setMessages(step.messages);
      addLog(
        `${step.title} — ${step.detail}`,
        step.leader ? 'success' : 'info',
      );
      if (step.leader)
        setNodes((prev) =>
          prev.map((n) => ({ ...n, isLeader: n.id === step.leader })),
        );
      if (idx === sequence.length - 1) stop();
    }, 1300);
  }, [prepare, stop, addLog]);
  const stepOnce = useCallback(() => {
    if (!steps.length) {
      const sequence = prepare();
      advance(sequence);
    } else advance();
  }, [steps, prepare, advance]);
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );
  return {
    nodes,
    algorithm,
    setAlgorithm,
    steps,
    stepIndex,
    logs,
    running,
    messages,
    totalMessages,
    leader,
    start,
    stop,
    reset,
    toggleNode,
    stepOnce,
  };
}
