#!/bin/bash
set -e

config=$(curl -s $CONFIG_SERVICE_ROOT/backoffice/$BUILD_ENV \
    --connect-timeout 5 \
    --max-time 10 \
    --retry 5 \
    --retry-delay 0 \
    --retry-max-time 60 | jq -a -r -S 'reduce .propertySources[].source as $item ({}; . + $item)' | cat)

if ! [ -z $1 ]
then
  FILE=$1"/"$2
else
  FILE="/opt/build/config.js"
fi

if ! [ -f $FILE ];
then
   touch $FILE
fi

echo "window.nas = $config;" > $FILE

$(which nginx) -g "daemon off;"
