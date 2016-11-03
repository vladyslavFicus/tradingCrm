#!/bin/bash
set -e

/opt/generate_config.sh
$(which nginx) -g "daemon off;"
