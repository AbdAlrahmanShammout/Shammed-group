#!/usr/bin/env bash
set -eu

export PATH="/usr/bin:/bin:/usr/local/bin:/opt/plesk/node/24/bin:/opt/plesk/node/22/bin:/opt/plesk/node/20/bin:/opt/plesk/node/18/bin:${PATH:-}"

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm not found. Enable Node.js on api.shammed-group.com in Plesk first."
  exit 1
fi

echo "Deploy cwd: $(pwd)"
echo "Using node: $(node -v)"
echo "Using npm:  $(npm -v)"

cd backend

npm install
npm run generate
npm run build

echo "Backend build finished: $(pwd)/dist/main.js"
