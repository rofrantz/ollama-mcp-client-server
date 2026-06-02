# Demo Walkthrough

This document describes how the repository is wired today and how to run the demo end to end.

## 1. What the Demo Does

- `demo/server.js` starts an MCP server over stdio.
- `demo/utils/mcp-tools.js` registers three Ollama-backed tools.
- `demo/client.js` launches an interactive client, discovers the tools, and sends model calls through MCP.

The client and server both talk to the same local Ollama instance.

## 2. Tools Exposed by the Server

- `ollama_generate`
  - Chat-style generation using a prompt, model, and temperature.
- `list_models`
  - Returns the locally available Ollama models.
- `run_model`
  - Runs a prompt against a named Ollama model using Ollama's generate API.

The tool implementations are in [demo/utils/mcp-tools.js](../demo/utils/mcp-tools.js).

## 3. Required Environment

Follow [docs/prerequisites.md](./prerequisites.md) first. The demo expects:

- Node.js installed
- Ollama running locally
- `llama3.2`, `qwen2.5:3b`, and `qwen3.5:latest` pulled, unless you change the defaults

Relevant environment variables:

- `OLLAMA_HOST` - defaults to `http://0.0.0.0:11434` in the current code; set it explicitly if you want to use `http://127.0.0.1:11434`
- `OLLAMA_MODEL` - defaults to `llama3.2` for the server-side tool defaults

## 4. Run the Demo

From the repository root:

```bash
npm install
ollama serve
npm run server
```

In another terminal:

```bash
npm run mcp-client-custom
```

When the client starts, it will:

1. Connect to `demo/server.js` over stdio.
2. Fetch the server's tool list.
3. Convert the MCP tool schemas into Ollama tool definitions.
4. Enter a prompt loop.

## 5. Try These Prompts

- `What models are available in ollama?`
- `Write a JavaScript Fibonacci function`
- `Tell me a joke using the llama model`
- `Check my models and then summarize the first one's capabilities`

The client will decide whether to answer directly or invoke one of the MCP tools first.

## 6. IDE and Client Integrations

The repo includes sample client configuration files:

- [mcp-servers-config.json](../mcp-servers-config.json)
- [opencode.json](../opencode.json)

These files point to `node ./demo/server.js`, which is the current server entrypoint.

## 7. Troubleshooting

- If the client cannot connect, confirm `ollama serve` is running.
- If a model is missing, pull it with `ollama pull <model-name>`.
- If you want a different default model, set `OLLAMA_MODEL` before starting the server.
- If you run the client from another directory, keep the repo root as the working directory so the relative server path resolves correctly.
