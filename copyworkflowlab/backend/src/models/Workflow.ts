import { Workflow as WorkflowType, Node, Connection } from '../../../shared/types';
import { generateId } from '../../../shared/utils';

export class Workflow implements WorkflowType {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  connections: Connection[];
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<WorkflowType>) {
    this.id = data.id || generateId();
    this.name = data.name || 'Untitled Workflow';
    this.description = data.description || '';
    this.nodes = data.nodes || [];
    this.connections = data.connections || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  addNode(node: Omit<Node, 'id'>): Node {
    const newNode: Node = {
      id: generateId(),
      ...node
    };
    this.nodes.push(newNode);
    this.updatedAt = new Date().toISOString();
    return newNode;
  }

  updateNode(id: string, data: Partial<Node>): Node | null {
    const nodeIndex = this.nodes.findIndex(node => node.id === id);
    if (nodeIndex === -1) return null;

    const updatedNode = {
      ...this.nodes[nodeIndex],
      ...data,
      id // Ensure ID doesn't change
    };
    
    this.nodes[nodeIndex] = updatedNode;
    this.updatedAt = new Date().toISOString();
    return updatedNode;
  }

  removeNode(id: string): boolean {
    const initialLength = this.nodes.length;
    this.nodes = this.nodes.filter(node => node.id !== id);
    
    // Also remove any connections to/from this node
    this.connections = this.connections.filter(
      conn => conn.source !== id && conn.target !== id
    );
    
    this.updatedAt = new Date().toISOString();
    return this.nodes.length !== initialLength;
  }

  addConnection(connection: Omit<Connection, 'id'>): Connection {
    const newConnection: Connection = {
      id: generateId(),
      ...connection
    };
    this.connections.push(newConnection);
    this.updatedAt = new Date().toISOString();
    return newConnection;
  }

  removeConnection(id: string): boolean {
    const initialLength = this.connections.length;
    this.connections = this.connections.filter(conn => conn.id !== id);
    this.updatedAt = new Date().toISOString();
    return this.connections.length !== initialLength;
  }

  toJSON(): WorkflowType {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      nodes: this.nodes,
      connections: this.connections,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 