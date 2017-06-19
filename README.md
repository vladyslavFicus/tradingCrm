# NAS Casino Backoffice


## Build project

1. ```yarn build```
2. ```docker build -t casino/backoffice .```
3. ```docker run -e CONFIG_SERVICE_ROOT="http://10.171.106.109:9090" -e BUILD_ENV="hrzn_dev2" -p 80:80 -v /local/path/to/config/application.yml:/backoffice/lib/etc/application-${ENVIRONMENT_NAME}.yml casino/backoffice```
