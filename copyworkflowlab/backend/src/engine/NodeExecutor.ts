import { Node } from '../../../shared/types';
import { Execution } from '../models/Execution';
import { NodeTypeRegistry } from '../models/Node';

export class NodeExecutor {
  private nodeTypeRegistry: NodeTypeRegistry;

  constructor() {
    this.nodeTypeRegistry = NodeTypeRegistry.getInstance();
  }

  /**
   * Execute a node in the workflow
   */
  public async executeNode(node: Node, execution: Execution): Promise<any> {
    try {
      // Get the node type definition
      const nodeType = this.nodeTypeRegistry.getNodeType(node.type);
      if (!nodeType) {
        throw new Error(`Unknown node type: ${node.type}`);
      }

      // In a real implementation, this would dispatch to the appropriate handler
      // based on the node type. For now, we'll simulate execution.
      console.log(`Executing node ${node.id} of type ${node.type}`);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return a mock result based on the node type
      switch (node.type) {
        case 'input':
          return node.data.value || {};
        
        case 'transform':
          // Simulate a transformation
          return { 
            transformed: true, 
            originalData: node.data,
            timestamp: new Date().toISOString()
          };
        
        case 'api':
          // Simulate an API call
          return {
            success: true,
            data: {
              id: Math.random().toString(36).substring(2),
              timestamp: new Date().toISOString(),
              result: `Mock API response for ${node.data.endpoint || 'unknown endpoint'}`
            }
          };
        
        case 'condition':
          // Simulate a condition evaluation
          return {
            result: Math.random() > 0.5, // Random true/false
            evaluatedAt: new Date().toISOString()
          };
        
        case 'output':
          // Just pass through the data
          return node.data;
        
        default:
          // Generic processing for unknown types
          return {
            processed: true,
            nodeType: node.type,
            timestamp: new Date().toISOString()
          };
      }
    } catch (error) {
      console.error(`Error executing node ${node.id}:`, error);
      throw error;
    }
  }
} 