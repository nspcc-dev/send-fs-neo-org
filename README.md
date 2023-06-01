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
- node (`14+`)

# Make instructions

* Compile the build using `make` (will be generated in `send.fs.neo.org` dir)
* Start app using `make start PORT=3000` (PORT=3000 by default)
* Clean up cache directories using `make clean`
* Get release directory with tar.gz using `make release`

Set variables in the `.env` file before executing the commands:
- `REACT_APP_NEOFS` - Path to SendFS
- `REACT_APP_CONTAINER_ID` - NeoFS container ID where the objects would be stored
- `REACT_APP_NETMAP_CONTRACT` - NeoFS netmap contract

# Send.NeoFS local up

 - Start [neofs-dev-env](https://github.com/nspcc-dev/neofs-dev-env)
 - Update `.env`
 - Execute `npm install`
 - Run local `npm start`

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
	set $cid HPUKdZBBtD75jDN8iVb3zoaNACWinuf1vF5kkYpMMbap;
	set $data_cid 41tVWBvQVTLGQPHBmXySHsJkcc6X17i39bMuJe9wYhAJ;
	set $neofs_http_gateway http.fs.neo.org;
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
	}
	
	location /gate/upload/ {
		rewrite ^/gate/(.*) /upload/$data_cid break;
		proxy_pass https://$neofs_http_gateway;
		proxy_set_header X-Attribute-email $http_x_attribute_email;
		proxy_set_header X-Attribute-NEOFS-Expiration-Epoch $http_x_attribute_neofs_expiration_epoch;
	}
	
	location ~ "^\/gate\/get(/.*)?\/?$" {
		rewrite ^/gate/get/(.*) /$data_cid/$1 break;
		proxy_pass https://$neofs_http_gateway;
		proxy_intercept_errors on;
		proxy_cache_valid 404 0;
		proxy_cache_valid 200 15m;
		proxy_cache neofs_cache;
		proxy_cache_methods GET;
	}
	
	location /signup_google/ {
		proxy_pass http://localhost:8084/login?service=google;
		proxy_intercept_errors on;
		proxy_set_header Host              $http_host;
		proxy_set_header X-Real-IP         $remote_addr;
		proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
	
	location /signup_github/ {
		proxy_pass http://localhost:8084/login?service=github;
		proxy_intercept_errors on;
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
		rewrite '^(/.*)$' /get_by_attribute/$cid/FileName/index.html break;
		proxy_pass https://$neofs_http_gateway;
	}
	
	location /toc {
		rewrite '^(/.*)$' /get_by_attribute/$cid/FileName/index.html break;
		proxy_pass https://$neofs_http_gateway;
	}
	
	location / {
		rewrite '^(/[0-9a-zA-Z\-]{43,44})$' /get/$cid/$1 break;
		rewrite '^/$'                       /get_by_attribute/$cid/FileName/index.html break;
		rewrite '^/([^/]*)$'                /get_by_attribute/$cid/FileName/$1 break;
		rewrite '^(/.*)$'                   /get_by_attribute/$cid/FilePath/$1 break;
		proxy_pass https://$neofs_http_gateway;
	}
}
```

# License

- [GNU General Public License v3.0](LICENSE)
