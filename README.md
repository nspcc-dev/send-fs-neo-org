<p align="center">
<img src="./.github/logo.svg" width="500px" alt="NeoFS">
</p>
<p align="center">
  <a href="https://fs.neo.org">NeoFS</a> is a decentralized distributed object storage integrated with the <a href="https://neo.org">Neo Blockchain</a>.
</p>

---
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/nspcc-dev/send-fs-neo-org?sort=semver)
![License](https://img.shields.io/github/license/nspcc-dev/send-fs-neo-org.svg?style=popout)

![Demo](./.github/demo.png)

# Overview

Send.NeoFS is a simple example of integration with NeoFS network via HTTP protocol. It allows to store your files in decentralized network for the selected period of time and share them via generated link. Send.NeoFS should be used for NeoFS public test only.

# Requirements

- docker
- make
- node (`18+`)

# Make instructions

* Compile the build using `make` (will be generated in `send.fs.neo.org` dir)
* Start app using `make start PORT=3000` (PORT=3000 by default)
* Clean up cache directories using `make clean`
* Get release directory with tar.gz using `make release`

Set variables in the `.env` file before executing the commands:
- `VITE_NEOFS` - Path to SendFS

# Send.NeoFS local up

 - Start [neofs-dev-env](https://github.com/nspcc-dev/neofs-dev-env)
 - Update `.env`
 - Execute `npm install`
 - Run local `npm run build`

# Deployment to production

Two containers are used, one to store website data and another to store
uploaded content. Then nginx is set up to use both for a single website.

 - Create container: `neofs-cli --rpc-endpoint st1.storage.fs.neo.org:8080 --config CONFIG_PATH container create --policy 'REP 2 IN X CBF 1 SELECT 4 FROM F AS X FILTER "Deployed" EQ "NSPCC" AS F' --basic-acl public-read --await`

CONFIG_PATH – path to wallet config, wallet config example:
```
wallet: test.json
address: NWuFifWC3F5R9hY3xHyy9UvAAKxGgZfp4W
password: <secret>
```
 - Update `/bin/upload.py` script with actual `cid`
 - Run `make`
 - Untar archive to separate dir
 - Copy `/bin/upload.py` to dir
 - Run `upload.py` to put send.fs to the NeoFS container
 - Create data container: `neofs-cli container create -r st1.storage.fs.neo.org:8080 --config CONFIG_PATH --basic-acl 0X0fbfbfff --policy 'REP 2 IN X CBF 2 SELECT 2 FROM F AS X FILTER Deployed EQ NSPCC AS F' --await`
 - Create EACL for it: `neofs-cli acl extended create --cid DATA_CID -r 'deny put others' -r 'deny delete others' --out eacl.json`
 - Set EACL for data container: `neofs-cli container set-eacl -r st1.storage.fs.neo.org:8080 --cid DATA_CID --table eacl.json --config CONFIG_PATH --await`
 - Update nginx.config to use new container in the production server

# Nginx config example on the production server

```Nginx
proxy_cache_path /srv/neofs_cache/ levels=1:2 keys_zone=neofs_cache:50m max_size=16g inactive=60m use_temp_path=off;

server {
	set $cid 7CpJVtBdNvPjjdYwV7q9CghGVPagVLTs71BPQuGQLKSQ;
	set $data_cid 754iyTDY8xUtZJZfheSYLUn7jvCkxr79RcbjMt81QykC;
	set $neofs_rest_gateway https://rest.fs.neo.org;
	set $rpc rpc.morph.fs.neo.org:40341;
	client_max_body_size 100m;
	proxy_connect_timeout 5m;
	proxy_send_timeout    5m;
	proxy_read_timeout    5m;
	send_timeout          5m;
	default_type application/octet-stream;

	location ~ "^\/chain" {
		rewrite ^/chain/(.*) /$1 break;
		proxy_pass https://rpc;
		proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504 http_403 http_429 non_idempotent;
	}

	location /gate/objects/ {
		rewrite ^/gate/(.*) /v1/objects/$data_cid break;
		proxy_pass $neofs_rest_gateway;
		proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504 http_403 http_429;
		proxy_pass_request_headers on;
	}

	location /gate/upload/ {
		rewrite ^/gate/(.*) /v1/upload/$data_cid break;
		proxy_pass $neofs_rest_gateway;
		proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504 http_403 http_429;
		proxy_pass_request_headers on;
		proxy_set_header X-Attribute-email $http_x_attribute_email;
		proxy_set_header X-Attribute-NEOFS-Expiration-Epoch $http_x_attribute_neofs_expiration_epoch;
	}

	location ~ "^\/gate\/get(/.*)?\/?$" {
		rewrite ^/gate/get/(.*) /v1/get/$data_cid/$1 break;
		proxy_pass $neofs_rest_gateway;
		proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504 http_403 http_429;

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
		proxy_set_header Host              $http_host;
		proxy_set_header X-Real-IP         $remote_addr;
		proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}

	location /signup_github/ {
		proxy_pass http://localhost:8084/login?service=github;
		proxy_intercept_errors on;
		proxy_buffering on;
		proxy_set_header Host              $http_host;
		proxy_set_header X-Real-IP         $remote_addr;
		proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}

	location ~ "^\/callback" {
		rewrite ^/callback\?(.*) /$1 break;
		proxy_pass http://localhost:8084;
	}

	location /load {
		rewrite '^(/.*)$' /v1/objects/$cid/by_attribute/FileName/index.html break;
		proxy_pass $neofs_rest_gateway;
		proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504 http_403 http_429;
		include /etc/nginx/mime.types;
	}

	location /toc {
		rewrite '^(/.*)$' /v1/objects/$cid/by_attribute/FileName/index.html break;
		proxy_pass $neofs_rest_gateway;
		proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504 http_403 http_429;
		include /etc/nginx/mime.types;
	}

	location / {
		proxy_pass https://$neofs_rest_gateway;
	}
}
```

# License

- [GNU General Public License v3.0](LICENSE)
