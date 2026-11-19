export type NodeStatus = 'active' | 'failed';
export type Algorithm = 'bully' | 'ring';
export type MessageType = 'ELECTION' | 'OK' | 'COORDINATOR' | 'TOKEN';
export interface NetworkNode {
  id: number;
  status: NodeStatus;
  isLeader: boolean;
}
export interface SimMessage {
  id: number;
  from: number;
  to: number;
  type: MessageType;
  label: string;
}
export interface ElectionStep {
  title: string;
  detail: string;
  messages: SimMessage[];
  leader?: number;
}
export interface LogEntry {
  id: number;
  time: string;
  text: string;
  tone?: 'success' | 'warning' | 'info';
}
