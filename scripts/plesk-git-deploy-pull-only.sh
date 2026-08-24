#!/bin/bash
# Plesk Git on this host runs in a chroot jail:
# - /httpdocs is visible
# - /opt/plesk/node is NOT visible
# So automatic npm build cannot run from Git hooks.
# Use this as the only "additional deployment actions" line:
#   /bin/bash scripts/plesk-git-deploy-pull-only.sh

REPO_ROOT=$(pwd)
LOGFILE=${REPO_ROOT}/deploy.log

{
  echo ""
  echo "===== pull-only deploy $(date) ====="
  echo "cwd=${REPO_ROOT}"
  echo "Git file sync completed."
  echo "Build cannot run here: /opt/plesk/node is outside the Git chroot."
  echo "Next steps:"
  echo "  1) Backend: Node.js panel -> NPM install -> Run script: generate -> build -> Restart App"
  echo "  2) Frontend: build on your Mac, upload frontend/dist/* to /httpdocs"
} | tee -a "${LOGFILE}"

exit 0
