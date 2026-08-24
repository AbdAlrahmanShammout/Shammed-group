#!/bin/bash
echo STEP 3 build starting

export PATH="/usr/bin:/bin:/usr/local/bin:/opt/plesk/node/24/bin:/opt/plesk/node/22/bin:/opt/plesk/node/20/bin:/opt/plesk/node/18/bin:${PATH:-}"

if [ -d frontend ]; then
  REPO_ROOT=$(pwd)
elif [ -d /var/www/vhosts/shammed-group.com/api.shammed-group.com/frontend ]; then
  REPO_ROOT=/var/www/vhosts/shammed-group.com/api.shammed-group.com
else
  echo FAIL frontend folder not found
  exit 1
fi

cd "${REPO_ROOT}/frontend"

export VITE_API_BASE_URL=${VITE_API_BASE_URL:-https://api.shammed-group.com}
export VITE_PUBLIC_SITE_URL=${VITE_PUBLIC_SITE_URL:-https://shammed-group.com}

echo API URL is ${VITE_API_BASE_URL}
echo Site URL is ${VITE_PUBLIC_SITE_URL}

npm run build

if [ -f dist/index.html ]; then
  echo OK dist/index.html exists
else
  echo FAIL dist/index.html missing
  exit 1
fi

echo STEP 3 build finished
