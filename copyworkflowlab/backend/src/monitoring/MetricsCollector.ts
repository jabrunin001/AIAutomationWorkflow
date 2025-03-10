import { WorkflowExecution } from '../../../shared/types';

interface ExecutionMetrics {
  totalExecutions: number;
  completedExecutions: number;
  failedExecutions: number;
  cancelledExecutions: number;
  averageExecutionTime: number;
  totalExecutionTime: number;
  executionTimeHistory: number[];
}

interface NodeMetrics {
  totalExecutions: number;
  completedExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  totalExecutionTime: number;
  executionTimeHistory: number[];
}

export class MetricsCollector {
  private workflowMetrics: Record<string, ExecutionMetrics> = {};
  private nodeMetrics: Record<string, Record<string, NodeMetrics>> = {};
  private globalMetrics: ExecutionMetrics = {
    totalExecutions: 0,
    completedExecutions: 0,
    failedExecutions: 0,
    cancelledExecutions: 0,
    averageExecutionTime: 0,
    totalExecutionTime: 0,
    executionTimeHistory: []
  };

  constructor() {
    // Initialize metrics collection
    // In a real app, we might load historical metrics from storage
  }

  public recordExecutionStarted(execution: WorkflowExecution): void {
    const workflowId = execution.workflowId;
    
    // Initialize workflow metrics if not exists
    if (!this.workflowMetrics[workflowId]) {
      this.workflowMetrics[workflowId] = {
        totalExecutions: 0,
        completedExecutions: 0,
        failedExecutions: 0,
        cancelledExecutions: 0,
        averageExecutionTime: 0,
        totalExecutionTime: 0,
        executionTimeHistory: []
      };
    }
    
    // Increment total executions
    this.workflowMetrics[workflowId].totalExecutions++;
    this.globalMetrics.totalExecutions++;
  }

  public recordExecutionCompleted(execution: WorkflowExecution): void {
    const workflowId = execution.workflowId;
    const executionTime = this.calculateExecutionTime(execution);
    
    // Update workflow metrics
    const metrics = this.workflowMetrics[workflowId];
    if (metrics) {
      metrics.completedExecutions++;
      metrics.totalExecutionTime += executionTime;
      metrics.executionTimeHistory.push(executionTime);
      metrics.averageExecutionTime = metrics.totalExecutionTime / metrics.completedExecutions;
    }
    
    // Update global metrics
    this.globalMetrics.completedExecutions++;
    this.globalMetrics.totalExecutionTime += executionTime;
    this.globalMetrics.executionTimeHistory.push(executionTime);
    this.globalMetrics.averageExecutionTime = 
      this.globalMetrics.totalExecutionTime / this.globalMetrics.completedExecutions;
  }

  public recordExecutionFailed(execution: WorkflowExecution): void {
    const workflowId = execution.workflowId;
    const executionTime = this.calculateExecutionTime(execution);
    
    // Update workflow metrics
    const metrics = this.workflowMetrics[workflowId];
    if (metrics) {
      metrics.failedExecutions++;
      metrics.totalExecutionTime += executionTime;
      metrics.executionTimeHistory.push(executionTime);
      // We don't update average execution time for failed executions
    }
    
    // Update global metrics
    this.globalMetrics.failedExecutions++;
    this.globalMetrics.totalExecutionTime += executionTime;
    this.globalMetrics.executionTimeHistory.push(executionTime);
    // We don't update average execution time for failed executions
  }

  public recordExecutionCancelled(execution: WorkflowExecution): void {
    const workflowId = execution.workflowId;
    const executionTime = this.calculateExecutionTime(execution);
    
    // Update workflow metrics
    const metrics = this.workflowMetrics[workflowId];
    if (metrics) {
      metrics.cancelledExecutions++;
      // We don't update execution time metrics for cancelled executions
    }
    
    // Update global metrics
    this.globalMetrics.cancelledExecutions++;
    // We don't update execution time metrics for cancelled executions
  }

  public recordNodeExecutionStarted(execution: WorkflowExecution, nodeId: string): void {
    const workflowId = execution.workflowId;
    
    // Initialize node metrics if not exists
    if (!this.nodeMetrics[workflowId]) {
      this.nodeMetrics[workflowId] = {};
    }
    
    if (!this.nodeMetrics[workflowId][nodeId]) {
      this.nodeMetrics[workflowId][nodeId] = {
        totalExecutions: 0,
        completedExecutions: 0,
        failedExecutions: 0,
        averageExecutionTime: 0,
        totalExecutionTime: 0,
        executionTimeHistory: []
      };
    }
    
    // Increment total executions
    this.nodeMetrics[workflowId][nodeId].totalExecutions++;
  }

  public recordNodeExecutionCompleted(execution: WorkflowExecution, nodeId: string): void {
    const workflowId = execution.workflowId;
    const nodeResult = execution.nodeResults[nodeId];
    
    if (!nodeResult || !nodeResult.completedAt) return;
    
    const executionTime = this.calculateNodeExecutionTime(nodeResult);
    
    // Update node metrics
    const metrics = this.nodeMetrics[workflowId]?.[nodeId];
    if (metrics) {
      metrics.completedExecutions++;
      metrics.totalExecutionTime += executionTime;
      metrics.executionTimeHistory.push(executionTime);
      metrics.averageExecutionTime = metrics.totalExecutionTime / metrics.completedExecutions;
    }
  }

  public recordNodeExecutionFailed(execution: WorkflowExecution, nodeId: string): void {
    const workflowId = execution.workflowId;
    const nodeResult = execution.nodeResults[nodeId];
    
    if (!nodeResult || !nodeResult.completedAt) return;
    
    const executionTime = this.calculateNodeExecutionTime(nodeResult);
    
    // Update node metrics
    const metrics = this.nodeMetrics[workflowId]?.[nodeId];
    if (metrics) {
      metrics.failedExecutions++;
      metrics.totalExecutionTime += executionTime;
      metrics.executionTimeHistory.push(executionTime);
      // We don't update average execution time for failed executions
    }
  }

  private calculateExecutionTime(execution: WorkflowExecution): number {
    const startTime = new Date(execution.startedAt).getTime();
    const endTime = execution.completedAt 
      ? new Date(execution.completedAt).getTime() 
      : new Date().getTime();
    
    return endTime - startTime;
  }

  private calculateNodeExecutionTime(nodeResult: any): number {
    const startTime = new Date(nodeResult.startedAt).getTime();
    const endTime = nodeResult.completedAt 
      ? new Date(nodeResult.completedAt).getTime() 
      : new Date().getTime();
    
    return endTime - startTime;
  }

  public getWorkflowMetrics(workflowId: string): ExecutionMetrics | null {
    return this.workflowMetrics[workflowId] || null;
  }

  public getNodeMetrics(workflowId: string, nodeId: string): NodeMetrics | null {
    return this.nodeMetrics[workflowId]?.[nodeId] || null;
  }

  public getGlobalMetrics(): ExecutionMetrics {
    return { ...this.globalMetrics };
  }

  public getWorkflowsMetrics(): Record<string, ExecutionMetrics> {
    return { ...this.workflowMetrics };
  }

  public getNodesMetrics(): Record<string, Record<string, NodeMetrics>> {
    return { ...this.nodeMetrics };
  }
} 