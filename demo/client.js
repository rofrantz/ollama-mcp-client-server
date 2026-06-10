import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { Ollama } from 'ollama';
import {styles} from "./utils/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ollamaHost = process.env.OLLAMA_HOST || 'http://0.0.0.0:11434';
const ollama = new Ollama({ host: ollamaHost });

async function runSmartClient() {
    // 1. Connect to the MCP Server
    const transport = new StdioClientTransport({
        command: 'node',
        args: [join(__dirname, 'server.js')],
    });

    const mcpClient = new Client({
        name: 'custom-ollama-mcp-client',
        version: '1.0.0',
    });

    await mcpClient.connect(transport);
    console.log('🤖 Connected to MCP Server');
    console.log('Type "exit" or "quit" to stop.\n');

    // 2. Fetch available tools from the MCP Server
    const { tools } = await mcpClient.listTools();
    
    // 3. Convert MCP tools to Ollama tool format
    const ollamaTools = tools.map(tool => ({
        type: 'function',
        function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema,
        },
    }));

    // Maintain conversation history
    let messages = [];

    // Setup readline interface for user input
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (query) => new Promise((resolve) => rl.question(query, resolve));

    while (true) {
        const userInput = await question(`👤 ${styles.bold}User${styles.reset}: `);

        // ensure we have an exit command
        if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
            console.log('👋 Goodbye!');
            break;
        }

        if (!userInput.trim()) continue;

        messages.push({ role: 'user', content: userInput });

        try {
            // Call Ollama with the tool list
            let response = await ollama.chat({
                model: 'qwen2.5:3b',
                messages: messages,
                tools: ollamaTools,
            });

            // Handle potential multiple tool calls in a sequence
            while (response.message.tool_calls && response.message.tool_calls.length > 0) {
                for (const toolCall of response.message.tool_calls) {
                    console.log(`🔧 Using tool: ${styles.cyan}${toolCall.function.name}${styles.reset}...`);
                    
                    const toolResult = await mcpClient.callTool({
                        name: toolCall.function.name,
                        arguments: toolCall.function.arguments,
                    });

                    // Add tool call and its result to messages
                    messages.push(response.message);
                    messages.push({
                        role: 'tool',
                        content: toolResult.content[0].text,
                    });
                }

                // Get next response from LLM (it might want to call another tool or give final answer)
                response = await ollama.chat({
                    model: 'llama3.2',
                    messages: messages,
                    tools: ollamaTools,
                });
            }

            const finalContent = response.message.content;
            console.log(`🤖 ${styles.bold}LLM${styles.reset}: ${styles.italic}${finalContent}${styles.reset}\n`);
            
            // Add the final assistant response to history
            messages.push(response.message);

        } catch (error) {
            console.error('❌ Error during chat:', error);
        }
    }

    await mcpClient.close();
    rl.close();
}

runSmartClient().catch((err) => {
    console.error('Fatal Error:', err);
    process.exit(1);
});
