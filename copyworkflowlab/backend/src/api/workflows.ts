import express from 'express';
import { Workflow } from '../models/Workflow';
import { validateWorkflow } from '../../../shared/utils';

// In-memory storage for workflows (in a real app, this would be a database)
const workflowsStore: Record<string, Workflow> = {};

const router = express.Router();

// Get all workflows
router.get('/', (req, res) => {
  const workflows = Object.values(workflowsStore).map(workflow => workflow.toJSON());
  res.json({ workflows });
});

// Get a specific workflow
router.get('/:id', (req, res) => {
  const workflow = workflowsStore[req.params.id];
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  res.json({ workflow: workflow.toJSON() });
});

// Create a new workflow
router.post('/', (req, res) => {
  try {
    const workflowData = req.body;
    const workflow = new Workflow(workflowData);
    
    // Validate the workflow
    const validation = validateWorkflow(workflow.toJSON());
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    workflowsStore[workflow.id] = workflow;
    res.status(201).json({ workflow: workflow.toJSON() });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid workflow data' });
  }
});

// Update a workflow
router.put('/:id', (req, res) => {
  const workflow = workflowsStore[req.params.id];
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  
  try {
    const updatedData = req.body;
    
    // Update workflow properties
    if (updatedData.name) workflow.name = updatedData.name;
    if (updatedData.description) workflow.description = updatedData.description;
    if (updatedData.nodes) workflow.nodes = updatedData.nodes;
    if (updatedData.connections) workflow.connections = updatedData.connections;
    
    workflow.updatedAt = new Date().toISOString();
    
    // Validate the updated workflow
    const validation = validateWorkflow(workflow.toJSON());
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    res.json({ workflow: workflow.toJSON() });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid workflow data' });
  }
});

// Delete a workflow
router.delete('/:id', (req, res) => {
  const workflow = workflowsStore[req.params.id];
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  
  delete workflowsStore[req.params.id];
  res.status(204).send();
});

// Add a node to a workflow
router.post('/:id/nodes', (req, res) => {
  const workflow = workflowsStore[req.params.id];
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  
  try {
    const nodeData = req.body;
    const node = workflow.addNode(nodeData);
    res.status(201).json({ node });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid node data' });
  }
});

// Update a node in a workflow
router.put('/:id/nodes/:nodeId', (req, res) => {
  const workflow = workflowsStore[req.params.id];
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  
  try {
    const nodeData = req.body;
    const updatedNode = workflow.updateNode(req.params.nodeId, nodeData);
    
    if (!updatedNode) {
      return res.status(404).json({ error: 'Node not found' });
    }
    
    res.json({ node: updatedNode });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid node data' });
  }
});

// Delete a node from a workflow
router.delete('/:id/nodes/:nodeId', (req, res) => {
  const workflow = workflowsStore[req.params.id];
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  
  const removed = workflow.removeNode(req.params.nodeId);
  if (!removed) {
    return res.status(404).json({ error: 'Node not found' });
  }
  
  res.status(204).send();
});

// Add a connection to a workflow
router.post('/:id/connections', (req, res) => {
  const workflow = workflowsStore[req.params.id];
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  
  try {
    const connectionData = req.body;
    const connection = workflow.addConnection(connectionData);
    res.status(201).json({ connection });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid connection data' });
  }
});

// Delete a connection from a workflow
router.delete('/:id/connections/:connectionId', (req, res) => {
  const workflow = workflowsStore[req.params.id];
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  
  const removed = workflow.removeConnection(req.params.connectionId);
  if (!removed) {
    return res.status(404).json({ error: 'Connection not found' });
  }
  
  res.status(204).send();
});

export default router; 