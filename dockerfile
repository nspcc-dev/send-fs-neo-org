FROM node:12.8.1 as builder

COPY . /src

WORKDIR /src

RUN npm install

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

COPY --from=builder /src/dist/ .
