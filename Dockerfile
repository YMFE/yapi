FROM node:14 as builder
LABEL maintainer="zzcheng.me"

# RUN apt-get update && apt-get install -y git python make openssl tar gcc \
#     && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN mkdir vendors

COPY package.json package-lock.json /app/vendors/
# RUN cd /app/vendors && npm install
COPY . /app/vendors
# RUN cd /app/vendors && npm run build-client
COPY config.json /app/

EXPOSE 3000

CMD ["node", "/app/vendors/server/app.js"]

