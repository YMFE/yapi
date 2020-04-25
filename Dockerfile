FROM node:12-alpine as builder

RUN apk add --no-cache git python make openssl tar gcc

COPY . /api/vendors

RUN cd /api/vendors && \
    npm install --production --registry https://registry.npm.taobao.org

FROM node:12-alpine

MAINTAINER huangxb0512@gmail.com

ENV TZ="Asia/Shanghai" HOME="/"

WORKDIR ${HOME}

COPY --from=builder /api/vendors /api/vendors

COPY config_example.json /api/config.json

EXPOSE 3000

ENTRYPOINT ["node"]