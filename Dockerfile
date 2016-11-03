FROM nginx
RUN mkdir /etc/nginx/logs && touch /etc/nginx/logs/static.log

ENV BUILD_PATH /opt/build

RUN mkdir -p $BUILD_PATH
WORKDIR $BUILD_PATH

ADD ./dist $BUILD_PATH
ADD ./nginx.conf /etc/nginx/conf.d/default.conf

ADD ./bin/generate_config.sh /opt/generate_config.sh
ADD ./entrypoint.sh /opt/entrypoint.sh
ADD ./.nasbuildenv $BUILD_PATH/.nasbuildenv

RUN chmod +x /opt/generate_config.sh
RUN chmod +x /opt/entrypoint.sh

ENTRYPOINT ["/opt/entrypoint.sh"]

EXPOSE 80
