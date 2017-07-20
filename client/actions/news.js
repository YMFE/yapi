import {
  FETCH_NEWS_DATA,
  FETCH_MORE_NEWS
} from '../constants/action-types.js';

export function fetchNewsData () {
  const data = [
    { key: 1, type: 'John Brown', news: '您好！亲爱的用户：您已成功申请接口：实时空气质量数据查询，请于两个月内进行应用验证，逾期接口将不能正常使用。如果您在使用的过程中遇到任何问题，欢迎前往交流社区反馈意见，谢谢！',time: '2014-12-01' },
    { key: 2, type: 'John Brown', news: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',time: '2014-12-01' },
    { key: 3, type: 'John Brown', news: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',time: '2014-12-01' }
  ];

  return {
    type: FETCH_NEWS_DATA,
    payload: data
  };
}

export function fetchViewedNews () {
  const data = [
    { key: 1, type: 'John Brown1', news: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',time: '2014-12-01' },
    { key: 2, type: 'John Brown2', news: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',time: '2014-12-01' },
    { key: 3, type: 'John Brown3å', news: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',time: '2014-12-01' }
  ];

  return {
    type: FETCH_NEWS_DATA,
    payload: data
  }
}

export function fetchNotVieweNews () {
  const data = [
    { key: 1, type: 'John Brown', news: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',time: '2015-11-11 13:00:15' },
    { key: 2, type: 'John Brown', news: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',time: '2015-11-11 13:00:15' },
    { key: 3, type: 'John Brown', news: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',time: '2015-11-11 13:00:15' }
  ];

  return {
    type: FETCH_NEWS_DATA,
    payload: data
  }
}

export function fetchMoreNews () {
  return (dispatch)=>{
    const data = [
      { key: 1, type: 'John Brown', news: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',time: '2014-12-01' },
      { key: 2, type: 'John Brown', news: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',time: '2014-12-01' },
      { key: 3, type: 'John Brown', news: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',time: '2014-12-01' }
    ];

    dispatch({
      type: FETCH_MORE_NEWS,
      payload: data
    })
  }
  
}
