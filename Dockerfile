FROM node:12-alpine as builder

RUN apk add --no-cache python3 make
RUN mkdir -p /yapi/builder
COPY . /yapi/builder
WORKDIR /yapi/builder
RUN cd /yapi/builder \
    && npm install --production


FROM node:12-alpine
ENV TZ="Asia/Shanghai"
ENV YAPI_HOME="/yapi/vendors"

WORKDIR ${YAPI_HOME}
COPY --from=builder /yapi/builder ${YAPI_HOME}
RUN chmod a+x ${YAPI_HOME}/startup.sh

EXPOSE 3000

CMD [ "start" ]

ENTRYPOINT [ "./startup.sh" ]
