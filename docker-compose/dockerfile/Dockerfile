FROM mongo:5.0-focal
#### 镜像来源
###      https://hub.docker.com/
####
LABEL maintainer "yxh <xianhe_yan@sina.com>"
USER root
RUN apt-get -y update && \
    apt-get install -y net-tools nodejs npm && \
    rm -rf /var/lib/apt/lists/*
RUN npm config set registry https://registry.npm.taobao.org && \
    npm install -g yapi-cli --registry https://registry.npm.taobao.org

WORKDIR /data/yapi
ADD  ./yapi_start.sh /yapi_start.sh
EXPOSE 9090
EXPOSE 3000

