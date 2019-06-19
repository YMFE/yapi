FROM node:9.2-alpine as builder
## NOTE:The yapi.tgz you should download to the local from http://registry.npm.taobao.org/yapi-vendor/download/yapi-vendor-${version}.tgz
ADD yapi.tgz /home/
RUN mkdir /api && mv /home/package /api/vendors
RUN apk add --no-cache git python make openssl tar gcc
RUN cd /api/vendors && \
    npm install --production --registry https://registry.npm.taobao.org

FROM node:9.2-alpine
MAINTAINER jhondge@hotmail.com
ENV TZ="Asia/Shanghai"
WORKDIR /api/
COPY --from=builder /api/vendors /api/vendors
COPY config.json /api/
EXPOSE 3000
ENTRYPOINT ["node"]
