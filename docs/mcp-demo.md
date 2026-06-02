# Complete Node.js MCP + Ollama Integration Demo

This demo uses **Node.js only** for MCP server, client, and LLM integration with Ollama.

## 📦 1. Prerequisites

### Install Ollama & Model:
```bash
# Install Ollama (choose your OS)
# macOS: https://ollama.com
# Linux: curl -fsSL https://ollama.ai/install.sh | sh
# Windows: https://ollama.com

# Download model
ollama pull llama3.2

# Verify Ollama running
ollama serve

# Test connection
ollama run llama3.2 "Hello"
```

### Verify Ollama API:
```bash
curl http://localhost:11434/api/tags
```

## 🛠️ 2. MCP Server (Node.js)

### 2.1 Create Server Project:

```bash
mkdir ollama-mcp-server
cd ollama-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk ollama zod
```

### 2.2 Server File (`server.js`):

```javascript
#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/server');
const ollama = require('ollama');

const server = new Server({
  name: 'ollama-mcp',
  version: '1.0.0'
});

// Tool: Generate text via Ollama
server.tool('ollama_generate', {
  description: 'Generate text using Ollama LLM',
  parameters: {
    type: 'object',
    properties: {
      prompt: { type: 'string' },
      model: { type: 'string', default: 'llama3.2' },
      temperature: { type: 'number', default: 0.7 }
    },
    required: ['prompt']
  }
}, async (context, params) => {
  const { prompt, model = 'llama3.2', temperature = 0.7 } = params;
  
  try {
    const response = await ollama.chat({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      options: { temperature }
    });
    
    return {
      content: [{ type: 'text', text: response.message.content }],
      type: 'text'
    };
  } catch (error) {
    console.error('Ollama generation error:', error);
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      type: 'text'
    };
  }
});

// Tool: List available models
server.tool('list_models', {}, async () => {
  const models = await ollama.list();
  return {
    content: [{ type: 'text', text: JSON.stringify(models.models, null, 2) }],
    type: 'text'
  };
});

// Tool: Run model interactively
server.tool('run_model', {
  description: 'Run Ollama model',
  parameters: {
    type: 'object',
    properties: {
      prompt: { type: 'string' },
      model: { type: 'string' }
    },
    required: ['prompt', 'model']
  }
}, async (context, params) => {
  const { prompt, model } = params;
  
  const response = await ollama.generate({
    model: model,
    prompt: prompt,
    stream: false
  });
  
  return {
    content: [{ type: 'text', text: response.response }],
    type: 'text'
  };
});

// Start server
server.run();

console.log('✅ MCP Server running with Ollama');
```

### 2.3 Start Server:

```bash
node server.js
```

## 🚀 3. Client (Node.js)

### 3.1 Create Client Project:

```bash
mkdir ollama-mcp-client
cd ollama-mcp-client
npm init -y
npm install @modelcontextprotocol client ollama
```

### 3.2 Client Script (`demo/client.js`):

```javascript
import { Client } from '@modelcontextprotocol/sdk/client';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function runClient() {
    const transport = new StdioClientTransport({
        command: 'node',
        args: ['server.js'],
    });

    const client = new Client({
        name: 'ollama-client',
        version: '1.0.0',
    });

    await client.connect(transport);

    try {
        const result = await client.callTool({
            name: 'ollama_generate',
            arguments: {
                prompt: 'Write a javascript function that calculates Fibonacci',
                model: 'llama3.2',
            },
        });

        console.log('Response:', result.content[0].text);
    } catch (error) {
        console.error('Tool execution failed:', error);
    }

    try {
        const models = await client.callTool({
            name: 'list_models',
            arguments: {},
        });

        console.log('Available Models:', models.content[0].text);
    } catch (error) {
        console.error('List models failed:', error);
    }

    await client.close();
}

runClient().catch(console.error);
```

## ⚙️ 4. IDE Configuration

### Cursor MCP Settings (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "ollama": {
      "command": "node",
      "args": ["server.js"],
      "cwd": "~/work/path/to/ollama-mcp-server",
      "env": {
        "OLLAMA_HOST": "http://localhost:11434",
        "OLLAMA_MODELS": "/path/to/ollama/models",
        "OLLAMA_API_KEY": "ollama"
      }
    }
  }
}
```

### VS Code MCP Settings (`.vscode/settings.json`):

```json
{
  "mcpServers": {
    "ollama": {
      "command": "node",
      "args": ["server.js"],
      "cwd": "~/work/path/to/ollama-mcp-server",
      "env": {
        "OLLAMA_HOST": "http://localhost:11434"
      }
    }
  }
}
```

## ✅ 5. Verification

### 5.1 Test MCP Connection:

```bash
# Start server
node demo/server.js &

# Test from client node
node demo/client.js
```

### 5.2 Test from IDE Chat:

```
1. Open Cursor/VS Code Chat
2. Click MCP → Select ollama
3. Send prompt: "Explain this code"
```

### 5.3 Expected Response:

```json
{
  "tool": "ollama_generate",
  "content": "The code you're asking about...",
  "type": "text"
}
```

## 🧪 6. Advanced Usage

### 6.1 Multi-Prompt Handling (`server-multi.js`):

```javascript
const server = new Server({ name: 'ollama-mcp' });

// Add streaming capability
server.tool('stream_generate', {
  parameters: {
    type: 'object',
    properties: {
      prompt: { type: 'string' },
      model: { type: 'string' }
    }
  }
}, async (context, params) => {
  const { prompt, model } = params;
  
  return {
    content: [{
      type: 'text',
      text: await ollama.chat({
        model,
        messages: [{ role: 'user', content: prompt }]
      }).message.content
    }],
    type: 'text'
  };
});

server.run();
```

### 6.2 Batch Processing (`client-batch.js`):

```javascript
async function batchProcess(prompts) {
  const results = [];
  
  for (const prompt of prompts) {
    const result = await client.tool('ollama_generate', {
      prompt,
      model: 'llama3.2'
    });
    
    results.push(result.content[0].text);
    await new Promise(r => setTimeout(r, 100)); // Rate limit
  }
  
  return results;
}

batchProcess([
  'What is machine learning?',
  'How does Ollama work?',
  'What is an MCP server?'
]);
```

### 6.3 Custom Prompt Templates:

```javascript
const PROMPT_TEMPLATES = {
  codeReview: `
    Review this code for:
    - Security vulnerabilities
    - Performance issues
    - Best practices
    
    Code: {{CODE}}
  `,
  
  debugging: `
    Help debug this issue:
    - Error: {{ERROR}}
    - Context: {{CONTEXT}}
    - Expected: {{EXPECTED}}
  `,
  
  summary: `
    Summarize this document:
    {{DOCUMENT}}
    
    Limit to {{LENGTH}} words
  `
};

// Use template
const template = PROMPT_T