#!/bin/bash
filename="/opt/build/.nasbuildenv"
err_count=0


if ! [ -z $1 ]
then
  FILE=$1"/"$2
else
  FILE="/opt/build/config.js"
fi

echoerr() { echo "$@" 1>&2; }

if ! [ -f $FILE ];
then
   touch $FILE
fi

echo "window.NAS = {" > $FILE

while read -r line
do
    if ! [[ $line =~  ^#.*$ ]]
      then
        if [ -z "$(printenv $line)" ]
        then
          echoerr "Has errors: $line"
          rm $FILE
          exit;
        else
          echo "  \"$line\":\"$(printenv $line)\"," >> $FILE
        fi
    fi
done < "$filename"

echo "}" >> $FILE
