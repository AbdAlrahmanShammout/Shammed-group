#!/bin/bash
# Apply pending Prisma migrations only (no seed, no restore, no build).
#
# Fixes production errors like:
#   The table `SiteSettingsPhone` does not exist in the current database.
#
# P3005 (database schema is not empty):
#   The DB was created earlier without Prisma migration history.
#   Baseline the init migration, then deploy the rest:
#     bash scripts/plesk-migrate.sh --baseline-init
#
# Usage on the server:
#   bash scripts/plesk-migrate.sh
#   bash scripts/plesk-migrate.sh --baseline-init
#   pnpm migrate
#   pnpm plesk-migrate:baseline
#
# Plesk Node.js panel -> Run NPM script name:
#   plesk-migrate
#   plesk-migrate:baseline

set -u

REPO_ROOT=""
BACKEND_DIR=""
NPM_BIN=""
NODE_BIN=""
NPX_BIN=""
PRISMA_BIN=""
BASELINE_INIT=0
INIT_MIGRATION="20260824180000_init_mariadb"

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

resolve_prisma() {
  if [ -x "${BACKEND_DIR}/node_modules/.bin/prisma" ]; then
    PRISMA_BIN="${BACKEND_DIR}/node_modules/.bin/prisma"
    return 0
  fi
  if [ -n "${NPX_BIN}" ] && [ -x "${NPX_BIN}" ]; then
    PRISMA_BIN="${NPX_BIN} prisma"
    return 0
  fi
  PRISMA_BIN="${NPM_BIN} exec prisma"
  return 0
}

run_prisma() {
  # shellcheck disable=SC2086
  ${PRISMA_BIN} "$@"
}

parse_args() {
  local arg
  for arg in "$@"; do
    case "${arg}" in
      --baseline-init)
        BASELINE_INIT=1
        ;;
      -h|--help)
        log "Usage: bash scripts/plesk-migrate.sh [--baseline-init]"
        log "  --baseline-init  mark ${INIT_MIGRATION} as already applied, then deploy"
        exit 0
        ;;
      *)
        fail "unknown argument: ${arg}"
        ;;
    esac
  done
}

baseline_init_migration() {
  log "Baselining existing DB: mark ${INIT_MIGRATION} as already applied"
  log "(Use this only when tables from the init migration already exist.)"
  run_prisma migrate resolve --applied "${INIT_MIGRATION}" \
    || fail "prisma migrate resolve --applied ${INIT_MIGRATION} failed"
  log "OK init migration marked as applied"
}

main() {
  parse_args "$@"
  resolve_repo_root || fail "cannot find repo root with backend/prisma"
  BACKEND_DIR="${REPO_ROOT}/backend"
  [ -d "${BACKEND_DIR}/prisma/migrations" ] || fail "missing ${BACKEND_DIR}/prisma/migrations"
  [ -d "${BACKEND_DIR}/prisma/migrations/${INIT_MIGRATION}" ] || fail "missing init migration ${INIT_MIGRATION}"
  [ -f "${BACKEND_DIR}/.env" ] || fail "missing ${BACKEND_DIR}/.env (DATABASE_URL required)"

  resolve_npm || fail "npm/node not found"
  export PATH="$(dirname "${NODE_BIN}"):${PATH:-}"
  resolve_prisma

  cd "${BACKEND_DIR}" || fail "cannot cd ${BACKEND_DIR}"

  log "===== plesk-migrate $(date) ====="
  log "REPO_ROOT=${REPO_ROOT}"
  log "BACKEND_DIR=${BACKEND_DIR}"
  log "NODE=${NODE_BIN}"
  log "BASELINE_INIT=${BASELINE_INIT}"

  if [ "${BASELINE_INIT}" -eq 1 ]; then
    baseline_init_migration
  fi

  log "Migration status before deploy:"
  run_prisma migrate status || true

  log "Applying pending Prisma migrations only..."
  if ! run_prisma migrate deploy; then
    log ""
    log "If you saw P3005 (database schema is not empty), run once:"
    log "  bash scripts/plesk-migrate.sh --baseline-init"
    log "  or: pnpm plesk-migrate:baseline"
    fail "prisma migrate deploy failed"
  fi

  log "OK migrations applied"
  log "Restart the Node.js app in Plesk, then retry GET /admin/site-settings"
}

main "$@"
