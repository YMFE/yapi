#!/usr/bin/env bash

set -x
myapi=/opt/yapi/my-yapi
vendors=$myapi/vendors

yapifun(){
    mflg=`test -d $vendors && echo "true" || echo "false"`
    if $mflg
    then
        echo "vendors 目录存在执行　node "
        cd $myapi
        node vendors/server/app.js 
    else
        echo "vendors 目录不存在执行yapi server "
        yapi server
    fi
}

yapifun
