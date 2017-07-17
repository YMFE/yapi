import {
  FETCH_NEWS_DATA
} from '../constants/action-types.js';

export function fetchNewsData () {
  const data = [{
    name: 'John Brown',
    date: '2015-11-11 13:00:15',
    desc: '创建服务现场'
  }, {
    name: 'John Brown1',
    date: '2015-11-11 13:00:15',
    desc: '技术测试异常'
  }, {
    name: 'John Brown2',
    date: '2015-11-11 13:00:15',
    desc: '网络异常正在修复'
  }]

  return {
    type: FETCH_NEWS_DATA,
    payload: data
  };
}

export function fetchViewedNews () {
  const data = [{
    name: 'John Brown21',
    date: '2015-11-11 13:00:15',
    desc: '创建服务现场'
  }, {
    name: 'John Brown12',
    date: '2015-11-11 13:00:15',
    desc: '技术测试异常'
  }, {
    name: 'John Brown22',
    date: '2015-11-11 13:00:15',
    desc: '网络异常正在修复'
  }]

  return {
    type: FETCH_NEWS_DATA,
    payload: data
  }
}

export function fetchNotVieweNews () {
  const data = [{
    name: 'John Brown22',
    date: '2015-11-11 13:00:15',
    desc: '创建服务现场'
  }, {
    name: 'John Brown12',
    date: '2015-11-11 13:00:15',
    desc: '技术测试异常'
  }, {
    name: 'John Brown22',
    date: '2015-11-11 13:00:15',
    desc: '网络异常正在修复'
  }]

  return {
    type: FETCH_NEWS_DATA,
    payload: data
  }
}
