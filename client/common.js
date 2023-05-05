const moment = require('moment')
const constants = require('./constants/variable')
const Mock = require('mockjs')
const json5 = require('json5')
const MockExtra = require('common/mock-extra.js')

const Roles = {
  0: 'admin',
  10: 'owner',
  20: 'dev',
  30: 'guest',
  40: 'member',
}

const roleAction = {
  manageUserlist: 'admin',
  changeMemberRole: 'owner',
  editInterface: 'dev',
  viewPrivateInterface: 'guest',
  viewGroup: 'guest',
}

function isJson(json) {
  if (!json) {
    return false
  }
  try {
    json = JSON.parse(json)
    return json
  } catch (e) {
    return false
  }
}

exports.isJson = isJson

function isJson5(json) {
  if (!json) {
    return false
  }
  try {
    json = json5.parse(json)
    return json
  } catch (e) {
    return false
  }
}
exports.safeArray = function(arr) {
  return Array.isArray(arr) ? arr : []
}

exports.json5_parse = function(json) {
  try {
    return json5.parse(json)
  } catch (err) {
    return json
  }
}

exports.json_parse = function(json) {
  try {
    return JSON.parse(json)
  } catch (err) {
    return json
  }
}

function deepCopyJson(json) {
  return JSON.parse(JSON.stringify(json))
}

exports.deepCopyJson = deepCopyJson

exports.isJson5 = isJson5

exports.checkAuth = (action, role) => {
  return Roles[roleAction[action]] <= Roles[role]
}

exports.formatTime = timestamp => {
  return moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

// import { debounce } from '$/common';
// this.func = debounce(this.func, 400);
exports.debounce = (func, wait) => {
  let timeout
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(func, wait)
  }
}

// get property by random
exports.pickRandomProperty = obj => {
  let result
  let count = 0
  for (let prop in obj) {
    if (Math.random() < 1 / ++count) {
      result = prop
    }
  }
  return result
}

exports.getImgPath = (path, type) => {
  let rate = window.devicePixelRatio >= 2 ? 2 : 1
  return `${path}@${rate}x.${type}`
}

function trim(str) {
  if (!str) {
    return str
  }

  str = str + ''

  return str.replace(/(^\s*)|(\s*$)/g, '')
}

exports.trim = trim

exports.handlePath = path => {
  path = trim(path)
  if (!path) {
    return path
  }
  if (path === '/') {
    return ''
  }
  path = path[0] !== '/' ? '/' + path : path
  path = path[path.length - 1] === '/' ? path.substr(0, path.length - 1) : path
  return path
}

exports.handleApiPath = path => {
  if (!path) {
    return ''
  }
  path = trim(path)
  path = path[0] !== '/' ? '/' + path : path
  return path
}

exports.nameLengthLimit = type => {
  const strLength = str => {
    let length = 0
    for (let i = 0; i < str.length; i++) {
      str.charCodeAt(i) > 255 ? (length += 2) : length++
    }
    return length
  }
  return [
    {
      required: true,
      validator(rule, value, callback) {
        const len = value ? strLength(value) : 0
        if (len > constants.NAME_LIMIT) {
          callback(
            '请输入' +
              type +
              '名称，长度不超过' +
              constants.NAME_LIMIT +
              '字符(中文算作2字符)!',
          )
        } else if (len === 0) {
          callback(
            '请输入' +
              type +
              '名称，长度不超过' +
              constants.NAME_LIMIT +
              '字符(中文算作2字符)!',
          )
        } else {
          return callback()
        }
      },
    },
  ]
}


exports.htmlFilter = html => {
  let reg = /<\/?.+?\/?>/g
  return html.replace(reg, '') || '新项目'
}

exports.entries = obj => {
  let res = []
  for (let key in obj) {
    res.push([key, obj[key]])
  }
  return res
}

exports.getMockText = mockTpl => {
  try {
    return JSON.stringify(
      Mock.mock(MockExtra(json5.parse(mockTpl), {})),
      null,
      '  ',
    )
  } catch (err) {
    return ''
  }
}
/**
 *
 * @param  {Object} Obj     old obj
 * @param  {Object} nextObj new obj
 * @return {Object}           merged obj
 */
exports.safeAssign = (Obj, nextObj) => {
  let keys = Object.keys(nextObj)
  return Object.keys(Obj).reduce((result, value) => {
    if (keys.indexOf(value) >= 0) {
      result[value] = nextObj[value]
    } else {
      result[value] = Obj[value]
    }
    return result
  }, {})
}

// 交换数组的位置
exports.arrayChangeIndex = (arr, start, end) => {
  let newArr = [].concat(arr)
  // newArr[start] = arr[end];
  // newArr[end] = arr[start];
  let startItem = newArr[start]
  newArr.splice(start, 1)
  // end自动加1
  newArr.splice(end, 0, startItem)
  let changes = []
  newArr.forEach((item, index) => {
    changes.push({
      id: item._id,
      index: index,
    })
  })

  return changes
}
