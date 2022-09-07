#!/bin/sh

conf_file=/yapi/config.json

# main
YAPI_ADMIN_ACCOUNT=${YAPI_ADMIN_ACCOUNT:="admin@admin.com"}
YAPI_TIMEOUT=${YAPI_TIMEOUT:=120000}

# db
YAPI_DB_SERVER_NAME=${YAPI_DB_SERVER_NAME:="127.0.0.1"}
YAPI_DB_DATABASE=${YAPI_DB_DATABASE:="yapi"}
YAPI_DB_PORT=${YAPI_DB_PORT:="27017"}
YAPI_DB_USER=${YAPI_DB_USER:="yapi_user"}
YAPI_DB_PASS=${YAPI_DB_PASS:="yapi_pass"}
YAPI_DB_AUTH_SOURCE=${YAPI_DB_AUTH_SOURCE:-""}

# mail
YAPI_MAIL_ENABLE=${YAPI_MAIL_ENABLE:=false}
YAPI_MAIL_HOST=${YAPI_MAIL_HOST:="smtp.admin.com"}
YAPI_MAIL_PORT=${YAPI_MAIL_PORT:=465}
YAPI_MAIL_FROM=${YAPI_MAIL_FROM:="admin@admin.com"}
YAPI_MAIL_AUTH_USER=${YAPI_MAIL_AUTH_USER:="admin"}
YAPI_MAIL_AUTH_PASS=${YAPI_MAIL_AUTH_PASS:="pass"}


# render
cd /yapi/vendors
rm -f ../config.json
eval "cat <<EOF
$(cat config_template.tpl)
EOF
" 2> /dev/null > ../config.json

npm run install-server
node server/app.js
