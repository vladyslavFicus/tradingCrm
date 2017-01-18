#!/bin/bash
set -e

config=$(curl -s $CONFIG_SERVICE_ROOT/website/$BUILD_ENV  | jq -a -r -S 'reduce .propertySources[].source as $item ({}; . + $item)' | cat)

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
