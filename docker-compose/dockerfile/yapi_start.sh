#!/usr/bin/env bash

set -x
vendors=/data/yapi/my-yapi/vendors

checkmgfun(){
    mgPID=`netstat -tlpn | grep 27017`
    if [ "$mgPID" != "" ];
    then
        echo "假设根据vendors是否存执行具体脚本"
        yapifun
    else
        nohup mongod --bind_ip_all > /data/runmongod.log 2>&1 &
        sleep 3
        yapifun
    fi
}

yapifun(){
    mflg=`test -d $vendors && echo "true" || echo "false"`
    if $mflg
    then
        echo "vendors 目录存在执行　node "
        cd $vendors
        node ./server/app.js 
    else
        echo "vendors 目录不存在执行yapi server "
        yapi server
    fi
}

checkmgfun
