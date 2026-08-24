#!/bin/bash
# Full Plesk Git deploy for Shammed Group monorepo.
# In Plesk "additional deployment actions" use ONLY:
#   /bin/bash scripts/plesk-git-deploy-full.sh

set -u

DOMAIN_ROOT=/var/www/vhosts/shammed-group.com
API_ROOT=${DOMAIN_ROOT}/api.shammed-group.com

# Prefer subscription logs, otherwise write inside the repo (always writable).
if [ -d "${DOMAIN_ROOT}/logs" ]; then
  LOGFILE=${DOMAIN_ROOT}/logs/deploy.log
elif [ -d logs ]; then
  LOGFILE=$(pwd)/logs/deploy.log
else
  LOGFILE=$(pwd)/deploy.log
fi

log() {
  echo "$@"
  echo "$@" >> "${LOGFILE}" 2>/dev/null || true
}

fail() {
  log "ERROR: $*"
  exit 1
}

{
  echo ""
  echo "===== full deploy $(date) ====="
  echo "LOGFILE=${LOGFILE}"
} >> "${LOGFILE}" 2>/dev/null || true

log "STEP 0 start"
log "cwd=$(pwd)"
log "LOGFILE=${LOGFILE}"

# Resolve repo root
if [ -d backend ] && [ -d frontend ]; then
  REPO_ROOT=$(pwd)
elif [ -d "${API_ROOT}/backend" ] && [ -d "${API_ROOT}/frontend" ]; then
  REPO_ROOT=${API_ROOT}
else
  fail "repo root not found (backend/frontend missing)"
fi
log "REPO_ROOT=${REPO_ROOT}"

# If preferred log path was not writable, switch to repo-local log.
if ! touch "${LOGFILE}" 2>/dev/null; then
  LOGFILE=${REPO_ROOT}/deploy.log
  log "switched LOGFILE to ${LOGFILE}"
fi

# Resolve httpdocs
if [ -d "${DOMAIN_ROOT}/httpdocs" ]; then
  HTTPDOCS=${DOMAIN_ROOT}/httpdocs
elif [ -d "${DOMAIN_ROOT}/shammed-group.com/httpdocs" ]; then
  HTTPDOCS=${DOMAIN_ROOT}/shammed-group.com/httpdocs
else
  fail "httpdocs not found"
fi
log "HTTPDOCS=${HTTPDOCS}"

# Resolve absolute npm/node paths (Plesk Node.js toolkit)
npmbin=""
nodebin=""
for version in 24 22 20 18; do
  if [ -x "/opt/plesk/node/${version}/bin/npm" ] && [ -x "/opt/plesk/node/${version}/bin/node" ]; then
    npmbin="/opt/plesk/node/${version}/bin/npm"
    nodebin="/opt/plesk/node/${version}/bin/node"
    break
  fi
done

if [ -z "${npmbin}" ]; then
  fail "npm binary not found under /opt/plesk/node/*/bin/npm (Git hook may be chrooted)"
fi

if ! "${nodebin}" -v >/dev/null 2>&1; then
  fail "node exists at ${nodebin} but cannot execute (likely chroot)"
fi
if ! "${npmbin}" -v >/dev/null 2>&1; then
  fail "npm exists at ${npmbin} but cannot execute (likely chroot)"
fi

log "STEP 0 ok"
log "nodebin=${nodebin} ($("${nodebin}" -v))"
log "npmbin=${npmbin} ($("${npmbin}" -v))"

# Backend
log "STEP 1 backend install"
cd "${REPO_ROOT}/backend" || fail "cannot cd backend"
"${npmbin}" install >> "${LOGFILE}" 2>&1 || fail "backend npm install failed"

log "STEP 2 backend generate"
"${npmbin}" run generate >> "${LOGFILE}" 2>&1 || fail "backend generate failed"

log "STEP 3 backend build"
"${npmbin}" run build >> "${LOGFILE}" 2>&1 || fail "backend build failed"

if [ ! -f "${REPO_ROOT}/backend/dist/main.js" ]; then
  fail "backend/dist/main.js missing after build"
fi
log "STEP 3 ok backend/dist/main.js ready"

# Frontend
export VITE_API_BASE_URL=https://api.shammed-group.com
export VITE_PUBLIC_SITE_URL=https://shammed-group.com

log "STEP 4 frontend install"
cd "${REPO_ROOT}/frontend" || fail "cannot cd frontend"
"${npmbin}" install --include=dev >> "${LOGFILE}" 2>&1 || fail "frontend npm install failed"

log "STEP 5 frontend build"
"${npmbin}" run build >> "${LOGFILE}" 2>&1 || fail "frontend build failed"

if [ ! -f "${REPO_ROOT}/frontend/dist/index.html" ]; then
  fail "frontend/dist/index.html missing after build"
fi
log "STEP 5 ok frontend/dist/index.html ready"

# Publish frontend
log "STEP 6 copy frontend to httpdocs"
cp -R "${REPO_ROOT}/frontend/dist/." "${HTTPDOCS}/" || fail "copy to httpdocs failed"

if [ ! -f "${HTTPDOCS}/index.html" ]; then
  fail "httpdocs/index.html missing after copy"
fi
log "STEP 6 ok httpdocs/index.html ready"

log "FULL DEPLOY SUCCESS"
echo FULL DEPLOY SUCCESS
exit 0
