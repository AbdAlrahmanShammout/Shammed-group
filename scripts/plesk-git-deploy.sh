#!/bin/bash
echo Plesk deploy starting

SCRIPT_DIR=$(dirname "$0")
# shellcheck source=plesk-resolve-node.sh
. "${SCRIPT_DIR}/plesk-resolve-node.sh"
plesk_init_deploy_log
plesk_setup_node || exit 1

echo Deploy cwd is $(pwd)
"${PLESK_NODE}" -v
"${PLESK_NPM}" -v

if [ -d backend ]; then
  cd backend
elif [ -d /var/www/vhosts/shammed-group.com/api.shammed-group.com/backend ]; then
  cd /var/www/vhosts/shammed-group.com/api.shammed-group.com/backend
else
  echo ERROR backend folder not found
  ls -la
  exit 1
fi

plesk_run_npm install
plesk_run_npm run generate
plesk_run_npm run build

echo Backend build finished
