import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import workflowsRouter from './src/api/workflows';
import executionsRouter from './src/api/executions';
import integrationsRouter from './src/api/integrations';
import { NodeTypeRegistry } from './src/models/Node';
import { registerDefaultNodeTypes } from './src/integrations/defaultNodeTypes';

// Initialize the app
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Register API routes
app.use('/api/workflows', workflowsRouter);
app.use('/api/executions', executionsRouter);
app.use('/api/integrations', integrationsRouter);

// Register default node types
registerDefaultNodeTypes(NodeTypeRegistry.getInstance());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(port, () => {
  console.log(`WorkflowLab backend server running on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  // Perform cleanup operations here
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  // Perform cleanup operations here
  process.exit(0);
}); 