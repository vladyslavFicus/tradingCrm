# NAS Casino Backoffice


## Build project

1. ```yarn```
2. ```yarn build```
3. ```docker build -t casino/backoffice .```
4. ```docker run -e NAS_ENV="${ENVIRONMENT_NAME}" -p 80:80 -v /local/path/to/config/application.yml:/backoffice/lib/etc/application-${ENVIRONMENT_NAME}.yml casino/backoffice```
