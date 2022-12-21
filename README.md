# NAS Forex Backoffice


## Build project

1. ```yarn```
2. ```yarn build```
3. ```docker build -t forex/backoffice .```
4. ```docker run -e NAS_PROJECT="${PROJECT_NAME}"  -p 80:80 -v /local/path/to/config/application.yml:/backoffice/lib/etc/application-${ENVIRONMENT_NAME}.yml forex/backoffice```
