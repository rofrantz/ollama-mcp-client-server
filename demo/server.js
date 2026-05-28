// Import MCP server core class
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Import stdio transport so the server can communicate
// with MCP clients through stdin/stdout
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Import the tool definition
import { mcpTools } from './mcp-tools.js';

// Create MCP server instance
const server = new McpServer({
    // Server name visible to MCP clients
    name: 'ollama-mcp',

    // Server version
    version: '1.0.0',
});

// Redirect console.debug to stderr so it doesn't break the MCP protocol which relies on standard output
const styles = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    cyan: '\x1b[36m',
};

console.debug = (...args) => {
    console.error(`${styles.bold}${styles.cyan}[MCP-SERVER][DEBUG]${styles.reset}`, ...args);
};

//
// DYNAMIC TOOL REGISTRATION
// We iterate through our tool collection and register each one with the MCP server
//
console.debug('Registering tools...');

for (const tool of mcpTools) {
    server.registerTool(tool.name, tool.config, tool.handler);
    console.debug(`\t✅ Tool registered: ${tool.name}`);
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

console.debug('🚀 MCP Server running and ready');
