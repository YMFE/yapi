FROM node
WORKDIR /tools/yapi/
RUN wget http://registry.npm.taobao.org/yapi-vendor/download/yapi-vendor-1.5.6.tgz &&\
tar -zxvf *.tgz && mv  package  vendors && rm -rf *.tgz
WORKDIR /tools/yapi/vendors
RUN npm install -g yapi-cli --registry https://registry.npm.taobao.org  && npm install
EXPOSE 3000
ENTRYPOINT ["node", "server/app.js"]

