import { z } from 'zod';
import ollama from 'ollama';

// Helper for handlers to access the same logging style if needed
const styles = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    cyan: '\x1b[36m',
};

const debug = (...args) => {
    console.error(`${styles.bold}${styles.cyan}[MCP-TOOLS][DEBUG]${styles.reset}`, ...args);
};

export const mcpTools = [
    {
        name: 'ollama_generate',
        config: {
            description: 'Generate text using Ollama LLM',
            inputSchema: z.object({
                prompt: z.string(),
                model: z.string().default('llama3.2'),
                temperature: z.number().default(0.7),
            }),
        },
        handler: async ({ prompt, model, temperature }) => {
            debug('Tool ollama_generate called', { model, temperature });
            const response = await ollama.chat({
                model,
                messages: [{ role: 'user', content: prompt }],
                options: { temperature },
            });

            return {
                content: [{ type: 'text', text: response.message.content }],
            };
        }
    },
    {
        name: 'list_models',
        config: {
            description: 'List available Ollama model names',
            inputSchema: z.object({}),
        },
        handler: async () => {
            const models = await ollama.list();
            // debug('Tool list_models called', models.models);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(models.models.map(model => model.name), null, 2),
                }],
            };
        }
    },
    {
        name: 'run_model',
        config: {
            description: 'Run Ollama model',
            inputSchema: z.object({
                prompt: z.string(),
                model: z.string(),
            }),
        },
        handler: async ({ prompt, model }) => {
            debug('Tool run_model called', { model });
            const response = await ollama.generate({
                model,
                prompt,
                stream: false,
            });

            return {
                content: [{ type: 'text', text: response.response }],
            };
        }
    }
];
