import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Import the tool definition
import { mcpTools } from './utils/mcp-tools.js';

import { debug, styles } from './utils/logger.js';

// CREATION: Create MCP server instance
const server = new McpServer({
    name: 'custom-ollama-mcp-server',
    version: '1.0.0',
});

// TOOL REGISTRATION: registers our tools / capabilities that will be exposed by our MCP server
debug('Registering tools...');

for (const tool of mcpTools) {
    server.registerTool(tool.name, tool.config, tool.handler);
    debug(`\t✅ Tool registered: ${styles.bold}${styles.green}${tool.name}${styles.reset} (${styles.italic}${tool.config.description}${styles.reset})`);
}

// TRANSPORT LAYER: MCP clients communicate with the server through stdin/stdout JSON-RPC messages
const transport = new StdioServerTransport();

// BOOT: start the server
await server.connect(transport);

debug('🚀 MCP Server running and ready');
