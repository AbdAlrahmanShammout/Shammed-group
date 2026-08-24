#!/bin/bash
# Full Plesk Git deploy for Shammed Group monorepo.
# Works inside Plesk Git chroot where subscription root maps to "/".
# In Plesk "additional deployment actions" use ONLY:
#   /bin/bash scripts/plesk-git-deploy-full.sh

set -u

log() {
  echo "$@"
  if [ -n "${LOGFILE:-}" ]; then
    echo "$@" >> "${LOGFILE}" 2>/dev/null || true
  fi
}

fail() {
  log "ERROR: $*"
  exit 1
}

# Resolve repo root first (works in chroot and normal FS).
if [ -d backend ] && [ -d frontend ]; then
  REPO_ROOT=$(pwd)
elif [ -d /api.shammed-group.com/backend ] && [ -d /api.shammed-group.com/frontend ]; then
  REPO_ROOT=/api.shammed-group.com
elif [ -d /var/www/vhosts/shammed-group.com/api.shammed-group.com/backend ]; then
  REPO_ROOT=/var/www/vhosts/shammed-group.com/api.shammed-group.com
else
  echo "ERROR: repo root not found"
  pwd
  ls -la
  exit 1
fi

# Prefer a writable log inside the repo (always available in chroot).
LOGFILE=${REPO_ROOT}/deploy.log
{
  echo ""
  echo "===== full deploy $(date) ====="
  echo "LOGFILE=${LOGFILE}"
} >> "${LOGFILE}" 2>/dev/null || true

log "STEP 0 start"
log "cwd=$(pwd)"
log "REPO_ROOT=${REPO_ROOT}"

# Resolve httpdocs for chroot + normal layouts.
HTTPDOCS=""
for candidate in \
  /httpdocs \
  "${REPO_ROOT}/../httpdocs" \
  /shammed-group.com/httpdocs \
  /var/www/vhosts/shammed-group.com/httpdocs \
  /var/www/vhosts/shammed-group.com/shammed-group.com/httpdocs
do
  if [ -d "${candidate}" ]; then
    HTTPDOCS=${candidate}
    break
  fi
done

if [ -z "${HTTPDOCS}" ]; then
  log "ERROR: httpdocs not found"
  log "listing / :"
  ls -la / >> "${LOGFILE}" 2>&1 || true
  log "listing REPO_ROOT/.. :"
  ls -la "${REPO_ROOT}/.." >> "${LOGFILE}" 2>&1 || true
  fail "httpdocs not found"
fi
log "HTTPDOCS=${HTTPDOCS}"

# Resolve absolute npm/node paths (Plesk toolkit). In chroot this often fails.
npmbin=""
nodebin=""
for version in 24 22 20 18; do
  if [ -x "/opt/plesk/node/${version}/bin/npm" ] && [ -x "/opt/plesk/node/${version}/bin/node" ]; then
    npmbin="/opt/plesk/node/${version}/bin/npm"
    nodebin="/opt/plesk/node/${version}/bin/node"
    break
  fi
done

# Fallback: npm already on PATH (rare in Git hook).
if [ -z "${npmbin}" ] && command -v npm >/dev/null 2>&1 && command -v node >/dev/null 2>&1; then
  npmbin=$(command -v npm)
  nodebin=$(command -v node)
fi

if [ -z "${npmbin}" ]; then
  log "listing /opt (if visible):"
  ls -la /opt >> "${LOGFILE}" 2>&1 || true
  ls -la /opt/plesk >> "${LOGFILE}" 2>&1 || true
  fail "npm binary not found (Git hook is likely chrooted without /opt/plesk/node)"
fi

if ! "${nodebin}" -v >/dev/null 2>&1; then
  fail "node exists at ${nodebin} but cannot execute"
fi
if ! "${npmbin}" -v >/dev/null 2>&1; then
  fail "npm exists at ${npmbin} but cannot execute"
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
