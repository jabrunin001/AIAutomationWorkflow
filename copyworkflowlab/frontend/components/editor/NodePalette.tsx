import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { generateId } from '../../../shared/utils';

interface NodeTypeItem {
  type: string;
  category: string;
  label: string;
  description: string;
}

interface NodePaletteProps {
  onNodeAdd: (nodeType: string, position: { x: number, y: number }) => void;
}

// Node types available in the palette
const nodeTypes: NodeTypeItem[] = [
  {
    type: 'input',
    category: 'Basic',
    label: 'Input',
    description: 'Starting point for workflow execution',
  },
  {
    type: 'output',
    category: 'Basic',
    label: 'Output',
    description: 'End point for workflow execution',
  },
  {
    type: 'transform',
    category: 'Data',
    label: 'Transform',
    description: 'Transform data using JavaScript code',
  },
  {
    type: 'condition',
    category: 'Logic',
    label: 'Condition',
    description: 'Branch workflow based on a condition',
  },
  {
    type: 'api',
    category: 'Integration',
    label: 'API Request',
    description: 'Make HTTP requests to external APIs',
  },
  {
    type: 'delay',
    category: 'Utility',
    label: 'Delay',
    description: 'Pause workflow execution for a specified time',
  },
  {
    type: 'ai-text',
    category: 'AI',
    label: 'AI Text Generation',
    description: 'Generate text using AI models',
  },
  {
    type: 'merge',
    category: 'Data',
    label: 'Merge',
    description: 'Merge data from multiple inputs',
  },
];

export function NodePalette({ onNodeAdd }: NodePaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(nodeTypes.map((node) => node.category)));

  // Filter nodes based on search and category
  const filteredNodes = nodeTypes.filter((node) => {
    const matchesSearch = 
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? node.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Group nodes by category
  const nodesByCategory: Record<string, NodeTypeItem[]> = {};
  filteredNodes.forEach((node) => {
    if (!nodesByCategory[node.category]) {
      nodesByCategory[node.category] = [];
    }
    nodesByCategory[node.category].push(node);
  });

  // Handle drag start
  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full overflow-hidden flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Node Palette</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Drag nodes to the canvas</p>
        
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search nodes..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          <button
            className={`px-2 py-1 text-xs rounded-md ${
              selectedCategory === null
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`px-2 py-1 text-xs rounded-md ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(nodesByCategory).map(([category, nodes]) => (
          <div key={category} className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{category}</h4>
            <div className="space-y-2">
              {nodes.map((node) => (
                <div
                  key={node.type}
                  className="cursor-grab"
                  draggable
                  onDragStart={(e) => handleDragStart(e, node.type)}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{node.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{node.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {Object.keys(nodesByCategory).length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No nodes match your search</p>
          </div>
        )}
      </div>
    </div>
  );
} 