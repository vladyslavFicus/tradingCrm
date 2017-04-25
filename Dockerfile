FROM registry.newage.io/newage/frontend

RUN mkdir /etc/nginx/logs && touch /etc/nginx/logs/static.log

ENV BUILD_PATH /opt/build

RUN mkdir -p $BUILD_PATH
WORKDIR $BUILD_PATH

ADD ./dist $BUILD_PATH
ADD ./nginx.conf /etc/nginx/conf.d/default.conf

ADD ./entrypoint.sh /opt/entrypoint.sh
ADD ./bin/startup.js /opt/startup.js

RUN chmod +x /opt/entrypoint.sh

ENTRYPOINT ["/opt/entrypoint.sh"]

HEALTHCHECK CMD curl --fail http://localhost/health || exit 1

EXPOSE 80
