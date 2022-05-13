FROM node:12
#### 镜像来源
###      https://hub.docker.com/
####
LABEL maintainer "yxh <xianhe_yan@sina.com>"
RUN npm config set registry https://registry.npm.taobao.org && \
    npm install -g yapi-cli --registry https://registry.npm.taobao.org
RUN mkdir -p /opt/yapi
WORKDIR /opt/yapi
ADD  ./yapi_start.sh /yapi_start.sh
EXPOSE 9090
EXPOSE 3000

