#!/bin/bash
# Test whether this Plesk environment can see and run npm.
#
# Plesk Node.js panel -> Run NPM script (type ONLY this name):
#   plesk-test-npm
#
# SSH or Git additional deployment actions:
#   /bin/bash scripts/plesk-test-npm.sh
#
# Git hooks often run in a chroot where /opt/plesk/node is hidden.

set -u

echo "===== Plesk npm access test $(date) ====="
echo "cwd=$(pwd)"
echo "user=$(id -un 2>/dev/null || echo unknown)"
echo "PATH=${PATH:-empty}"
echo ""

ok_count=0
fail_count=0

pass() {
  echo "OK   $*"
  ok_count=$((ok_count + 1))
}

fail() {
  echo "FAIL $*"
  fail_count=$((fail_count + 1))
}

echo "--- 1) Can this shell see /opt/plesk/node? ---"
if [ -d /opt ]; then
  pass "/opt exists"
else
  fail "/opt is not visible (likely a Git chroot jail)"
fi

if [ -d /opt/plesk ]; then
  pass "/opt/plesk exists"
  echo "listing /opt/plesk:"
  ls -la /opt/plesk || true
else
  fail "/opt/plesk is not visible"
fi

if [ -d /opt/plesk/node ]; then
  pass "/opt/plesk/node exists"
  echo "listing /opt/plesk/node:"
  ls -la /opt/plesk/node || true
else
  fail "/opt/plesk/node is not visible"
fi
echo ""

echo "--- 2) Which Plesk Node versions have npm? ---"
found_npm=""
found_node=""
for version in 24 22 20 18 16; do
  npm_path="/opt/plesk/node/${version}/bin/npm"
  node_path="/opt/plesk/node/${version}/bin/node"
  if [ -x "${npm_path}" ]; then
    pass "executable ${npm_path}"
    if [ -z "${found_npm}" ]; then
      found_npm=${npm_path}
      found_node=${node_path}
    fi
  else
    fail "missing or not executable ${npm_path}"
  fi
done
echo ""

echo "--- 3) Is npm already on PATH? ---"
if command -v npm >/dev/null 2>&1; then
  path_npm=$(command -v npm)
  pass "PATH npm is ${path_npm}"
  if [ -z "${found_npm}" ]; then
    found_npm=${path_npm}
  fi
else
  fail "npm is not on PATH"
fi

if command -v node >/dev/null 2>&1; then
  path_node=$(command -v node)
  pass "PATH node is ${path_node}"
  if [ -z "${found_node}" ]; then
    found_node=${path_node}
  fi
else
  fail "node is not on PATH"
fi
echo ""

echo "--- 4) Can npm and node actually run? ---"
if [ -n "${found_npm}" ]; then
  if npm_version=$("${found_npm}" -v 2>&1); then
    pass "npm runs: ${found_npm} -> ${npm_version}"
  else
    fail "npm exists at ${found_npm} but cannot execute: ${npm_version}"
    found_npm=""
  fi
else
  fail "no npm binary to execute"
fi

if [ -n "${found_node}" ] && [ -x "${found_node}" ]; then
  if node_version=$("${found_node}" -v 2>&1); then
    pass "node runs: ${found_node} -> ${node_version}"
  else
    fail "node exists at ${found_node} but cannot execute: ${node_version}"
    found_node=""
  fi
else
  fail "no node binary to execute"
fi
echo ""

echo "===== result ====="
echo "OK checks: ${ok_count}"
echo "FAIL checks: ${fail_count}"
echo ""

if [ -n "${found_npm}" ] && [ -n "${found_node}" ]; then
  echo "SUCCESS: this environment can use npm."
  echo "Use the full path like a normal command:"
  echo "  ${found_node} -v"
  echo "  ${found_npm} -v"
  echo "  ${found_npm} install"
  echo "  ${found_npm} run build"
  echo ""
  echo "Optional: put it on PATH for this shell session:"
  echo "  export PATH=\"$(dirname "${found_npm}"):\$PATH\""
  echo "  npm -v"
  exit 0
fi

echo "NO ACCESS: npm cannot run in this environment."
echo "Common cause: Plesk Git deploy runs in a chroot without /opt/plesk/node."
echo "Try the same script from SSH or Plesk Node.js -> Run script."
exit 1
