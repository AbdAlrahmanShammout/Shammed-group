#!/bin/bash
# One-file Plesk production deploy for Shammed Group.
#
# Plesk Node.js panel -> Run NPM script (type ONLY this name):
#   plesk-deploy
#
# Layout on this host:
#   api.shammed-group.com/backend  -> install, generate, build, migrate
#   api.shammed-group.com/frontend -> build, then copy dist to httpdocs
#
# Migrate step runs: bash scripts/plesk-migrate.sh --baseline-init
# (same as npm script plesk-migrate:baseline)

set -u

REPO_ROOT=""
HTTPDOCS=""
NPM_BIN=""
NODE_BIN=""
LOGFILE=""

log() {
  echo "$@"
  if [ -n "${LOGFILE}" ]; then
    echo "$@" >> "${LOGFILE}" 2>/dev/null || true
  fi
}

fail() {
  log "ERROR: $*"
  exit 1
}

run_logged() {
  log "RUN $*"
  "$@" 2>&1 | tee -a "${LOGFILE}"
  return "${PIPESTATUS[0]}"
}

resolve_repo_root() {
  local script_dir
  script_dir=$(cd "$(dirname "$0")" && pwd)
  if [ -d "${script_dir}/../backend" ] && [ -d "${script_dir}/../frontend" ]; then
    REPO_ROOT=$(cd "${script_dir}/.." && pwd)
    return 0
  fi
  if [ -d /var/www/vhosts/shammed-group.com/api.shammed-group.com/backend ]; then
    REPO_ROOT=/var/www/vhosts/shammed-group.com/api.shammed-group.com
    return 0
  fi
  if [ -d /api.shammed-group.com/backend ]; then
    REPO_ROOT=/api.shammed-group.com
    return 0
  fi
  return 1
}

resolve_httpdocs() {
  local candidate
  for candidate in \
    /var/www/vhosts/shammed-group.com/httpdocs \
    "${REPO_ROOT}/../httpdocs" \
    /httpdocs
  do
    if [ -d "${candidate}" ]; then
      HTTPDOCS=$(cd "${candidate}" && pwd)
      return 0
    fi
  done
  return 1
}

resolve_npm() {
  local version npm_path node_path
  for version in 24 26 22 20 18; do
    npm_path="/opt/plesk/node/${version}/bin/npm"
    node_path="/opt/plesk/node/${version}/bin/node"
    if [ -x "${npm_path}" ] && [ -x "${node_path}" ]; then
      NPM_BIN=${npm_path}
      NODE_BIN=${node_path}
      return 0
    fi
  done
  if command -v npm >/dev/null 2>&1 && command -v node >/dev/null 2>&1; then
    NPM_BIN=$(command -v npm)
    NODE_BIN=$(command -v node)
    return 0
  fi
  return 1
}

init_log() {
  if [ -d /var/www/vhosts/shammed-group.com/logs ]; then
    LOGFILE=/var/www/vhosts/shammed-group.com/logs/deploy.log
  else
    LOGFILE=${REPO_ROOT}/deploy.log
  fi
  {
    echo ""
    echo "===== plesk-deploy $(date) ====="
  } >> "${LOGFILE}" 2>/dev/null || LOGFILE=${REPO_ROOT}/deploy.log
}

migrate_database() {
  cd "${REPO_ROOT}/backend" || fail "cannot cd backend"
  log "STEP migrate database (plesk-migrate:baseline)"
  if [ -x "${REPO_ROOT}/scripts/plesk-migrate.sh" ]; then
    run_logged bash "${REPO_ROOT}/scripts/plesk-migrate.sh" --baseline-init \
      || fail "database migrate failed"
  else
    run_logged "${NPM_BIN}" run plesk-migrate:baseline \
      || fail "database migrate failed"
  fi
  log "STEP migrate ok"
}

deploy_backend() {
  cd "${REPO_ROOT}/backend" || fail "cannot cd backend"
  log "STEP 1 backend npm install"
  run_logged "${NPM_BIN}" install --include=dev || fail "backend npm install failed"
  log "STEP 2 backend generate"
  run_logged "${NPM_BIN}" run generate || fail "backend generate failed"
  log "STEP 3 backend build"
  run_logged "${NPM_BIN}" run build || fail "backend build failed"
  if [ ! -f "${REPO_ROOT}/backend/dist/src/main.js" ]; then
    log "listing backend/dist after build:"
    ls -la "${REPO_ROOT}/backend/dist" || true
    ls -la "${REPO_ROOT}/backend/dist/src" || true
    fail "backend/dist/src/main.js missing after build"
  fi
  log "STEP 3 ok backend/dist/src/main.js ready"
}

deploy_frontend() {
  export VITE_API_BASE_URL=https://api.shammed-group.com
  export VITE_PUBLIC_SITE_URL=https://shammed-group.com
  cd "${REPO_ROOT}/frontend" || fail "cannot cd frontend"
  log "STEP 4 frontend npm install"
  log "VITE_API_BASE_URL=${VITE_API_BASE_URL}"
  log "VITE_PUBLIC_SITE_URL=${VITE_PUBLIC_SITE_URL}"
  run_logged "${NPM_BIN}" install --include=dev || fail "frontend npm install failed"
  log "STEP 5 frontend build"
  run_logged "${NPM_BIN}" run build || fail "frontend build failed"
  if [ ! -f "${REPO_ROOT}/frontend/dist/index.html" ]; then
    fail "frontend/dist/index.html missing after build"
  fi
  log "STEP 5 ok frontend/dist/index.html ready"
}

publish_frontend() {
  log "STEP 6 copy frontend to httpdocs"
  log "from ${REPO_ROOT}/frontend/dist"
  log "to ${HTTPDOCS}"
  cp -R "${REPO_ROOT}/frontend/dist/." "${HTTPDOCS}/" || fail "copy to httpdocs failed"
  if [ ! -f "${HTTPDOCS}/index.html" ]; then
    fail "httpdocs/index.html missing after copy"
  fi
  log "STEP 6 ok httpdocs/index.html ready"
}

resolve_repo_root || fail "repo root not found (expected api.shammed-group.com)"
init_log
log "cwd=$(pwd)"
log "REPO_ROOT=${REPO_ROOT}"
resolve_httpdocs || fail "httpdocs not found"
log "HTTPDOCS=${HTTPDOCS}"
resolve_npm || fail "npm not found under /opt/plesk/node"
if ! "${NODE_BIN}" -v >/dev/null 2>&1; then
  fail "node exists at ${NODE_BIN} but cannot execute"
fi
if ! "${NPM_BIN}" -v >/dev/null 2>&1; then
  fail "npm exists at ${NPM_BIN} but cannot execute"
fi
log "NODE=${NODE_BIN} ($("${NODE_BIN}" -v))"
log "NPM=${NPM_BIN} ($("${NPM_BIN}" -v))"
log "LOGFILE=${LOGFILE}"

deploy_backend
migrate_database
deploy_frontend
publish_frontend

log "DEPLOY SUCCESS"
log "Restart the Node.js app in Plesk after this script."
echo DEPLOY SUCCESS
exit 0
