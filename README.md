# Ollama MCP Client-Server

Node.js demo for exposing Ollama through the Model Context Protocol (MCP) and consuming those tools from a local client.

## What's included

- `demo/server.js` - MCP server that registers the Ollama tools.
- `demo/client.js` - interactive client that connects to the server over stdio.
- `demo/utils/mcp-tools.js` - tool implementations backed by Ollama.
- `scripts/setup-prerequisites.sh` - Homebrew bootstrap for local dependencies.
- `mcp-servers-config.json` and `opencode.json` - sample MCP client configuration.

## Prerequisites

- Node.js 20 or newer. The setup script installs Node 22.
- Ollama running locally. The code defaults to `http://0.0.0.0:11434`; override `OLLAMA_HOST` if you prefer `http://127.0.0.1:11434`.
- At least one model pulled in Ollama.

If you want the demo to work without changing defaults, pull the models used by the repo:

```bash
ollama pull llama3.2
ollama pull qwen2.5:3b
ollama pull qwen3.5:latest
```

See [docs/prerequisites.md](./docs/prerequisites.md) for the full setup flow.

## Quick Start

```bash
./scripts/setup-prerequisites.sh
npm install
ollama serve
npm run server
```

In a second terminal:

```bash
npm run mcp-client-custom
```

The interactive client will connect to the local MCP server, discover the available tools, and route prompts through Ollama.

## Available Scripts

- `npm run server` - start the MCP server from `demo/server.js`.
- `npm run mcp-client-custom` - start the interactive local client.
- `npm run mcp-client-opencode` - launch OpenCode.
- `npm run mcp-client-codex` - launch Codex.
- `npm run mcp-client-ollmcp` - run the Ollama MCP client wrapper.
- `npm run list-models` - list Ollama models.
- `npm run "list-MCP's"` - list MCP servers in OpenCode.

## MCP Tools

The server currently exposes three tools:

- `ollama_generate` - chat-style generation with a prompt, model, and temperature.
- `list_models` - list locally available Ollama models.
- `run_model` - run a prompt against a named Ollama model.

The tool definitions live in [demo/utils/mcp-tools.js](./demo/utils/mcp-tools.js).

## Config Files

- [mcp-servers-config.json](./mcp-servers-config.json) - MCP server configuration for clients that consume that format
- [opencode.json](./opencode.json) - OpenCode configuration for the bundled MCP server
- [.codex/config.toml](./opencode.json) - Codex configuration for the bundled MCP server

## Documentation

- [Prerequisites](./docs/prerequisites.md)
- [Demo Walkthrough](./docs/mcp-demo.md)
- [Presentation Outline](./docs/mcp.md)
