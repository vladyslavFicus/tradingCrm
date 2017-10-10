#!/bin/bash
set -e

export NAMESERVERS=$(cat /etc/resolv.conf | grep "nameserver" | awk '{print $2}' | tr '\n' ' ')

node /opt/docker/run.js

$(which nginx) -g "daemon off;"
