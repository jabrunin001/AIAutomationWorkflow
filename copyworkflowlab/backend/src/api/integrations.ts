import express from 'express';
import { Integration } from '../../../shared/types';
import { generateId } from '../../../shared/utils';

// In-memory storage for integrations (in a real app, this would be a database)
const integrationsStore: Record<string, Integration> = {};

const router = express.Router();

// Get all integrations
router.get('/', (req, res) => {
  const integrations = Object.values(integrationsStore);
  res.json({ integrations });
});

// Get a specific integration
router.get('/:id', (req, res) => {
  const integration = integrationsStore[req.params.id];
  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' });
  }
  res.json({ integration });
});

// Create a new integration
router.post('/', (req, res) => {
  try {
    const integrationData = req.body;
    
    // Validate required fields
    if (!integrationData.name || !integrationData.type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }
    
    const integration: Integration = {
      id: generateId(),
      name: integrationData.name,
      type: integrationData.type,
      config: integrationData.config || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In a real app, we would validate the config against a schema for the integration type
    
    integrationsStore[integration.id] = integration;
    res.status(201).json({ integration });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid integration data' });
  }
});

// Update an integration
router.put('/:id', (req, res) => {
  const integration = integrationsStore[req.params.id];
  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' });
  }
  
  try {
    const updatedData = req.body;
    
    // Update integration properties
    if (updatedData.name) integration.name = updatedData.name;
    if (updatedData.type) integration.type = updatedData.type;
    if (updatedData.config) integration.config = updatedData.config;
    
    integration.updatedAt = new Date().toISOString();
    
    // In a real app, we would validate the config against a schema for the integration type
    
    res.json({ integration });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid integration data' });
  }
});

// Delete an integration
router.delete('/:id', (req, res) => {
  const integration = integrationsStore[req.params.id];
  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' });
  }
  
  delete integrationsStore[req.params.id];
  res.status(204).send();
});

// Test an integration connection
router.post('/:id/test', (req, res) => {
  const integration = integrationsStore[req.params.id];
  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' });
  }
  
  // In a real app, we would actually test the connection to the integration
  // For now, we'll just simulate a successful test
  
  // Simulate some processing time
  setTimeout(() => {
    // Randomly succeed or fail for demonstration purposes
    const success = Math.random() > 0.3;
    
    if (success) {
      res.json({
        success: true,
        message: 'Connection test successful',
        details: {
          timestamp: new Date().toISOString(),
          latency: Math.floor(Math.random() * 200) + 50 // Random latency between 50-250ms
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Connection test failed',
        details: {
          timestamp: new Date().toISOString(),
          reason: 'Authentication failed' // Example error
        }
      });
    }
  }, 1000);
});

// Get available integration types
router.get('/types', (req, res) => {
  // In a real app, this would come from a registry of supported integration types
  const integrationTypes = [
    {
      type: 'http',
      name: 'HTTP Request',
      description: 'Make HTTP requests to external APIs',
      configSchema: {
        baseUrl: { type: 'string', required: true },
        headers: { type: 'object' },
        auth: {
          type: { type: 'string', enum: ['none', 'basic', 'bearer', 'oauth2'] },
          username: { type: 'string' },
          password: { type: 'string' },
          token: { type: 'string' }
        }
      }
    },
    {
      type: 'database',
      name: 'Database',
      description: 'Connect to SQL and NoSQL databases',
      configSchema: {
        type: { type: 'string', enum: ['mysql', 'postgres', 'mongodb'], required: true },
        host: { type: 'string', required: true },
        port: { type: 'number' },
        database: { type: 'string', required: true },
        username: { type: 'string' },
        password: { type: 'string' }
      }
    },
    {
      type: 'ai',
      name: 'AI Service',
      description: 'Connect to AI and ML services',
      configSchema: {
        provider: { type: 'string', enum: ['openai', 'anthropic', 'huggingface'], required: true },
        apiKey: { type: 'string', required: true },
        model: { type: 'string' }
      }
    }
  ];
  
  res.json({ integrationTypes });
});

export default router; 