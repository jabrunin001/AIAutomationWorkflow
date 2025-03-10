import express from 'express';
import { WorkflowRunner } from '../engine/WorkflowRunner';
import { Workflow } from '../models/Workflow';
import { Execution } from '../models/Execution';

// In-memory storage for executions (in a real app, this would be a database)
const executionsStore: Record<string, Execution> = {};

// In-memory storage for workflows (in a real app, this would be a database)
// This is a duplicate of what's in workflows.ts, but in a real app this would be a shared database
const workflowsStore: Record<string, Workflow> = {};

const router = express.Router();
const workflowRunner = WorkflowRunner.getInstance();

// Get all executions
router.get('/', (req, res) => {
  const executions = Object.values(executionsStore).map(execution => execution.toJSON());
  res.json({ executions });
});

// Get a specific execution
router.get('/:id', (req, res) => {
  const execution = executionsStore[req.params.id];
  if (!execution) {
    return res.status(404).json({ error: 'Execution not found' });
  }
  res.json({ execution: execution.toJSON() });
});

// Get executions for a specific workflow
router.get('/workflow/:workflowId', (req, res) => {
  const workflowId = req.params.workflowId;
  const executions = Object.values(executionsStore)
    .filter(execution => execution.workflowId === workflowId)
    .map(execution => execution.toJSON());
  
  res.json({ executions });
});

// Execute a workflow
router.post('/workflow/:workflowId', async (req, res) => {
  const workflowId = req.params.workflowId;
  const workflow = workflowsStore[workflowId];
  
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  
  try {
    const execution = await workflowRunner.queueWorkflow(workflow);
    executionsStore[execution.id] = execution;
    
    res.status(202).json({ 
      execution: execution.toJSON(),
      message: 'Workflow execution queued'
    });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to queue workflow execution'
    });
  }
});

// Cancel an execution
router.post('/:id/cancel', async (req, res) => {
  const executionId = req.params.id;
  const execution = executionsStore[executionId];
  
  if (!execution) {
    return res.status(404).json({ error: 'Execution not found' });
  }
  
  if (execution.isCompleted()) {
    return res.status(400).json({ 
      error: 'Cannot cancel a completed execution',
      status: execution.status
    });
  }
  
  try {
    const cancelled = await workflowRunner.cancelExecution(executionId);
    
    if (cancelled) {
      res.json({ 
        message: 'Execution cancelled successfully',
        execution: execution.toJSON()
      });
    } else {
      res.status(400).json({ 
        error: 'Failed to cancel execution',
        execution: execution.toJSON()
      });
    }
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error cancelling execution'
    });
  }
});

// Get the status of a specific node execution
router.get('/:id/nodes/:nodeId', (req, res) => {
  const execution = executionsStore[req.params.id];
  if (!execution) {
    return res.status(404).json({ error: 'Execution not found' });
  }
  
  const nodeResult = execution.nodeResults[req.params.nodeId];
  if (!nodeResult) {
    return res.status(404).json({ error: 'Node execution not found' });
  }
  
  res.json({ nodeResult });
});

export default router; 