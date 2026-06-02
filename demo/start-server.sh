#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[MCP-WRAPPER] cwd=$(pwd)" >&2
echo "[MCP-WRAPPER] node=$(which node)" >&2
echo "[MCP-WRAPPER] starting server" >&2

exec node "$SCRIPT_DIR/server.js"
