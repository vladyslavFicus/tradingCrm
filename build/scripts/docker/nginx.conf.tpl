server {
  client_max_body_size 0;
  listen 9090;

  server_name _;
  root /opt/build;

  set $current_hrzn_version "{{version}}";

  location /api/ {

    set $need_upgrade 0;

    if ($http_x_hrzn_version != $current_hrzn_version) {
        set $need_upgrade 1;
    }

    if ($request_method = OPTIONS) {
        set $need_upgrade 0;
    }

    if ($need_upgrade = 1) {
        return 426;
    }

    resolver 127.0.0.11 valid=15s;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_pass http://gateway/;
  }

  location /health {
    try_files /../health.json =503;
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
