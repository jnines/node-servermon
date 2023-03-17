#!/bin/sh
PUID=$(printenv PUID)
PGID=$(printenv PGID)
nodeGroup='node'
nodeUser=$(grep -c node /etc/passwd)
userGroup=$(grep -c "${PGID}" /etc/group)
if  [ "$nodeUser" -eq 0 ] && [ "$userGroup" -eq 0 ]; then
  addgroup -g "${PGID}" -S node && adduser -S -u "${PUID}" node -G "$nodeGroup"
fi
if [ "$userGroup" -eq 1 ]; then
  nodeGroup=$(getent group "${PGID}" | awk -F ':' '{print $1}')
  adduser -S -u "${PUID}" node -G "${nodeGroup}"
fi
cp -rn /defaults/* /config/
chown -R node:"$nodeGroup" /app /config
su node
NODE_EXTRA_CA_CERTS=/config/cert/"$(printenv SELFSIGNEDCERT)" node /app/server.js