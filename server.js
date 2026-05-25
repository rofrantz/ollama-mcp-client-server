// Import MCP server core class
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Import stdio transport so the server can communicate
// with MCP clients through stdin/stdout
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Zod is used for validating tool input schemas
import { z } from 'zod';

// Official Ollama JavaScript client
import ollama from 'ollama';

// Create MCP server instance
const server = new McpServer({
    // Server name visible to MCP clients
    name: 'ollama-mcp',

    // Server version
    version: '1.0.0',
});

//
// TOOL #1 - Generate text using Ollama chat API
//
server.registerTool(
  // Tool name exposed to MCP clients
  'ollama_generate',

  {
      // Human-readable tool description
      description: 'Generate text using Ollama LLM',

      // Input validation schema
      inputSchema: z.object({
          // User prompt
          prompt: z.string(),

          // Ollama model name
          model: z.string().default('llama3.2'),

          // Sampling temperature
          temperature: z.number().default(0.7),
      }),
  },

  // Tool handler function
  async ({ prompt, model, temperature }) => {

      // Send chat request to Ollama
      const response = await ollama.chat({
          model,

          // Chat-style messages
          messages: [
              {
                  role: 'user',
                  content: prompt,
              },
          ],

          // Model runtime options
          options: {
              temperature,
          },
      });

      // Return MCP-compatible response
      return {
          content: [
              {
                  type: 'text',
                  text: response.message.content,
              },
          ],
      };
  }
);

//
// TOOL #2 - List locally installed Ollama models
//
server.registerTool(
  'list_models',

  {
      description: 'List available Ollama models',

      // No input required
      inputSchema: z.object({}),
  },

  async () => {

      // Retrieve installed models from Ollama
      const models = await ollama.list();

      // Return formatted JSON text
      return {
          content: [
              {
                  type: 'text',
                  text: JSON.stringify(models.models, null, 2),
              },
          ],
      };
  }
);

//
// TOOL #3 - Generate text using Ollama generate API
//
server.registerTool(
  'run_model',

  {
      description: 'Run Ollama model',

      inputSchema: z.object({
          prompt: z.string(),
          model: z.string(),
      }),
  },

  async ({ prompt, model }) => {

      // Generate plain completion
      const response = await ollama.generate({
          model,
          prompt,

          // Disable streaming for simpler response handling
          stream: false,
      });

      // Return generated text
      return {
          content: [
              {
                  type: 'text',
                  text: response.response,
              },
          ],
      };
  }
);

//
// Create stdio transport layer
//
// MCP clients communicate with the server through
// stdin/stdout JSON-RPC messages
//
const transport = new StdioServerTransport();

//
// Start MCP server
//
await server.connect(transport);

console.debug('✅ MCP Server running with Ollama');