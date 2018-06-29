


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
}

// 时间
const convert2Decimal = num => (num > 9 ? num : `0${num}`)


// const json5_parse = require('../client/common.js').json5_parse;



exports.showDiffMsg = (jsondiffpatch, formattersHtml, curDiffData) => {

  const diffText = (left, right) => {
    left = left || '';
    right = right || '';
    if (left == right) {
      return null;
    }
    var delta = jsondiffpatch.diff(left, right);
    return formattersHtml.format(delta, left)
  }


  let diffView = [];
  

  if (curDiffData && typeof curDiffData === 'object' && curDiffData.current) {
    const { current, old } = curDiffData;
    if (current != old) {
      diffView.push({
        title: 'wiki更新',
        content: diffText(old, current)
      })
    }
    
  }
  

  return diffView = diffView.filter(item => item.content)


}
