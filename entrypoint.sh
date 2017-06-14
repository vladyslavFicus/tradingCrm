#!/bin/bash
set -e

cd /opt/docker/ && yarn
node /opt/docker/run.js

$(which nginx) -g "daemon off;"
