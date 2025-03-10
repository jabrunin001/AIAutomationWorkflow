import { Workflow } from '../models/Workflow';
import { Execution } from '../models/Execution';
import { NodeExecutor } from './NodeExecutor';
import { QueueManager } from './QueueManager';
import { getExecutionOrder } from '../../../shared/utils';
import { EventEmitter } from 'events';

export class WorkflowRunner extends EventEmitter {
  private static instance: WorkflowRunner;
  private queueManager: QueueManager;
  private nodeExecutor: NodeExecutor;
  private activeExecutions: Map<string, Execution> = new Map();

  private constructor() {
    super();
    this.queueManager = QueueManager.getInstance();
    this.nodeExecutor = new NodeExecutor();
    
    // Listen for queue events
    this.queueManager.on('workflowQueued', this.handleWorkflowQueued.bind(this));
  }

  public static getInstance(): WorkflowRunner {
    if (!WorkflowRunner.instance) {
      WorkflowRunner.instance = new WorkflowRunner();
    }
    return WorkflowRunner.instance;
  }

  public async queueWorkflow(workflow: Workflow): Promise<Execution> {
    const execution = new Execution({ workflowId: workflow.id });
    await this.queueManager.enqueueWorkflow(workflow.id, execution.id);
    return execution;
  }

  public async cancelExecution(executionId: string): Promise<boolean> {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) {
      return false;
    }

    execution.cancel();
    this.activeExecutions.delete(executionId);
    this.emit('executionCancelled', execution);
    return true;
  }

  private async handleWorkflowQueued(workflowId: string, executionId: string): Promise<void> {
    try {
      // Fetch workflow and execution from storage (in a real system)
      // For now, we'll create a mock execution
      const execution = new Execution({ 
        id: executionId,
        workflowId: workflowId,
        status: 'pending'
      });
      
      // Start execution
      await this.runWorkflow(workflowId, execution);
    } catch (error) {
      console.error(`Error executing workflow ${workflowId}:`, error);
      // Handle error, update execution status, etc.
    }
  }

  private async runWorkflow(workflowId: string, execution: Execution): Promise<void> {
    try {
      // In a real system, fetch the workflow from storage
      // For now, we'll assume we have the workflow
      const workflow = new Workflow({ id: workflowId });
      
      execution.start();
      this.activeExecutions.set(execution.id, execution);
      this.emit('executionStarted', execution);

      // Get execution order
      const nodeOrder = getExecutionOrder({ 
        ...workflow.toJSON(),
        // Add any missing properties for the function
        nodes: workflow.nodes || [],
        connections: workflow.connections || []
      });

      // Execute nodes in order
      for (const nodeId of nodeOrder) {
        if (execution.status === 'cancelled') {
          break;
        }

        const node = workflow.nodes.find(n => n.id === nodeId);
        if (!node) continue;

        execution.startNodeExecution(nodeId);
        this.emit('nodeExecutionStarted', execution, nodeId);

        try {
          const result = await this.nodeExecutor.executeNode(node, execution);
          execution.completeNodeExecution(nodeId, result);
          this.emit('nodeExecutionCompleted', execution, nodeId, result);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          execution.failNodeExecution(nodeId, errorMessage);
          this.emit('nodeExecutionFailed', execution, nodeId, errorMessage);
          
          // Fail the entire workflow if a node fails
          execution.fail(errorMessage);
          this.emit('executionFailed', execution, errorMessage);
          break;
        }
      }

      // If we got here without failing, mark as complete
      if (execution.status === 'running') {
        execution.complete();
        this.emit('executionCompleted', execution);
      }

      this.activeExecutions.delete(execution.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      execution.fail(errorMessage);
      this.emit('executionFailed', execution, errorMessage);
      this.activeExecutions.delete(execution.id);
    }
  }

  public getActiveExecutions(): Execution[] {
    return Array.from(this.activeExecutions.values());
  }

  public getExecution(executionId: string): Execution | undefined {
    return this.activeExecutions.get(executionId);
  }
} 