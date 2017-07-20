import moment from 'moment'

exports.formatTime = (timestamp) => {
  return moment.unix(timestamp).format("YYYY-MM-DD HH:mm:ss")
}
