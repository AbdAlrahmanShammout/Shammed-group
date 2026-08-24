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
    echo FAIL npm not found under /opt/plesk/node or /usr/bin
    return 1
  fi
  export PATH="${PLESK_NODE_BIN}:/usr/bin:/bin:/usr/local/bin:${PATH:-}"
  export PLESK_NPM="${PLESK_NODE_BIN}/npm"
  export PLESK_NODE="${PLESK_NODE_BIN}/node"
  echo Using node ${PLESK_NODE}
  echo Using npm ${PLESK_NPM}
  return 0
}

plesk_run_npm() {
  if [ -z "${PLESK_NPM:-}" ]; then
    plesk_setup_node || return 1
  fi
  "${PLESK_NPM}" "$@"
}
