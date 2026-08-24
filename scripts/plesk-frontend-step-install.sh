#!/bin/bash
echo STEP 2 install starting

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

echo Installing frontend dependencies including devDependencies
npm install --include=dev

if [ -d node_modules/vite ]; then
  echo OK vite installed
else
  echo FAIL vite missing after install
  exit 1
fi

if [ -d node_modules/typescript ]; then
  echo OK typescript installed
else
  echo FAIL typescript missing after install
  exit 1
fi

echo STEP 2 install finished
