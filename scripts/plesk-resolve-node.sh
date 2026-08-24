#!/bin/bash

plesk_resolve_node_bin() {
  PLESK_NODE_BIN=""
  for version in 24 22 20 18; do
    if [ -x "/opt/plesk/node/${version}/bin/npm" ]; then
      PLESK_NODE_BIN="/opt/plesk/node/${version}/bin"
      return 0
    fi
  done
  if [ -x /usr/local/bin/npm ]; then
    PLESK_NODE_BIN=/usr/local/bin
    return 0
  fi
  if [ -x /usr/bin/npm ]; then
    PLESK_NODE_BIN=/usr/bin
    return 0
  fi
  return 1
}

plesk_setup_node() {
  if ! plesk_resolve_node_bin; then
    echo FAIL npm not found under /opt/plesk/node
    echo HINT Git deploy may run in chroot and cannot access /opt/plesk/node
    echo HINT Use Plesk Node.js panel Run script instead, or build on your Mac
    return 1
  fi
  export PLESK_NODE_BIN
  export PLESK_NPM="${PLESK_NODE_BIN}/npm"
  export PLESK_NODE="${PLESK_NODE_BIN}/node"
  export PATH="${PLESK_NODE_BIN}:/usr/bin:/bin:/usr/local/bin:${PATH:-}"
  if ! "${PLESK_NPM}" -v >/dev/null 2>&1; then
    echo FAIL npm exists at ${PLESK_NPM} but cannot execute
    echo HINT Git deploy is likely chrooted on this host
    echo HINT Use Node.js panel for backend build and Mac build for frontend
    return 1
  fi
  echo Using node "${PLESK_NODE}"
  echo Using npm "${PLESK_NPM}"
  return 0
}

plesk_run_npm() {
  if [ -z "${PLESK_NPM:-}" ]; then
    plesk_setup_node || return 1
  fi
  "${PLESK_NPM}" "$@"
}

plesk_init_deploy_log() {
  if [ -d /var/www/vhosts/shammed-group.com/logs ]; then
    PLESK_DEPLOY_LOG="/var/www/vhosts/shammed-group.com/logs/deploy.log"
  elif [ -d logs ]; then
    PLESK_DEPLOY_LOG="$(pwd)/logs/deploy.log"
  else
    PLESK_DEPLOY_LOG="$(pwd)/deploy.log"
  fi
  {
    echo "===== deploy $(date) ====="
  } >> "${PLESK_DEPLOY_LOG}" 2>/dev/null || PLESK_DEPLOY_LOG=""
  if [ -n "${PLESK_DEPLOY_LOG}" ]; then
    echo Deploy log file is ${PLESK_DEPLOY_LOG}
  fi
}
