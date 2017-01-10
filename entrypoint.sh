#!/bin/bash
set -e

config=$(curl -s http://config:9090/backoffice/$BUILD_ENV  | jq '.propertySources[0] | .source' | cat)

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

echo "window.nas = $config;" >> $FILE

$(which nginx) -g "daemon off;"
