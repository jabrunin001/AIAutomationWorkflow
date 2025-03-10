# WorkflowLab

WorkflowLab is an AI Workflow Orchestration Platform that allows you to create, monitor, and debug automated AI workflows.

## Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating complex workflows without coding
- **Queue-Based Processing**: Reliable execution with automatic retries and failure handling
- **AI Integration**: Connect to popular AI services like OpenAI, Anthropic, and more
- **Monitoring and Debugging**: Track workflow execution and debug issues

## Architecture

WorkflowLab uses a modular architecture with clear separation of concerns:

```
copyworkflowlab/
├── frontend/         # Next.js application
├── backend/          # API and execution engine
└── shared/           # Common types and utilities
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v7 or later)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/copyworkflowlab.git
cd copyworkflowlab
```

2. Install dependencies:

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Running the Application

1. Start the development server:

```bash
npm start
```

This will start both the backend server (on port 3001) and the frontend application (on port 3000).

2. Open your browser and navigate to `http://localhost:3000`

## Development

### Project Structure

- `frontend/`: Next.js application
  - `app/`: Next.js app directory
  - `components/`: React components
  - `lib/`: Utility functions

- `backend/`: Express API and execution engine
  - `src/`: Source code
    - `api/`: API routes
    - `models/`: Data models
    - `engine/`: Core execution engine
    - `integrations/`: Integration framework
    - `monitoring/`: Monitoring system

- `shared/`: Common types and utilities
  - `types.ts`: TypeScript interfaces
  - `utils.ts`: Utility functions

## License

This project is licensed under the MIT License - see the LICENSE file for details. 