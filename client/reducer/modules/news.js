// Actions
const FETCH_NEWS_DATA = 'yapi/news/FETCH_NEWS_DATA';
const FETCH_MORE_NEWS = 'yapi/news/FETCH_MORE_NEWS';

// Reducer
const initialState = {
  newsData: {
    list: [],
    total: 0
  },
  curpage: 1
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NEWS_DATA: {
      const list = action.payload.data.data.list;
      state.newsData.list.push(...list);
      if(list && list.length){
        state.curpage++;
      }
      return {
        ...state,
        newsData: {
          total:action.payload.data.data.total,
          list: state.newsData.list
        }
      };
    }
    case FETCH_MORE_NEWS: {
      return {
        newsData: {
          ...state.newsData,
          newsList: action.payload
        }
      }
    }
    default:
      return state;
  }
}

// Action Creators
import axios from 'axios';
import variable from '../../constants/variable';

export function fetchNewsData (groupid,page,limit) {
  const param = {
    groupid: groupid,
    page: page,
    limit: limit?limit:variable.PAGE_LIMIT
  }
  return {
    type: FETCH_NEWS_DATA,
    payload: axios.get('/log/list',{
      params: param
    })
  };
}

export function fetchMoreNews (current,pageSize) {
  // id,type,news,time,totalPage
  const newsList = [
    { key: 1,title: '日志标题1', username: 'John Brown', content: '您好！亲爱的用户：您已成功申请接口：实时空气质量数据查询，请于两个月内进行应用验证，逾期接口将不能正常使用。如果您在使用的过程中遇到任何问题，欢迎前往交流社区反馈意见，谢谢！',time: '2014-12-01' },
    { key: 2,title: '日志标题', username: 'John Brown', content: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',time: '2014-12-01' },
    { key: 3,title: '日志标题', username: 'John Brown', content: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',time: '2014-12-01' }
  ]
  console.log(current,pageSize);
  return ({
    type: FETCH_MORE_NEWS,
    payload: new Promise(function(resolve,reject){
      if(newsList){
        resolve(newsList);
      }else{
        reject("出现了错误");
      }
    })
  })



}
