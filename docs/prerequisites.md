# Prerequisites

This repository assumes a local Ollama install and a recent Node.js runtime.

## Quick Install

From the repository root:

```bash
./scripts/setup-prerequisites.sh
```

The script checks for these Homebrew packages and installs any that are missing:

- `node@22`
- `ollama`
- `postgresql`

## Manual Setup

If you prefer to install prerequisites yourself:

1. Install Node.js 20 or newer.
2. Install Ollama from [ollama.com](https://ollama.com).
3. Install PostgreSQL if you plan to use the bundled Postgres MCP server examples.

## Ollama Setup

Pull the default models used by this repo:

```bash
ollama pull llama3.2
ollama pull qwen2.5:3b
ollama pull qwen3.5:latest
```

Start the local Ollama service if it is not already running:

```bash
ollama serve
```

Verify the local API is reachable:

```bash
curl http://127.0.0.1:11434/api/tags
```

## Useful Commands

- List local Ollama models:

```bash
ollama list
```

- Start the MCP server used by this repo:

```bash
npm run server
```

- Start the interactive MCP client:

```bash
npm run mcp-client-custom
```

- List MCP servers in OpenCode:

```bash
npm run "list-MCP's"
```
