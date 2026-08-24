#!/bin/bash
echo Plesk frontend deploy starting

SCRIPT_DIR=$(dirname "$0")
# shellcheck source=plesk-resolve-node.sh
. "${SCRIPT_DIR}/plesk-resolve-node.sh"
plesk_init_deploy_log
plesk_setup_node || exit 1

if [ -d frontend ]; then
  REPO_ROOT=$(pwd)
elif [ -d /var/www/vhosts/shammed-group.com/api.shammed-group.com/frontend ]; then
  REPO_ROOT=/var/www/vhosts/shammed-group.com/api.shammed-group.com
else
  echo ERROR frontend folder not found
  ls -la
  exit 1
fi

HTTPDOCS=/var/www/vhosts/shammed-group.com/httpdocs
if [ ! -d "${HTTPDOCS}" ] && [ -d /var/www/vhosts/shammed-group.com/shammed-group.com/httpdocs ]; then
  HTTPDOCS=/var/www/vhosts/shammed-group.com/shammed-group.com/httpdocs
fi
FRONTEND_DIR=${REPO_ROOT}/frontend

export VITE_API_BASE_URL=${VITE_API_BASE_URL:-https://api.shammed-group.com}
export VITE_PUBLIC_SITE_URL=${VITE_PUBLIC_SITE_URL:-https://shammed-group.com}

echo Deploy cwd is $(pwd)
"${PLESK_NODE}" -v
"${PLESK_NPM}" -v
echo API URL is ${VITE_API_BASE_URL}
echo Site URL is ${VITE_PUBLIC_SITE_URL}
echo Target httpdocs is ${HTTPDOCS}

cd "${FRONTEND_DIR}"
plesk_run_npm install --include=dev
plesk_run_npm run build

if [ ! -d dist ]; then
  echo ERROR frontend dist folder missing after build
  exit 1
fi

if [ ! -d "${HTTPDOCS}" ]; then
  echo ERROR httpdocs folder not found at ${HTTPDOCS}
  exit 1
fi

cp -R dist/. "${HTTPDOCS}/"

echo Frontend deployed to ${HTTPDOCS}
