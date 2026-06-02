// Import MCP server core class
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Import stdio transport so the server can communicate with MCP clients through stdin/stdout
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Import the tool definition
import { mcpTools } from './utils/mcp-tools.js';
import {debug, styles} from './utils/logger.js';

// Create MCP server instance
const server = new McpServer({
    // Server name visible to MCP clients
    name: 'custom-ollama-mcp-server',

    // Server version
    version: '1.0.0',
});

//
// DYNAMIC TOOL REGISTRATION
// We iterate through our tool collection and register each one with the MCP server
//
debug('Registering tools...');

for (const tool of mcpTools) {
    server.registerTool(tool.name, tool.config, tool.handler);
    debug(`\t✅ Tool registered: ${styles.bold}${styles.green}${tool.name}${styles.reset} (${styles.italic}${tool.config.description}${styles.reset})`);
}

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

debug('🚀 MCP Server running and ready');
