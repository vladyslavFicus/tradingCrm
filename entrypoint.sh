#!/bin/bash
set -e

node /opt/startup.js

$(which nginx) -g "daemon off;"
