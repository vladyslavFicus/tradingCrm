#!/usr/bin/env sh

node /opt/docker/run.js

$(which nginx) -g "daemon off;"

exec "$@"
