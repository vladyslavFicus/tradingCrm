#!/bin/bash
set -e

cd /opt/docker/ && npm install
node /opt/docker/run.js

$(which nginx) -g "daemon off;"
