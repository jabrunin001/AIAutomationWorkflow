import { WorkflowExecution, NodeExecutionResult } from '../../../shared/types';
import { generateId } from '../../../shared/utils';

export class Execution implements WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  nodeResults: Record<string, NodeExecutionResult>;

  constructor(data: Partial<WorkflowExecution> & { workflowId: string }) {
    this.id = data.id || generateId();
    this.workflowId = data.workflowId;
    this.status = data.status || 'pending';
    this.startedAt = data.startedAt || new Date().toISOString();
    this.completedAt = data.completedAt;
    this.nodeResults = data.nodeResults || {};
  }

  start(): void {
    this.status = 'running';
    this.startedAt = new Date().toISOString();
  }

  complete(): void {
    this.status = 'completed';
    this.completedAt = new Date().toISOString();
  }

  fail(error?: string): void {
    this.status = 'failed';
    this.completedAt = new Date().toISOString();
  }

  cancel(): void {
    this.status = 'cancelled';
    this.completedAt = new Date().toISOString();
  }

  updateNodeResult(nodeId: string, result: Partial<NodeExecutionResult>): void {
    this.nodeResults[nodeId] = {
      ...this.nodeResults[nodeId],
      ...result
    };
  }

  startNodeExecution(nodeId: string): void {
    this.nodeResults[nodeId] = {
      status: 'running',
      startedAt: new Date().toISOString()
    };
  }

  completeNodeExecution(nodeId: string, output: any): void {
    this.nodeResults[nodeId] = {
      ...this.nodeResults[nodeId],
      status: 'completed',
      completedAt: new Date().toISOString(),
      output
    };
  }

  failNodeExecution(nodeId: string, error: string): void {
    this.nodeResults[nodeId] = {
      ...this.nodeResults[nodeId],
      status: 'failed',
      completedAt: new Date().toISOString(),
      error
    };
  }

  isCompleted(): boolean {
    return this.status === 'completed' || this.status === 'failed' || this.status === 'cancelled';
  }

  toJSON(): WorkflowExecution {
    return {
      id: this.id,
      workflowId: this.workflowId,
      status: this.status,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      nodeResults: this.nodeResults
    };
  }
} 