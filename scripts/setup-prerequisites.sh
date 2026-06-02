#!/usr/bin/env bash

set -euo pipefail

REQUIRED_PACKAGES=("node@22" "ollama" "postgresql")
MISSING_PACKAGES=()

REQUIRED_LLMS=("llama3.2:latest" "qwen2.5:3b" "qwen3.5:latest")
MISSING_LLMS=()

# Identify missing packages
for pkg in "${REQUIRED_PACKAGES[@]}"; do
    if ! brew list --versions "$pkg" > /dev/null 2>&1; then
        MISSING_PACKAGES+=("$pkg")
    fi
done

echo ""
if [ ${#MISSING_PACKAGES[@]} -eq 0 ]; then
    echo "All required packages are already installed 👏"
else
    echo "⚠️The following packages are required to be installed:"
    for pkg in "${MISSING_PACKAGES[@]}"; do
        echo " - $pkg"
    done

    echo ""
    echo "Installing missing packages..."
    brew install "${MISSING_PACKAGES[@]}"
fi

ollama_model_installed() {
    local model="$1"
    local model_base="${model%%:*}"

    ollama list | awk 'NR > 1 {print $1}' | grep -Fxq "$model" || \
        ollama list | awk 'NR > 1 {print $1}' | grep -Fxq "$model_base"
}

echo ""
echo "Installing required Ollama LLM models..."
for llm in "${REQUIRED_LLMS[@]}"; do
    if ollama_model_installed "$llm"; then
        printf '\t✅ %s already installed\n' "$llm"
    else
        MISSING_LLMS+=("$llm")
    fi
done

if [ ${#MISSING_LLMS[@]} -eq 0 ]; then
    echo "All required Ollama LLMs are already installed 👏"
else
    echo "⚠️The following Ollama LLMs are required to be installed:"
    for llm in "${MISSING_LLMS[@]}"; do
        echo " - $llm"
    done

    echo ""
    echo "Pulling missing Ollama LLMs..."
    for llm in "${MISSING_LLMS[@]}"; do
        if ollama_model_installed "$llm"; then
            printf '\t✅ %s already installed\n' "$llm"
        else
            printf '\t⬇️ Pulling %s...\n' "$llm"
            ollama pull "$llm"
        fi
    done
fi

echo "DONE"
echo ""
