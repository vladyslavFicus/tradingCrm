FROM nginx
RUN apt-get update && apt-get install -y curl jq

RUN mkdir /etc/nginx/logs && touch /etc/nginx/logs/static.log

ENV BUILD_PATH /opt/build

RUN mkdir -p $BUILD_PATH
WORKDIR $BUILD_PATH

ADD ./dist $BUILD_PATH
ADD ./nginx.conf /etc/nginx/conf.d/default.conf

ADD ./entrypoint.sh /opt/entrypoint.sh

RUN chmod +x /opt/entrypoint.sh

ENTRYPOINT ["/opt/entrypoint.sh"]

EXPOSE 80
