/**
 * 获取所需要的日期区间点
 * @param time {Number} Number是ele日期区间选择组件返回的结果
 *      Number是之前时刻距离今天的间隔天数，默认是90天
 * @param start {String} 日期对象，日期区间的开始点 '2017-01-17 00:00:00'
 * @param withToday {Boolean} 是否包含今天
 * @return {Array} ['2017-01-17 00:00:00', '2017-01-20 23:59:59']
 */
exports.getDateRange = (time = 90, start = false, withToday = true) => {
    const gapTime = time * 24 * 3600 * 1000;
    if (!start) {
        // 没有规定start时间
        let endTime = getNowMidnightDate().getTime();
        if (!withToday) {
            endTime -= 86400000;
        }
        return [this.formatYMD(endTime - gapTime), this.formatYMD(endTime - 1000)];
    }
    const startTime = dateSpacialWithSafari(start);
    const endTime = startTime + (gapTime - 1000);
    return [start, this.formatYMD(endTime)];
}

// 时间
const convert2Decimal = num => (num > 9 ? num : `0${num}`)

/**
 * 获取距今天之前多少天的所有时间
 *  @param time {Number} Number是ele日期区间选择组件返回的结果
 *      Number是之前时刻距离今天的间隔天数，默认是30天
 *  @return {Array} ['2017-01-17', '2017-01-28', '2017-10-29',...]
 */

exports.getDateInterval = (time = 30) => {
    // const gapTime = time * 24 * 3600 * 1000;
    // 今天
    let endTime = new Date().getTime();
    let timeList = []
    for (let i = 0; i < time; i++) {
        const gapTime = i * 24 * 3600 * 1000;
        const time = this.formatYMD(endTime - gapTime);
        timeList.push(time);
    }
    return timeList;
}

/**获取2017-10-27 00:00:00 和 2017-10-27 23:59:59的时间戳
 *  @param date {String}  "2017-10-27"
 *  @return {Array} [ 1509033600000, 1509119999000 ]
 */

exports.getTimeInterval = (date) => {
    const startTime = (getNowMidnightDate(date).getTime()-86400000)/1000;
    const endTime =(getNowMidnightDate(date).getTime()-1000)/1000;
    return [startTime, endTime];
}

/**
 * 获取当前时间午夜0点的日期对象
 */
const getNowMidnightDate = (time) => {
    let date;
    if (time) {
        date = new Date(time);
    } else {
        date = new Date();
    }
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

/**
 * 格式化 年、月、日、时、分、秒
 * @param val {Object or String or Number} 日期对象 或是可new Date的对象或时间戳
 * @return {String} 2017-01-20 20:00:00
 */
const formatDate = val => {
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

/**
 * 格式化年、月、日
 * @param val {Object or String or Number} 日期对象 或是可new Date的对象或时间戳
 * @return {String} 2017-01-20
 */
exports.formatYMD = (val, joinStr = '-') => {
    let date = val;
    if (typeof val !== 'object') {
        date = new Date(val);
    }
    return `${[
        date.getFullYear(),
        convert2Decimal(date.getMonth() + 1),
        convert2Decimal(date.getDate())
    ].join(joinStr)}`;
}


/**
 * 获取所需的时间差值,
 * tip：new Date('2017-01-17 00:00:00')在safari下不可用，需进行替换
 * @param Array ['2017-01-17 00:00:00', '2017-01-20 23:59:59']
 * @return {Number} 3
 */
exports.getDayGapFromRange = dateRange => {
    const startTime = dateSpacialWithSafari(dateRange[0]);
    const endTime = dateSpacialWithSafari(dateRange[1]);
    return Math.ceil((endTime - startTime) / 86400000);
}


/**
 * dateSpacialWithSafari 格式话safari下通用的格式
 * @param str {String} 2017-04-19T11:01:19.074+0800 or 2017-10-10 10:10:10
 * @return {number} date.getTime()
 */
const dateSpacialWithSafari = str => {
    if (str.indexOf('T') > -1) {
        let date;
        str.replace(/(\d{4})-(\d{2})-(\d{2})\w(\d{2}):(\d{2}):(\d{2})/, (match, p1, p2, p3, p4, p5, p6) => {
            date = new Date(p1, +p2 - 1, p3, p4, p5, p6);
            return;
        })
        return date.getTime();
    }
    return new Date(str.replace(/-/g, '/')).getTime();
}

/**
 * 将内存单位从字节(b)变成GB
 */

exports.transformBytesToGB = bytes => {
  return (bytes/1024/1024/1024).toFixed(2)
}

exports.transformSecondsToDay = seconds => {
  return (seconds/3600/24).toFixed(2)
}
