#!/bin/bash
set -e

retryNumber=1
retry=10
sleepTime=5
responseCode=0
CONFIG_PATH="$CONFIG_SERVICE_ROOT/backoffice/$BUILD_ENV"

while [ "$retryNumber" -le "$retry" ]; do
  echo "Retry: $retryNumber, Sleep: $sleepTime"
  echo "Fetching config status: #$retryNumber"
  responseCode=$(curl -s -o /dev/null -w "%{http_code}" ${CONFIG_PATH} | cat)
  echo "Response code: $responseCode"
  ((retryNumber+=1))
  ((sleepTime+=5))
  if [ "$responseCode" -ne "200" ]
  then
    sleep $sleepTime
  else
    break
  fi
done

config=$(curl -s $CONFIG_PATH | jq -a -r -S 'reduce .propertySources[].source as $item ({}; . + $item)' | cat)

if [ -z "$config" ]; then
  echo "Stopping service because service cannot fetch config." >&2
  exit 1
fi

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
