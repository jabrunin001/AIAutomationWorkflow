import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export const NodeComponent = memo(({ data, id, type }: NodeProps) => {
  // Define node appearance based on type
  const getNodeConfig = (nodeType: string) => {
    switch (nodeType) {
      case 'input':
        return {
          title: 'Input',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ),
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          handles: { inputs: [], outputs: ['output'] },
        };
      case 'output':
        return {
          title: 'Output',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ),
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
          handles: { inputs: ['input'], outputs: [] },
        };
      case 'transform':
        return {
          title: 'Transform',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ),
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
          handles: { inputs: ['input'], outputs: ['output'] },
        };
      case 'condition':
        return {
          title: 'Condition',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          handles: { inputs: ['input'], outputs: ['true', 'false'] },
        };
      case 'api':
        return {
          title: 'API Request',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          ),
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
          handles: { inputs: ['input'], outputs: ['output'] },
        };
      case 'delay':
        return {
          title: 'Delay',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          handles: { inputs: ['input'], outputs: ['output'] },
        };
      case 'ai-text':
        return {
          title: 'AI Text Generation',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          ),
          color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
          handles: { inputs: ['input'], outputs: ['output'] },
        };
      case 'merge':
        return {
          title: 'Merge',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          ),
          color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
          handles: { inputs: ['input1', 'input2'], outputs: ['output'] },
        };
      default:
        return {
          title: 'Node',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ),
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          handles: { inputs: ['input'], outputs: ['output'] },
        };
    }
  };

  const nodeConfig = getNodeConfig(type);
  const nodeTitle = data.label || nodeConfig.title;

  return (
    <Card className={`w-60 shadow-md ${nodeConfig.color}`}>
      <CardHeader className="p-3 flex flex-row items-center space-y-0">
        <div className="mr-2">{nodeConfig.icon}</div>
        <CardTitle className="text-sm font-medium">{nodeTitle}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 text-xs">
        {/* Display node data */}
        {data.description && <p className="mb-2 text-gray-600 dark:text-gray-400">{data.description}</p>}
        
        {/* Display custom node content based on type */}
        {type === 'input' && data.value && (
          <div className="mt-1 p-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            <pre className="text-xs overflow-auto max-h-20">{JSON.stringify(data.value, null, 2)}</pre>
          </div>
        )}
        
        {type === 'transform' && data.code && (
          <div className="mt-1 p-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            <pre className="text-xs overflow-auto max-h-20">{data.code}</pre>
          </div>
        )}
        
        {type === 'api' && data.url && (
          <div className="mt-1">
            <span className="inline-block px-2 py-1 text-xs rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {data.method || 'GET'} {data.url}
            </span>
          </div>
        )}
      </CardContent>

      {/* Input Handles */}
      {nodeConfig.handles.inputs.map((handleId, index) => (
        <Handle
          key={`input-${handleId}`}
          type="target"
          position={Position.Left}
          id={handleId}
          style={{ 
            top: `${(index + 1) * (100 / (nodeConfig.handles.inputs.length + 1))}%`,
            background: '#555',
            width: 8,
            height: 8
          }}
        />
      ))}

      {/* Output Handles */}
      {nodeConfig.handles.outputs.map((handleId, index) => (
        <Handle
          key={`output-${handleId}`}
          type="source"
          position={Position.Right}
          id={handleId}
          style={{ 
            top: `${(index + 1) * (100 / (nodeConfig.handles.outputs.length + 1))}%`,
            background: '#555',
            width: 8,
            height: 8
          }}
        />
      ))}
    </Card>
  );
}); 