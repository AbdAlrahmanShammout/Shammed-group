#!/bin/bash
echo STEP 1 check starting

export PATH="/usr/bin:/bin:/usr/local/bin:/opt/plesk/node/24/bin:/opt/plesk/node/22/bin:/opt/plesk/node/20/bin:/opt/plesk/node/18/bin:${PATH:-}"

echo cwd is $(pwd)
echo node is $(command -v node || echo MISSING)
echo npm is $(command -v npm || echo MISSING)
echo bash is $(command -v bash || echo MISSING)

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

echo NODE_ENV is ${NODE_ENV:-empty}
echo STEP 1 check finished
