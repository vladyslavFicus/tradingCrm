FROM registry.flcn.pro/addons/frontend:1.0.0

RUN mkdir /etc/nginx/logs && touch /etc/nginx/logs/static.log

ENV PORT 9090
ENV BUILD_PATH /opt/build
ENV NGINX_CONF_OUTPUT /etc/nginx/conf.d/default.conf

RUN mkdir -p $BUILD_PATH
WORKDIR $BUILD_PATH

ADD ./build $BUILD_PATH
ADD ./entrypoint.sh /opt/entrypoint.sh

COPY ./.npmrc /opt/docker/
COPY ./docker/ /opt/docker/
COPY ./docker/nginx.conf $NGINX_CONF_OUTPUT

RUN cd /opt/docker && yarn && chmod +x /opt/entrypoint.sh

ENTRYPOINT ["/opt/entrypoint.sh"]

EXPOSE $PORT
