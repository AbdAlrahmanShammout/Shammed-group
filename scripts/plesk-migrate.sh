#!/bin/bash
# Apply pending Prisma migrations only (no seed, no restore, no build).
#
# Fixes production errors like:
#   The table `SiteSettingsPhone` does not exist in the current database.
#
# Usage on the server (from repo root or backend):
#   bash scripts/plesk-migrate.sh
#   pnpm migrate
#   pnpm --filter backend migrate
#
# Plesk Node.js panel -> Run NPM script name:
#   plesk-migrate

set -u

REPO_ROOT=""
BACKEND_DIR=""
NPM_BIN=""
NODE_BIN=""
NPX_BIN=""

log() {
  echo "$@"
}

fail() {
  log "ERROR: $*"
  exit 1
}

resolve_repo_root() {
  local script_dir
  script_dir=$(cd "$(dirname "$0")" && pwd)
  if [ -d "${script_dir}/../backend/prisma" ]; then
    REPO_ROOT=$(cd "${script_dir}/.." && pwd)
    return 0
  fi
  if [ -d /var/www/vhosts/shammed-group.com/api.shammed-group.com/backend/prisma ]; then
    REPO_ROOT=/var/www/vhosts/shammed-group.com/api.shammed-group.com
    return 0
  fi
  if [ -d "$(pwd)/backend/prisma" ]; then
    REPO_ROOT=$(pwd)
    return 0
  fi
  if [ -d "$(pwd)/prisma" ]; then
    REPO_ROOT=$(cd "$(pwd)/.." && pwd)
    return 0
  fi
  return 1
}

resolve_npm() {
  local version npm_path node_path npx_path
  for version in 24 26 22 20 18; do
    npm_path="/opt/plesk/node/${version}/bin/npm"
    node_path="/opt/plesk/node/${version}/bin/node"
    npx_path="/opt/plesk/node/${version}/bin/npx"
    if [ -x "${npm_path}" ] && [ -x "${node_path}" ]; then
      NPM_BIN=${npm_path}
      NODE_BIN=${node_path}
      NPX_BIN=${npx_path}
      return 0
    fi
  done
  if command -v npm >/dev/null 2>&1 && command -v node >/dev/null 2>&1; then
    NPM_BIN=$(command -v npm)
    NODE_BIN=$(command -v node)
    NPX_BIN=$(command -v npx)
    return 0
  fi
  return 1
}

main() {
  resolve_repo_root || fail "cannot find repo root with backend/prisma"
  BACKEND_DIR="${REPO_ROOT}/backend"
  [ -d "${BACKEND_DIR}/prisma/migrations" ] || fail "missing ${BACKEND_DIR}/prisma/migrations"
  [ -f "${BACKEND_DIR}/.env" ] || fail "missing ${BACKEND_DIR}/.env (DATABASE_URL required)"

  resolve_npm || fail "npm/node not found"
  export PATH="$(dirname "${NODE_BIN}"):${PATH:-}"

  cd "${BACKEND_DIR}" || fail "cannot cd ${BACKEND_DIR}"

  log "===== plesk-migrate $(date) ====="
  log "REPO_ROOT=${REPO_ROOT}"
  log "BACKEND_DIR=${BACKEND_DIR}"
  log "NODE=${NODE_BIN}"
  log "Applying pending Prisma migrations only..."

  if [ -x "${BACKEND_DIR}/node_modules/.bin/prisma" ]; then
    "${BACKEND_DIR}/node_modules/.bin/prisma" migrate deploy || fail "prisma migrate deploy failed"
  elif [ -n "${NPX_BIN}" ] && [ -x "${NPX_BIN}" ]; then
    "${NPX_BIN}" prisma migrate deploy || fail "prisma migrate deploy failed"
  else
    "${NPM_BIN}" exec prisma migrate deploy || fail "prisma migrate deploy failed"
  fi

  log "OK migrations applied"
  log "Restart the Node.js app in Plesk, then retry GET /admin/site-settings"
}

main "$@"
