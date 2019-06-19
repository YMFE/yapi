#!/usr/bin/env bash

echo -e "Begin download the package -> yapi:(version $1)"

wget -O yapi.tgz http://registry.npm.taobao.org/yapi-vendor/download/yapi-vendor-$1.tgz

echo -e "Start build the docker image name:$2"

docker build -t $2 .
