#!/bin/bash
echo STEP 1 check starting

SCRIPT_DIR=$(dirname "$0")
. "${SCRIPT_DIR}/plesk-resolve-node.sh"
if plesk_setup_node; then
  echo OK node and npm resolved
else
  echo FAIL could not resolve node/npm
fi

echo cwd is $(pwd)

if [ -d frontend ]; then
  echo OK frontend folder found in cwd
else
  echo FAIL frontend folder missing in cwd
fi

if [ -d /var/www/vhosts/shammed-group.com/api.shammed-group.com/frontend ]; then
  echo OK frontend at api subdomain path
else
  echo FAIL frontend at api subdomain path
fi

if [ -d /var/www/vhosts/shammed-group.com/httpdocs ]; then
  echo OK httpdocs at /var/www/vhosts/shammed-group.com/httpdocs
else
  echo FAIL httpdocs at /var/www/vhosts/shammed-group.com/httpdocs
fi

if [ -d /var/www/vhosts/shammed-group.com/shammed-group.com/httpdocs ]; then
  echo OK httpdocs at /var/www/vhosts/shammed-group.com/shammed-group.com/httpdocs
else
  echo FAIL httpdocs at shammed-group.com/httpdocs variant
fi

if [ -x /opt/plesk/node/24/bin/npm ]; then
  echo OK npm exists at /opt/plesk/node/24/bin/npm
else
  echo FAIL npm missing at /opt/plesk/node/24/bin/npm
fi

echo NODE_ENV is ${NODE_ENV:-empty}
echo STEP 1 check finished
