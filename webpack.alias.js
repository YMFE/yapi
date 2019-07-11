const path = require('path')

module.exports = {
  resolve: {
    alias: {
      'common': path.resolve(__dirname, 'common'),
      'client': path.resolve(__dirname, 'client')
    }
  }
}