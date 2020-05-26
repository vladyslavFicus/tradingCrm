#!/bin/sh
set -e

# Set actual image version to nginx.conf
sed -i "s/{{version}}/${APP_VERSION}/g" $NGINX_CONF_OUTPUT

node /opt/docker/run.js &

$(which openresty) -g "daemon off;"
