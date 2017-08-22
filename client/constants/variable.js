export default {
  PAGE_LIMIT: 10, // 默认每页展示10条数据
  HTTP_METHOD: {
    'GET': {
      request_body: false
    },
    'POST': {
      request_body: true
    },
    'PUT': {
      request_body: true
    },
    'DELETE': {
      request_body: true
    },
    'HEAD': {
      request_body: false
    },
    'OPTIONS': {
      request_body: false
    },
    'PATCH': {
      request_body: true
    }
  }
}


