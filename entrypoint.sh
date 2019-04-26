#!/usr/bin/env sh

pm2 start /opt/docker/run.js

$(which nginx) -g "daemon off;"

exec "$@"
