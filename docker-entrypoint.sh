#!/bin/bash
set -eo pipefail
shopt -s nullglob

MY_PORT="${MY_PORT:=3000}"
MY_ACOUNT="${MY_ACOUNT:=zzcheng.me@gmail.com}"
MY_DB_SERVER="${MY_DB_SERVER:=apps.danlu.netease.com}"
MY_DB_NAME="${MY_DB_NAME:=admin}"
MY_DB_PORT="${MY_DB_PORT:=15091}"
MY_USER="${MY_USER:=admin}"
MY_PASS="${MY_PASS:=123456mongoD}"
MY_AUTH="${MY_AUTH:=admin}"

config() {
    if [[ -z "${MY_PORT}" || -z "${MY_ACOUNT}" || -z "${MY_DB_SERVER}" || -z "${MY_DB_NAME}" || -z "${MY_DB_PORT}" || -z "${MY_USER}" || -z "${MY_PASS}" || -z "${MY_AUTH}" ]]; then
        echo -e "\n\"MY_PORT\" or \"MY_ACOUNT\" or \"MY_DB_SERVER\" or \"MY_DB_NAME\" or \"MY_DB_PORT\" or \"MY_USER\" or \"MY_PASS\" or \"MY_AUTH\" can not be empty!\n" && exit 1
    else
        sed -i "s#MY_PORT#${MY_PORT}#g"             /app/config.json
        sed -i "s#MY_ACOUNT#${MY_ACOUNT}#g"         /app/config.json
        sed -i "s#MY_DB_SERVER#${MY_DB_SERVER}#g"         /app/config.json
        sed -i "s#MY_DB_NAME#${MY_DB_NAME}#g"         /app/config.json
        sed -i "s#MY_DB_PORT#${MY_DB_PORT}#g"         /app/config.json
        sed -i "s#MY_USER#${MY_USER}#g"         /app/config.json
        sed -i "s#MY_PASS#${MY_PASS}#g"         /app/config.json
        sed -i "s#MY_AUTH#${MY_AUTH}#g"         /app/config.json
    
    fi
}

config

node /app/vendors/server/app.js

exec "$@"
