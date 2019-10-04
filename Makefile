HUB_IMAGE=nspccdev/neofs
VERSION=0.0.4
PREFIX=-pre

B=\033[0;1m
G=\033[0;92m
R=\033[0m

.DEFAULT_GOAL := help
.PHONY: build-image publish-image

build-image:
	@echo "${B}${G}⇒ Build DropIn WebUI image ${R}"
	@docker build \
		 -f Dockerfile \
		 -t $(HUB_IMAGE)-drop-ui:$(VERSION)$(PREFIX) .

publish-image:
	@echo "${B}${G}⇒ Publish DropIn WebUI image ${R}"
	@docker push $(HUB_IMAGE)-drop-ui:$(VERSION)$(PREFIX)

help:
	@echo "${B}${G}⇒ build-image   Build image for publish ${R}"
	@echo "${B}${G}⇒ publish-image Publish image for publish ${R}"
