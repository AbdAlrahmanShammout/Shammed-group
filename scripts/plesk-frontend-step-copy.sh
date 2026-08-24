#!/bin/bash
echo STEP 4 copy starting

if [ -d frontend/dist ]; then
  DIST_DIR=$(pwd)/frontend/dist
elif [ -d /var/www/vhosts/shammed-group.com/api.shammed-group.com/frontend/dist ]; then
  DIST_DIR=/var/www/vhosts/shammed-group.com/api.shammed-group.com/frontend/dist
else
  echo FAIL frontend dist folder not found
  exit 1
fi

if [ -d /var/www/vhosts/shammed-group.com/httpdocs ]; then
  HTTPDOCS=/var/www/vhosts/shammed-group.com/httpdocs
elif [ -d /var/www/vhosts/shammed-group.com/shammed-group.com/httpdocs ]; then
  HTTPDOCS=/var/www/vhosts/shammed-group.com/shammed-group.com/httpdocs
else
  echo FAIL httpdocs folder not found
  exit 1
fi

echo Copy from ${DIST_DIR}
echo Copy to ${HTTPDOCS}

cp -R "${DIST_DIR}/." "${HTTPDOCS}/"

if [ -f "${HTTPDOCS}/index.html" ]; then
  echo OK httpdocs index.html exists
else
  echo FAIL httpdocs index.html missing after copy
  exit 1
fi

echo STEP 4 copy finished
