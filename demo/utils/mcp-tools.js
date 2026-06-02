import { z } from 'zod';
import { Ollama } from 'ollama';

const ollamaHost = process.env.OLLAMA_HOST || 'http://0.0.0.0:11434';
const defaultOllamaModel = process.env.OLLAMA_MODEL || 'llama3.2';
const ollama = new Ollama({ host: ollamaHost });

// Helper for handlers to access the same logging style if needed
const styles = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    italic: '\x1b[3m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    gray: '\x1b[90m',
};

const debug = (...args) => {
    console.error(`${styles.bold}${styles.cyan}[MCP-TOOLS][DEBUG]${styles.reset}`, ...args);
};

export const mcpTools = [
    {
        name: 'ollama_generate',
        config: {
            description: 'Generate text using Ollama LLM validating that we are using one of available Ollama models',
            inputSchema: z.object({
                prompt: z.string(),
                model: z.string().default(defaultOllamaModel),
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
            description: 'Use this tool whenever the user asks what Ollama models are installed locally',
            inputSchema: z.object({}),
        },
        handler: async () => {
            const models = await ollama.list();
            debug('Tool list_models called');
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
            description: 'Run Ollama with a specific Ollama model',
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
