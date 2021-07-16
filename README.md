## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Send.FS local up
 - Start neofs-dev-env
 - Update `src/environments/environment.ts`
 - Execute `npm install`
 - Run local server `ng serve --proxy-config proxy.conf.js`

## Deployment to prod

This procedure has been prepared as fast solution and will be updated in future.
Given the automation of deployments through ansible, this procedure has no priority.

 - Create container: `neofs-cli --rpc-endpoint st1.storage.fs.neo.org:8080 --wif Kxp5YtFG75xEGKzUu3Asn5bb5UN4iqvfNycatvfDcwBYq3S3X996 container create --policy 'REP 2 IN X CBF 1 SELECT 4 FROM F AS X FILTER "Deployed" EQ "NSPCC" AS F' --basic-acl public-read --await`
 - Update `/bin/upload.py` script with actual `cid`
 - Run `make`
 - Untar archive to separate dir
 - Copy `/bin/upload.py` to dir
 - Run `upload.py` to put send.fs to the NeoFS container
 - Update nginx.config to use new container in the prod server

## nginx config example on the prod server

```
# Please do not change this file directly since it is managed by Ansible and will be overwritten

# nginx server configuration for:
#    - https://send.fs.neo.org/

server {

        listen [::]:443 ssl http2;
        

        ssl_certificate           /etc/nginx/ssl/send.fs.neo.org.crt;
        ssl_certificate_key       /etc/nginx/ssl/send.fs.neo.org.key;
        ssl_protocols             TLSv1.1 TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers               "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:ECDHE-RSA-RC4-SHA:ECDHE-ECDSA-RC4-SHA:AES128:AES256:RC4-SHA:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!3DES:!MD5:!PSK"; # TLS cipher suites set: mozilla
        ssl_dhparam               /etc/pki/dhparam/set0;
        ssl_ecdh_curve            secp384r1;
        ssl_stapling              on;
        resolver                  67.207.67.2 67.207.67.3 valid=300s;
        resolver_timeout          5s;
        add_header                Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
        add_header                Content-Security-Policy "frame-ancestors 'none';";
        add_header                X-Content-Type-Options "nosniff" always;
        add_header                X-Frame-Options "DENY" always;
        add_header                X-XSS-Protection "1; mode=block";
        add_header                Referrer-Policy "same-origin";

        server_name send.fs.neo.org;

        root /srv/www/sites/send.fs.neo.org/v0.2.0;

        keepalive_timeout 60;

        access_log /var/log/nginx/send.fs.neo.org-https_access.log;
        error_log /var/log/nginx/send.fs.neo.org-https_error.log;
        index index.html index.htm;

        if (-f $document_root/maintenance.html) {
                return 503;
        }
        error_page 503 @maintenance;
        location @maintenance {
                rewrite ^(.*)$ /maintenance.html break;
        }

        client_body_buffer_size     10K;
        client_header_buffer_size   1k;
        client_max_body_size        100m;
        large_client_header_buffers 2 1k;
        proxy_connect_timeout       300;
        proxy_send_timeout          300;
        proxy_read_timeout          300;
        send_timeout                300;
        default_type application/octet-stream;


        # Disallow access to hidden files and directories, except `/.well-known/`
        # https://www.mnot.net/blog/2010/04/07/well-known
        # https://tools.ietf.org/html/rfc5785
        location ~ /\.(?!well-known/) {
                return 404;
        }

        location = /favicon.ico {
                try_files /favicon.ico =204;
                access_log off;
                log_not_found off;
        }

        location = /nginx_status {
                stub_status on;
                access_log off;
                allow 127.0.0.1/32;
                allow ::1/128;
                allow 178.62.211.89;
                allow 10.18.0.6;
                allow 10.110.0.2;
                allow 172.17.0.1;
                deny all;
        }


        location ~ "^\/chain" {
                rewrite ^/chain/(.*) /$1 break;
                proxy_pass https://rpc1.morph.fs.neo.org:40341;
        }

        location /gate/upload/ {
                rewrite  ^/gate/(.*) /$1 break;
                proxy_pass https://http.fs.neo.org;
                proxy_pass_request_headers      on;
                proxy_set_header X-Attribute-Email $http_x_attribute_email;
                proxy_set_header X-Attribute-NEOFS-Expiration-Epoch $http_x_attribute_neofs_expiration_epoch;
                proxy_set_header X-Attribute-Owner-Email $http_x_attribute_owner_email;                

        }

        location ~ "^\/gate\/get(/.*)?\/?$" {
                rewrite  ^/gate/get/(.*) /$1 break;
                proxy_pass https://http.fs.neo.org;
          
                proxy_intercept_errors on;
                proxy_cache_valid 404 0;
                proxy_cache_valid 200 15m;
                proxy_buffering on;
                proxy_cache neofs_cache;
                proxy_cache_methods GET;
        }

 


        location /signup_google/ {
                proxy_pass http://localhost:8084/login?service=google;
                proxy_intercept_errors on;
                proxy_buffering on;
                proxy_set_header Host                 $http_host;
                proxy_set_header X-Real-IP            $remote_addr;
                proxy_set_header X-Forwarded-For      $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto    $scheme;
        }

        location /signup_github/ {
                proxy_pass http://localhost:8084/login?service=github;
                proxy_intercept_errors on;
                proxy_buffering on;
                proxy_set_header Host                 $http_host;
                proxy_set_header X-Real-IP            $remote_addr;
                proxy_set_header X-Forwarded-For      $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto    $scheme;
        }

        location ~ "^\/callback" {
               rewrite ^/callback\?(.*) /$1 break;
               proxy_pass http://localhost:8084;


        }

        location /load {
                set $cid HPUKdZBBtD75jDN8iVb3zoaNACWinuf1vF5kkYpMMbap;
                rewrite '^(/.*)$'                       /get_by_attribute/$cid/FileName/index.html break;
                proxy_pass https://http.fs.neo.org/;
                include             /etc/nginx/mime.types;
        }

        location /toc {
                set $cid HPUKdZBBtD75jDN8iVb3zoaNACWinuf1vF5kkYpMMbap;
                rewrite '^(/.*)$'                       /get_by_attribute/$cid/FileName/index.html break;
                proxy_pass https://http.fs.neo.org/;
                include             /etc/nginx/mime.types;
        }


        location / {
                set $cid HPUKdZBBtD75jDN8iVb3zoaNACWinuf1vF5kkYpMMbap;

                rewrite '^(/[0-9a-zA-Z\-]{43,44})$' /get/$cid/$1 break;
                #rewrite '^/load'                   /get_by_attribyre/$cid/FileName/index.html break;
                rewrite '^/$'                       /get_by_attribute/$cid/FileName/index.html break;
                rewrite '^/([^/]*)$'                /get_by_attribute/$cid/FileName/$1 break;
                rewrite '^(/.*)$'                   /get_by_attribute/$cid/FilePath/$1 break;

                proxy_pass https://http.fs.neo.org/;
                include             /etc/nginx/mime.types;
        }

}


```