#!/bin/bash
OPT=$1 # start: 后台启动；run：前台启动；
PROJECT_ENV=$2 # development | testing | production

if [[ -z $PROJECT_ENV ]];then
  case $ENVTYPE in
    "test" )    PROJECT_ENV=testing     ;;
    * )         PROJECT_ENV=production  ;;
  esac
fi
#   当前目录即为server目录
BASE_DIR=$(pwd)
PROC_NAME=${BASE_DIR}/server/app.js
NAME_SUFFIXX="\>"

PROC_ID=`ps -ef|grep -i ${PROC_NAME}${NAME_SUFFIXX}|grep -v "grep"|awk '{print $2}'`

case "$OPT" in
  "start" ) # 运行在后台
  if [[ -z $PROC_ID ]];then
    echo "start..."
    sleep 1
    NODE_ENV=${PROJECT_ENV} node ${PROC_NAME} --max-old-space-size=4096 &
    echo ${PROC_NAME} is running:${PROJECT_ENV}
  else
    echo ${PROC_NAME} is running, pid:${PROC_ID[@]}
  fi
  ;;

  "run" ) # 运行在前台
  if [[ -z $PROC_ID ]];then
    echo "start..."
    sleep 1
    NODE_ENV=${PROJECT_ENV} node ${PROC_NAME} --max-old-space-size=4096
    echo ${PROC_NAME} is running:${PROJECT_ENV}
  else
    echo ${PROC_NAME} is running, pid:${PROC_ID[@]}
  fi
  ;;

  "stop" ) # 运行在前台
  if [[ -n $PROC_ID ]];then
    kill -9 ${PROC_ID[@]}
    echo ${PROC_NAME} is stoped
  fi
  ;;

  * )
  echo '[start|run]'
  ;;

esac
