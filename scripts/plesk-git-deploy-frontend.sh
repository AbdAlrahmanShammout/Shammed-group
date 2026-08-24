#!/bin/bash
echo Plesk frontend deploy starting

export PATH="/usr/bin:/bin:/usr/local/bin:/opt/plesk/node/24/bin:/opt/plesk/node/22/bin:/opt/plesk/node/20/bin:/opt/plesk/node/18/bin:${PATH:-}"

if ! command -v npm >/dev/null 2>&1; then
  echo ERROR npm not found
  exit 1
fi

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
echo Using node $(node -v)
echo Using npm $(npm -v)
echo API URL is ${VITE_API_BASE_URL}
echo Site URL is ${VITE_PUBLIC_SITE_URL}
echo Target httpdocs is ${HTTPDOCS}

cd "${FRONTEND_DIR}"
npm install --include=dev
npm run build

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
