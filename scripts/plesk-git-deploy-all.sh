#!/bin/bash
# Wrapper kept for compatibility. Prefer:
#   /bin/bash scripts/plesk-git-deploy-full.sh
SCRIPT_DIR=$(dirname "$0")
/bin/bash "${SCRIPT_DIR}/plesk-git-deploy-full.sh"
