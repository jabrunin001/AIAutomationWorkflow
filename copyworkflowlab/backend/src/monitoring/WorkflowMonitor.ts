import { EventEmitter } from 'events';
import { WorkflowExecution } from '../../../shared/types';
import { WorkflowRunner } from '../engine/WorkflowRunner';
import { MetricsCollector } from './MetricsCollector';
import { AlertManager } from './AlertManager';

export class WorkflowMonitor {
  private static instance: WorkflowMonitor;
  private workflowRunner: WorkflowRunner;
  private metricsCollector: MetricsCollector;
  private alertManager: AlertManager;
  private executionLogs: Record<string, ExecutionLogEntry[]> = {};

  private constructor() {
    this.workflowRunner = WorkflowRunner.getInstance();
    this.metricsCollector = new MetricsCollector();
    this.alertManager = new AlertManager();
    
    // Register event listeners
    this.registerEventListeners();
  }

  public static getInstance(): WorkflowMonitor {
    if (!WorkflowMonitor.instance) {
      WorkflowMonitor.instance = new WorkflowMonitor();
    }
    return WorkflowMonitor.instance;
  }

  private registerEventListeners(): void {
    const runner = this.workflowRunner;
    
    // Listen for execution events
    runner.on('executionStarted', this.handleExecutionStarted.bind(this));
    runner.on('executionCompleted', this.handleExecutionCompleted.bind(this));
    runner.on('executionFailed', this.handleExecutionFailed.bind(this));
    runner.on('executionCancelled', this.handleExecutionCancelled.bind(this));
    
    // Listen for node execution events
    runner.on('nodeExecutionStarted', this.handleNodeExecutionStarted.bind(this));
    runner.on('nodeExecutionCompleted', this.handleNodeExecutionCompleted.bind(this));
    runner.on('nodeExecutionFailed', this.handleNodeExecutionFailed.bind(this));
  }

  private handleExecutionStarted(execution: WorkflowExecution): void {
    this.logExecution(execution.id, {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `Workflow execution started: ${execution.workflowId}`,
      executionId: execution.id,
      workflowId: execution.workflowId
    });
    
    this.metricsCollector.recordExecutionStarted(execution);
  }

  private handleExecutionCompleted(execution: WorkflowExecution): void {
    this.logExecution(execution.id, {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `Workflow execution completed: ${execution.workflowId}`,
      executionId: execution.id,
      workflowId: execution.workflowId,
      duration: this.calculateDuration(execution.startedAt, execution.completedAt || new Date().toISOString())
    });
    
    this.metricsCollector.recordExecutionCompleted(execution);
  }

  private handleExecutionFailed(execution: WorkflowExecution, error: string): void {
    this.logExecution(execution.id, {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: `Workflow execution failed: ${execution.workflowId} - ${error}`,
      executionId: execution.id,
      workflowId: execution.workflowId,
      error,
      duration: this.calculateDuration(execution.startedAt, execution.completedAt || new Date().toISOString())
    });
    
    this.metricsCollector.recordExecutionFailed(execution);
    this.alertManager.sendAlert({
      type: 'execution_failed',
      severity: 'error',
      message: `Workflow execution failed: ${execution.workflowId}`,
      details: {
        executionId: execution.id,
        workflowId: execution.workflowId,
        error
      }
    });
  }

  private handleExecutionCancelled(execution: WorkflowExecution): void {
    this.logExecution(execution.id, {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message: `Workflow execution cancelled: ${execution.workflowId}`,
      executionId: execution.id,
      workflowId: execution.workflowId,
      duration: this.calculateDuration(execution.startedAt, execution.completedAt || new Date().toISOString())
    });
    
    this.metricsCollector.recordExecutionCancelled(execution);
  }

  private handleNodeExecutionStarted(execution: WorkflowExecution, nodeId: string): void {
    this.logExecution(execution.id, {
      timestamp: new Date().toISOString(),
      level: 'debug',
      message: `Node execution started: ${nodeId}`,
      executionId: execution.id,
      workflowId: execution.workflowId,
      nodeId
    });
    
    this.metricsCollector.recordNodeExecutionStarted(execution, nodeId);
  }

  private handleNodeExecutionCompleted(execution: WorkflowExecution, nodeId: string, result: any): void {
    const nodeResult = execution.nodeResults[nodeId];
    
    this.logExecution(execution.id, {
      timestamp: new Date().toISOString(),
      level: 'debug',
      message: `Node execution completed: ${nodeId}`,
      executionId: execution.id,
      workflowId: execution.workflowId,
      nodeId,
      duration: this.calculateDuration(
        nodeResult.startedAt, 
        nodeResult.completedAt || new Date().toISOString()
      )
    });
    
    this.metricsCollector.recordNodeExecutionCompleted(execution, nodeId);
  }

  private handleNodeExecutionFailed(execution: WorkflowExecution, nodeId: string, error: string): void {
    const nodeResult = execution.nodeResults[nodeId];
    
    this.logExecution(execution.id, {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: `Node execution failed: ${nodeId} - ${error}`,
      executionId: execution.id,
      workflowId: execution.workflowId,
      nodeId,
      error,
      duration: this.calculateDuration(
        nodeResult.startedAt, 
        nodeResult.completedAt || new Date().toISOString()
      )
    });
    
    this.metricsCollector.recordNodeExecutionFailed(execution, nodeId);
  }

  private logExecution(executionId: string, entry: ExecutionLogEntry): void {
    if (!this.executionLogs[executionId]) {
      this.executionLogs[executionId] = [];
    }
    
    this.executionLogs[executionId].push(entry);
    
    // Log to console for development
    console.log(`[${entry.level.toUpperCase()}] ${entry.message}`);
  }

  private calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return end - start;
  }

  public getExecutionLogs(executionId: string): ExecutionLogEntry[] {
    return this.executionLogs[executionId] || [];
  }

  public clearOldLogs(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    
    for (const executionId in this.executionLogs) {
      // Filter out logs older than maxAgeMs
      this.executionLogs[executionId] = this.executionLogs[executionId].filter(entry => {
        const entryTime = new Date(entry.timestamp).getTime();
        return now - entryTime < maxAgeMs;
      });
      
      // Remove empty log arrays
      if (this.executionLogs[executionId].length === 0) {
        delete this.executionLogs[executionId];
      }
    }
  }
}

export interface ExecutionLogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  executionId: string;
  workflowId: string;
  nodeId?: string;
  error?: string;
  duration?: number;
  [key: string]: any;
} 