import { NodeType } from '../../../shared/types';
import { NodeTypeRegistry } from '../models/Node';

/**
 * Register the default node types with the registry
 */
export function registerDefaultNodeTypes(registry: NodeTypeRegistry): void {
  // Input node
  registry.registerNodeType({
    type: 'input',
    category: 'Basic',
    label: 'Input',
    description: 'Starting point for workflow execution',
    inputs: [],
    outputs: [
      {
        id: 'output',
        label: 'Output',
        type: 'any'
      }
    ],
    configSchema: {
      value: {
        type: 'object',
        description: 'Initial data to pass to the workflow'
      }
    }
  });

  // Output node
  registry.registerNodeType({
    type: 'output',
    category: 'Basic',
    label: 'Output',
    description: 'End point for workflow execution',
    inputs: [
      {
        id: 'input',
        label: 'Input',
        type: 'any'
      }
    ],
    outputs: [],
    configSchema: {}
  });

  // Transform node
  registry.registerNodeType({
    type: 'transform',
    category: 'Data',
    label: 'Transform',
    description: 'Transform data using JavaScript code',
    inputs: [
      {
        id: 'input',
        label: 'Input',
        type: 'any'
      }
    ],
    outputs: [
      {
        id: 'output',
        label: 'Output',
        type: 'any'
      }
    ],
    configSchema: {
      code: {
        type: 'string',
        description: 'JavaScript code to transform the input data'
      }
    }
  });

  // Condition node
  registry.registerNodeType({
    type: 'condition',
    category: 'Logic',
    label: 'Condition',
    description: 'Branch workflow based on a condition',
    inputs: [
      {
        id: 'input',
        label: 'Input',
        type: 'any'
      }
    ],
    outputs: [
      {
        id: 'true',
        label: 'True',
        type: 'any'
      },
      {
        id: 'false',
        label: 'False',
        type: 'any'
      }
    ],
    configSchema: {
      condition: {
        type: 'string',
        description: 'JavaScript expression that evaluates to true or false'
      }
    }
  });

  // API Request node
  registry.registerNodeType({
    type: 'api',
    category: 'Integration',
    label: 'API Request',
    description: 'Make HTTP requests to external APIs',
    inputs: [
      {
        id: 'input',
        label: 'Input',
        type: 'any'
      }
    ],
    outputs: [
      {
        id: 'output',
        label: 'Output',
        type: 'any'
      }
    ],
    configSchema: {
      method: {
        type: 'string',
        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        default: 'GET'
      },
      url: {
        type: 'string',
        description: 'URL to make the request to'
      },
      headers: {
        type: 'object',
        description: 'HTTP headers to include in the request'
      },
      body: {
        type: 'object',
        description: 'Body to include in the request (for POST, PUT, PATCH)'
      }
    }
  });

  // Delay node
  registry.registerNodeType({
    type: 'delay',
    category: 'Utility',
    label: 'Delay',
    description: 'Pause workflow execution for a specified time',
    inputs: [
      {
        id: 'input',
        label: 'Input',
        type: 'any'
      }
    ],
    outputs: [
      {
        id: 'output',
        label: 'Output',
        type: 'any'
      }
    ],
    configSchema: {
      duration: {
        type: 'number',
        description: 'Duration to delay in milliseconds',
        default: 1000
      }
    }
  });

  // AI Text Generation node
  registry.registerNodeType({
    type: 'ai-text',
    category: 'AI',
    label: 'AI Text Generation',
    description: 'Generate text using AI models',
    inputs: [
      {
        id: 'input',
        label: 'Input',
        type: 'any'
      }
    ],
    outputs: [
      {
        id: 'output',
        label: 'Output',
        type: 'any'
      }
    ],
    configSchema: {
      provider: {
        type: 'string',
        enum: ['openai', 'anthropic', 'huggingface'],
        default: 'openai'
      },
      model: {
        type: 'string',
        description: 'Model to use for text generation'
      },
      prompt: {
        type: 'string',
        description: 'Prompt to send to the AI model'
      },
      temperature: {
        type: 'number',
        description: 'Temperature for text generation',
        default: 0.7,
        minimum: 0,
        maximum: 1
      }
    }
  });

  // Data Merge node
  registry.registerNodeType({
    type: 'merge',
    category: 'Data',
    label: 'Merge',
    description: 'Merge data from multiple inputs',
    inputs: [
      {
        id: 'input1',
        label: 'Input 1',
        type: 'any'
      },
      {
        id: 'input2',
        label: 'Input 2',
        type: 'any'
      }
    ],
    outputs: [
      {
        id: 'output',
        label: 'Output',
        type: 'any'
      }
    ],
    configSchema: {
      strategy: {
        type: 'string',
        enum: ['merge', 'concat', 'custom'],
        default: 'merge',
        description: 'Strategy to use for merging data'
      },
      customCode: {
        type: 'string',
        description: 'Custom JavaScript code for merging (when strategy is "custom")'
      }
    }
  });
} 