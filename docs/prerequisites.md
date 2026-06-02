# Prerequisites

## TL;DR
If you're in a hurry, you can run the following command which will install all the missing prerequisites from your system using Homebrew:
```shell
  ../scripts/setup-prerequisites.sh
```

## Details
The list of prerequisites is listed below:
- Node.js ^22
  In case you don't have it installed, run the command below:

  ```shell
  brew install node@22
  ```
- Ollama w/model

  To install a model, depending on your GPU support run `ollama pull <model_name>` (eg: _llama3.2_)

  ```shell
  ollama pull llama3.2
  ```

# Useful CLI commands:

- Start Ollama server:
  ```shell
  ollama serve
  ```
- List MCP servers registered to OpenCode
    ```shell
    npx opencode mcp list
    ```