#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIST="$SCRIPT_DIR/dist"
PROD_DIR="$SCRIPT_DIR/../prod"

if [ ! -d "$CLIENT_DIST" ]; then
  echo "Error: $CLIENT_DIST does not exist. Build the client first." >&2
  exit 1
fi

mkdir -p "$PROD_DIR"

# Clear existing prod contents before copy.
if [ -n "$(ls -A "$PROD_DIR" 2>/dev/null)" ]; then
  rm -rf "$PROD_DIR"/*
fi

cp -R "$CLIENT_DIST"/* "$PROD_DIR"/

echo "Success: Copied client/dist to prod/."
