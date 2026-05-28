import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runClient() {
    const transport = new StdioClientTransport({
        command: 'node',
        args: [join(__dirname, 'server.js')],
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

        console.log('Current available Ollama models are:', models.content[0].text);
    } catch (error) {
        console.error('Listing Ollama models failed:', error);
    }

    await client.close();
}

runClient().catch(console.error);