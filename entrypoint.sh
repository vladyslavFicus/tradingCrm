#!/bin/bash
set -e

node /opt/docker/scripts/run.js

$(which nginx) -g "daemon off;"
