#--link ${mongo_container_name}:${config_mongon_serve_name}
docker run -it --rm --link docker_mongodb:mongo --entrypoint npm --workdir /api/vendors yapi run install-server
