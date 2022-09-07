{
  "port": "3000",
  "adminAccount": "${YAPI_ADMIN_ACCOUNT}",
  "timeout": ${YAPI_TIMEOUT},
  "db": {
    "servername": "${YAPI_DB_SERVER_NAME}",
    "DATABASE": "${YAPI_DB_DATABASE}",
    "port": ${YAPI_DB_PORT},
    "user": "${YAPI_DB_USER}",
    "pass": "${YAPI_DB_PASS}",
    "authSource": "${YAPI_DB_AUTH_SOURCE}"
  },
  "mail": {
    "enable": ${YAPI_MAIL_ENABLE},
    "host": "${YAPI_MAIL_HOST}",
    "port": ${YAPI_MAIL_PORT},
    "from": "${YAPI_MAIL_FROM}",
    "auth": {
      "user": "${YAPI_MAIL_AUTH_USER}",
      "pass": "${YAPI_MAIL_AUTH_PASS}"
    }
  }
}
