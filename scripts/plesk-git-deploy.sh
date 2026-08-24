#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="${REPO_ROOT}/backend"

setup_node_path() {
  for version in 24 22 20 18; do
    local node_bin="/opt/plesk/node/${version}/bin"
    if [ -x "${node_bin}/npm" ]; then
      export PATH="${node_bin}:${PATH}"
      return 0
    fi
  done
  local discovered_node
  discovered_node="$(find /opt/plesk/node -maxdepth 2 -type f -name npm 2>/dev/null | sort -V | tail -1 || true)"
  if [ -n "${discovered_node}" ]; then
    export PATH="$(dirname "${discovered_node}"):${PATH}"
    return 0
  fi
  if [ -f "${HOME}/.nodenv/shims/npm" ]; then
    export PATH="${HOME}/.nodenv/shims:${PATH}"
    return 0
  fi
  return 1
}

echo "Deploying Shammed Group backend from ${REPO_ROOT}"

if ! setup_node_path; then
  echo "ERROR: npm not found. Enable Node.js on api.shammed-group.com in Plesk first."
  exit 1
fi

command -v node >/dev/null || { echo "ERROR: node not found after PATH setup."; exit 1; }
command -v npm >/dev/null || { echo "ERROR: npm not found after PATH setup."; exit 1; }

echo "Using node: $(node -v)"
echo "Using npm:  $(npm -v)"

cd "${BACKEND_DIR}"

npm install
npm run generate
npm run build

echo "Backend build finished: ${BACKEND_DIR}/dist/main.js"
