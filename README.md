# Presentation: Unlocking AI Potential with MCP
## Connecting Agents, Data, and Tools Seamlessly

Welcome to the **Ollama MCP Client-Server** project. This repository demonstrates a complete, end-to-end integration of the **[Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro)** using **Node.js** and **Ollama**.

### 🌟 Overview

In the rapidly evolving landscape of AI, the ability for Large Language Models (LLMs) to interact with local data and tools is a game-changer. The **Model Context Protocol (MCP)** provides a standardized way for AI agents to securely and efficiently access the context they need.

This project showcases:
- **Local LLM Integration:** Leveraging Ollama to run powerful models like `llama3.2` locally.
- **MCP Server Implementation:** A robust Node.js server that exposes Ollama's capabilities as MCP tools.
- **MCP Client implementation:** A reference client that connects to the server via Stdio transport.
- **IDE Integration:** Examples of how to configure Cursor and VS Code to use this MCP server.

### 🚀 Key Features

- **Standardized Tooling:** Use `ollama_generate`, `list_models`, and `run_model` as standardized MCP tools.
- **Secure & Local:** Everything runs on your local machine—no data leaves your environment.
- **Extensible:** Easily add more tools or integrate with other data sources using the MCP SDK.
- **Developer Friendly:** Clear separation between server logic and client implementation.

---

### 📖 Getting Started

To get started with the demo, please refer to the following guides:

1.  **[Prerequisites](./docs/prerequisites.md):** Install Ollama and the necessary models.
2.  **[MCP Integration Guide](./docs/mcp.md):** Detailed technical deep dive into the MCP setup.
3.  **[Complete Demo Walkthrough](./docs/mcp-demo.md):** Step-by-step instructions to run the server and client.

---

### 🛠️ Quick Start

```bash
# Install dependencies
npm install

# Start the MCP Server
node server.js

# In another terminal, run the test client
node client.js
```

---

### 🎯 Presentation Focus

This project is designed to illustrate:
1.  **The "Why" of MCP:** Solving the context window and tool-use problem.
2.  **The "How" of Implementation:** Simple, clean Node.js code using the `@modelcontextprotocol/sdk`.
3.  **Real-world Utility:** Enhancing IDEs like Cursor with local AI power.

---
*Created for the "Unlocking AI Potential with MCP" presentation.*

