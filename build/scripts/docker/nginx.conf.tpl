server {
  server_name _;
  root /opt/build;

  location /health {
    try_files /../health.json =503;
  }

  location /log {
    proxy_pass       {{logstashUrl}};
    proxy_set_header Host      $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location /api {
      proxy_pass       http://gateway/;
      proxy_set_header Host      $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header X-NginX-Proxy true;
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
