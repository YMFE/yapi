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
  },
  PROJECT_COLOR: {
    blue: '#2395f1',
    green: '#00a854',
    yellow: '#ffbf00',
    red: '#f56a00',
    pink: '#f5317f',
    cyan: '#00a2ae',
    gray: '#bfbfbf',
    purple: '#7265e6'
  },
  PROJECT_ICON: [
    'code-o',
    'swap',
    'clock-circle-o',
    'unlock',
    'calendar',
    'play-circle-o',
    'file-text',
    'desktop',
    'hdd',
    'appstore-o',
    'line-chart',
    'mail',
    'mobile',
    'notification',
    'picture',
    'poweroff',
    'search',
    'setting',
    'share-alt',
    'shopping-cart',
    'tag-o',
    'video-camera',
    'cloud-o',
    'star-o',
    'environment-o',
    'camera-o',
    'team',
    'customer-service',
    'pay-circle-o',
    'rocket',
    'database',
    'tool',
    'wifi',
    'idcard',
    'medicine-box',
    'coffee',
    'safety',
    'global',
    'api',
    'fork',
    'android-o',
    'apple-o'
  ],
  HTTP_REQUEST_HEADER: ["Accept", "Accept-Charset", "Accept-Encoding", "Accept-Language", "Accept-Datetime", "Authorization", "Cache-Control", "Connection", "Cookie", "Content-Disposition", "Content-Length", "Content-MD5", "Content-Type", "Date", "Expect", "From", "Host", "If-Match", "If-Modified-Since", "If-None-Match", "If-Range", "If-Unmodified-Since", "Max-Forwards", "Origin", "Pragma", "Proxy-Authorization", "Range", "Referer", "TE", "User-Agent", "Upgrade", "Via", "Warning", "X-Requested-With", "DNT", "X-Forwarded-For", "X-Forwarded-Host", "X-Forwarded-Proto", "Front-End-Https", "X-Http-Method-Override", "X-ATT-DeviceId", "X-Wap-Profile", "Proxy-Connection", "X-UIDH", "X-Csrf-Token"]
}
