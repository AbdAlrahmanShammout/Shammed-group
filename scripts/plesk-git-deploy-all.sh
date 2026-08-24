#!/bin/bash
SCRIPT_DIR=$(dirname "$0")

/bin/bash "${SCRIPT_DIR}/plesk-git-deploy.sh"
/bin/bash "${SCRIPT_DIR}/plesk-git-deploy-frontend.sh"

echo Full deploy finished
