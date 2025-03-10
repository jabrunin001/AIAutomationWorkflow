import { Node, Connection, Workflow } from './types';

/**
 * Generates a unique ID for nodes, connections, etc.
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Validates a workflow structure
 */
export function validateWorkflow(workflow: Workflow): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for duplicate node IDs
  const nodeIds = new Set<string>();
  for (const node of workflow.nodes) {
    if (nodeIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    }
    nodeIds.add(node.id);
  }
  
  // Check for connections to non-existent nodes
  for (const connection of workflow.connections) {
    if (!nodeIds.has(connection.source)) {
      errors.push(`Connection ${connection.id} references non-existent source node: ${connection.source}`);
    }
    if (!nodeIds.has(connection.target)) {
      errors.push(`Connection ${connection.id} references non-existent target node: ${connection.target}`);
    }
  }
  
  // Check for cycles in the workflow
  if (hasCycle(workflow)) {
    errors.push('Workflow contains cycles, which are not allowed');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Checks if a workflow has cycles
 */
function hasCycle(workflow: Workflow): boolean {
  const adjacencyList: Record<string, string[]> = {};
  
  // Build adjacency list
  for (const node of workflow.nodes) {
    adjacencyList[node.id] = [];
  }
  
  for (const connection of workflow.connections) {
    adjacencyList[connection.source].push(connection.target);
  }
  
  // DFS to detect cycles
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  function dfs(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    
    visited.add(nodeId);
    recursionStack.add(nodeId);
    
    for (const neighbor of adjacencyList[nodeId]) {
      if (dfs(neighbor)) return true;
    }
    
    recursionStack.delete(nodeId);
    return false;
  }
  
  for (const node of workflow.nodes) {
    if (dfs(node.id)) return true;
  }
  
  return false;
}

/**
 * Gets the topological order of nodes for execution
 */
export function getExecutionOrder(workflow: Workflow): string[] {
  const adjacencyList: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};
  
  // Initialize
  for (const node of workflow.nodes) {
    adjacencyList[node.id] = [];
    inDegree[node.id] = 0;
  }
  
  // Build adjacency list and calculate in-degrees
  for (const connection of workflow.connections) {
    adjacencyList[connection.source].push(connection.target);
    inDegree[connection.target] = (inDegree[connection.target] || 0) + 1;
  }
  
  // Start with nodes that have no dependencies
  const queue: string[] = [];
  for (const nodeId in inDegree) {
    if (inDegree[nodeId] === 0) {
      queue.push(nodeId);
    }
  }
  
  const result: string[] = [];
  
  // Process queue
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    result.push(nodeId);
    
    for (const neighbor of adjacencyList[nodeId]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }
  
  return result;
} 