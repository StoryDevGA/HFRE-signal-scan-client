#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIST="$SCRIPT_DIR/dist"
PROD_DIR="$SCRIPT_DIR/../prod"

echo "Building client (npm run build)..."
if ! (
  cd "$SCRIPT_DIR"
  npm run build
); then
  echo "Error: Build failed. Stopping copy to prod." >&2
  exit 1
fi

if [ ! -d "$CLIENT_DIST" ]; then
  echo "Error: $CLIENT_DIST does not exist after build." >&2
  exit 1
fi

mkdir -p "$PROD_DIR"

# Clear existing prod contents before copy (including hidden files).
find "$PROD_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +

# Copy dist contents (including hidden files).
cp -R "$CLIENT_DIST"/. "$PROD_DIR"/

echo "Success: Copied client/dist to prod/."
