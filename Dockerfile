FROM registry.newage.io/newage/frontend:1.0.0

RUN mkdir /etc/nginx/logs && touch /etc/nginx/logs/static.log

ENV BUILD_PATH /opt/build
ENV NGINX_CONF_OUTPUT /etc/nginx/conf.d/default.conf

RUN mkdir -p $BUILD_PATH
WORKDIR $BUILD_PATH

ADD ./dist $BUILD_PATH

ADD ./entrypoint.sh /opt/entrypoint.sh
COPY ./build/scripts/docker/* /opt/docker/

RUN chmod +x /opt/entrypoint.sh

ENTRYPOINT ["/opt/entrypoint.sh"]

HEALTHCHECK CMD curl --fail http://localhost:9090/health || exit 1

EXPOSE 9090
