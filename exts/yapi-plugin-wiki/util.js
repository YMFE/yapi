
// 时间
const convert2Decimal = num => (num > 9 ? num : `0${num}`);

/**
 * 格式化 年、月、日、时、分、秒
 * @param val {Object or String or Number} 日期对象 或是可new Date的对象或时间戳
 * @return {String} 2017-01-20 20:00:00
 */
exports.formatDate = val => {
  let date = val;
  if (typeof val !== 'object') {
    date = new Date(val);
  }
  return `${[
    date.getFullYear(),
    convert2Decimal(date.getMonth() + 1),
    convert2Decimal(date.getDate())
  ].join('-')}  ${[
    convert2Decimal(date.getHours()),
    convert2Decimal(date.getMinutes()),
    convert2Decimal(date.getSeconds())
  ].join(':')}`;
};



// const json5_parse = require('../client/common.js').json5_parse;

exports.timeago = timestamp => {
  let minutes, hours, days, seconds, mouth, year;
  const timeNow = parseInt(new Date().getTime() / 1000);
  seconds = timeNow - timestamp;
  if (seconds > 86400 * 30 * 12) {
    year = parseInt(seconds / (86400 * 30 * 12));
  } else {
    year = 0;
  }
  if (seconds > 86400 * 30) {
    mouth = parseInt(seconds / (86400 * 30));
  } else {
    mouth = 0;
  }
  if (seconds > 86400) {
    days = parseInt(seconds / 86400);
  } else {
    days = 0;
  }
  if (seconds > 3600) {
    hours = parseInt(seconds / 3600);
  } else {
    hours = 0;
  }
  minutes = parseInt(seconds / 60);
  if (year > 0) {
    return year + '年前';
  } else if (mouth > 0 && year <= 0) {
    return mouth + '月前';
  } else if (days > 0 && mouth <= 0) {
    return days + '天前';
  } else if (days <= 0 && hours > 0) {
    return hours + '小时前';
  } else if (hours <= 0 && minutes > 0) {
    return minutes + '分钟前';
  } else if (minutes <= 0 && seconds > 0) {
    if (seconds < 30) {
      return '刚刚';
    } else {
      return seconds + '秒前';
    }
  } else {
    return '刚刚';
  }
};
