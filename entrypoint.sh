#!/bin/sh
set -e

node /opt/docker/run.js &

$(which openresty) -g "daemon off;"
