#!/usr/bin/env bash

set -e

REQUIRED_PACKAGES=("node@22" "ollama")
MISSING_PACKAGES=()

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

echo "DONE"
echo ""