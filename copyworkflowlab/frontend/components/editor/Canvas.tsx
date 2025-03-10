import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Panel,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Workflow } from '../../../shared/types';
import { NodeComponent } from './NodeComponent';
import { ConnectionLine } from './ConnectionLine';

interface CanvasProps {
  workflow: Workflow;
  onWorkflowChange: (workflow: Workflow) => void;
  readOnly?: boolean;
}

// Register custom node types
const nodeTypes = {
  default: NodeComponent,
  input: NodeComponent,
  output: NodeComponent,
  transform: NodeComponent,
  condition: NodeComponent,
  api: NodeComponent,
  delay: NodeComponent,
  'ai-text': NodeComponent,
  merge: NodeComponent,
};

export function Canvas({ workflow, onWorkflowChange, readOnly = false }: CanvasProps) {
  // Convert workflow nodes and connections to ReactFlow format
  const [nodes, setNodes] = useState<Node[]>(
    workflow.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    }))
  );

  const [edges, setEdges] = useState<Edge[]>(
    workflow.connections.map((connection) => ({
      id: connection.id,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
    }))
  );

  // Update workflow when nodes or edges change
  useEffect(() => {
    const updatedWorkflow: Workflow = {
      ...workflow,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type || 'default',
        position: node.position,
        data: node.data,
      })),
      connections: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      })),
    };
    onWorkflowChange(updatedWorkflow);
  }, [nodes, edges, workflow.id, workflow.name, workflow.description, onWorkflowChange]);

  // Handle node changes (position, selection, etc.)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (readOnly) return;
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [readOnly]
  );

  // Handle edge changes (selection, removal, etc.)
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (readOnly) return;
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [readOnly]
  );

  // Handle new connections between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      if (readOnly) return;
      setEdges((eds) => addEdge({ ...connection, id: `e-${connection.source}-${connection.target}` }, eds));
    },
    [readOnly]
  );

  // Handle fitting the view to show all nodes
  const reactFlowInstance = useReactFlow();
  const fitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.2 });
  }, [reactFlowInstance]);

  // Fit view when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => fitView(), 100);
    }
  }, [nodes.length, fitView]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionLineComponent={ConnectionLine}
        fitView
        attributionPosition="bottom-right"
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        zoomOnScroll={!readOnly}
        panOnScroll={!readOnly}
        selectionOnDrag={!readOnly}
        panOnDrag={!readOnly}
        elementsSelectable={!readOnly}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        edgesFocusable={!readOnly}
        nodesFocusable={!readOnly}
      >
        <Background />
        <Controls showInteractive={!readOnly} />
        <MiniMap />
        <Panel position="top-right">
          <button
            onClick={fitView}
            className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600 dark:text-gray-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function CanvasWithProvider(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
    </ReactFlowProvider>
  );
} 