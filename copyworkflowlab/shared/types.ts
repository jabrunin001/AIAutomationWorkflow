export interface Node {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: Record<string, any>;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  connections: Connection[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  nodeResults: Record<string, NodeExecutionResult>;
}

export interface NodeExecutionResult {
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  output?: any;
  error?: string;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NodeType {
  type: string;
  category: string;
  label: string;
  description: string;
  inputs: NodePort[];
  outputs: NodePort[];
  configSchema: Record<string, any>;
}

export interface NodePort {
  id: string;
  label: string;
  type: string;
} 