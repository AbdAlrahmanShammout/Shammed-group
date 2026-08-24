#!/bin/bash
echo Plesk deploy starting

export PATH="/usr/bin:/bin:/usr/local/bin:/opt/plesk/node/24/bin:/opt/plesk/node/22/bin:/opt/plesk/node/20/bin:/opt/plesk/node/18/bin:${PATH:-}"

if ! command -v npm >/dev/null 2>&1; then
  echo ERROR npm not found
  exit 1
fi

echo Deploy cwd is $(pwd)
echo Using node $(node -v)
echo Using npm $(npm -v)

if [ -d backend ]; then
  cd backend
elif [ -d /var/www/vhosts/shammed-group.com/api.shammed-group.com/backend ]; then
  cd /var/www/vhosts/shammed-group.com/api.shammed-group.com/backend
else
  echo ERROR backend folder not found
  ls -la
  exit 1
fi

npm install
npm run generate
npm run build

echo Backend build finished
