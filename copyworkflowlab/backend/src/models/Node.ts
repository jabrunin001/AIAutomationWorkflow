import { Node as NodeType, NodeType as NodeTypeDefinition } from '../../../shared/types';
import { generateId } from '../../../shared/utils';

export class Node implements NodeType {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: Record<string, any>;

  constructor(data: Partial<NodeType>) {
    this.id = data.id || generateId();
    this.type = data.type || 'default';
    this.position = data.position || { x: 0, y: 0 };
    this.data = data.data || {};
  }

  toJSON(): NodeType {
    return {
      id: this.id,
      type: this.type,
      position: this.position,
      data: this.data
    };
  }
}

// Registry of available node types
export class NodeTypeRegistry {
  private static instance: NodeTypeRegistry;
  private nodeTypes: Map<string, NodeTypeDefinition> = new Map();

  private constructor() {}

  public static getInstance(): NodeTypeRegistry {
    if (!NodeTypeRegistry.instance) {
      NodeTypeRegistry.instance = new NodeTypeRegistry();
    }
    return NodeTypeRegistry.instance;
  }

  public registerNodeType(nodeType: NodeTypeDefinition): void {
    this.nodeTypes.set(nodeType.type, nodeType);
  }

  public getNodeType(type: string): NodeTypeDefinition | undefined {
    return this.nodeTypes.get(type);
  }

  public getAllNodeTypes(): NodeTypeDefinition[] {
    return Array.from(this.nodeTypes.values());
  }

  public getNodeTypesByCategory(): Record<string, NodeTypeDefinition[]> {
    const result: Record<string, NodeTypeDefinition[]> = {};
    
    for (const nodeType of this.nodeTypes.values()) {
      if (!result[nodeType.category]) {
        result[nodeType.category] = [];
      }
      result[nodeType.category].push(nodeType);
    }
    
    return result;
  }
} 