DOCKER_PARAMS=''
get_arch=`arch`
if [ $get_arch == 'arm64' ] 
then 
  DOCKER_PARAMS='--platform linux/amd64'
fi;
echo $DOCKER_PARAMS
echo 开始构建 $1 版代码
# npm run build-client
echo 构建docker镜像
docker build $DOCKER_PARAMS -t zzcheng/yapi-$1 .
echo docker镜像构建完成
# echo 推送docker镜像
# docker push hub.fuxi.netease.com/fuxi-frontend/eevee-yapi-dev:$1
