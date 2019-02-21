#!/bin/sh
set -e

node /opt/docker/run.js

$(which nginx) -g "daemon off;"
