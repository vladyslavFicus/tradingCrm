server {
  server_name _;
  root /opt/build;

  location ^~ /api {
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_set_header Host $http_host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $proxy_connection;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $proxy_x_forwarded_proto;
    proxy_set_header X-Forwarded-Ssl $proxy_x_forwarded_ssl;
    proxy_set_header X-Forwarded-Port $proxy_x_forwarded_port;
    proxy_pass http://gateway:80;
  }

  location /health {
    try_files /../health.json =503;
  }

  location /log {
    proxy_pass       {{logstashUrl}};
    proxy_set_header Host      $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(?:manifest|appcache|html?|xml|json)$ {
    expires -1;
    #access_log logs/static.log;
  }

  location ~* \.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc)$ {
    expires 1M;
    access_log off;
    add_header Cache-Control "public";
  }

  location ~* \.(?:css|js)$ {
    expires 1m;
    access_log off;
    add_header Cache-Control "public";
  }
}
