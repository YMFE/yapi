#!/bin/bash

prog="/var/soft/node-v6.11.1-linux-x64/bin/pm2"
app="/home/q/www/yapi.beta.corp.qunar.com/webapp/server_dist/app.js"



start() {
    echo "Starting Server..."
    eval "$prog start $app --name=yapi"
}

stop() {
    echo "Stopping Server..."
    eval "$prog stop yapi"
}

restart() {
    echo "Restart Server..."
    eval "$prog restart yapi"
}




case "$1" in
start)
start && exit 0
;;
stop)
stop || exit 0
;;
restart)
restart || exit 0
;;
*)
echo $"Usage: $0 {start|stop|restart}"
exit 2
esac