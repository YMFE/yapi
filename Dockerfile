FROM node:12-alpine
ENV TZ="Asia/Shanghai"
# 使用阿里云镜像
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
WORKDIR /yapi/vendors
COPY . /yapi/vendors/

RUN apk add --no-cache wget python make && cd /yapi/vendors && npm set strict-ssl false 
RUN npm install --production --registry https://registry.npm.taobao.org

EXPOSE 3000
ENTRYPOINT ["node"]