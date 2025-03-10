import { EventEmitter } from 'events';

interface QueueItem {
  workflowId: string;
  executionId: string;
  queuedAt: string;
}

export class QueueManager extends EventEmitter {
  private static instance: QueueManager;
  private queue: QueueItem[] = [];
  private processing: boolean = false;
  private concurrencyLimit: number = 5; // Maximum number of workflows to process concurrently
  private activeCount: number = 0;

  private constructor() {
    super();
    // Start the queue processor
    setInterval(() => this.processQueue(), 1000);
  }

  public static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  /**
   * Add a workflow to the execution queue
   */
  public async enqueueWorkflow(workflowId: string, executionId: string): Promise<void> {
    this.queue.push({
      workflowId,
      executionId,
      queuedAt: new Date().toISOString()
    });
    
    console.log(`Workflow ${workflowId} (execution ${executionId}) added to queue`);
    this.emit('workflowEnqueued', workflowId, executionId);
  }

  /**
   * Process the next items in the queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0 || this.activeCount >= this.concurrencyLimit) {
      return;
    }

    this.processing = true;

    try {
      // Process as many items as we can up to the concurrency limit
      while (this.queue.length > 0 && this.activeCount < this.concurrencyLimit) {
        const item = this.queue.shift();
        if (!item) continue;

        this.activeCount++;
        
        // Emit event to notify that a workflow is ready to be executed
        this.emit('workflowQueued', item.workflowId, item.executionId);
        
        // In a real implementation, we would track the execution and decrement
        // activeCount when it completes. For simplicity, we'll just simulate
        // that the execution takes some time and then completes.
        setTimeout(() => {
          this.activeCount--;
          this.emit('workflowCompleted', item.workflowId, item.executionId);
        }, 5000); // Simulate a 5-second execution
      }
    } catch (error) {
      console.error('Error processing queue:', error);
    } finally {
      this.processing = false;
    }
  }

  /**
   * Get the current queue status
   */
  public getQueueStatus(): { 
    queueLength: number; 
    activeCount: number;
    concurrencyLimit: number;
  } {
    return {
      queueLength: this.queue.length,
      activeCount: this.activeCount,
      concurrencyLimit: this.concurrencyLimit
    };
  }

  /**
   * Update the concurrency limit
   */
  public setConcurrencyLimit(limit: number): void {
    if (limit < 1) {
      throw new Error('Concurrency limit must be at least 1');
    }
    this.concurrencyLimit = limit;
  }
} 