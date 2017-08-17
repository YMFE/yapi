import moment from 'moment'
// import regex_parse from './parseCommon.js';


exports.formatTime = (timestamp) => {
  return moment.unix(timestamp).format("YYYY-MM-DD HH:mm:ss")
}
