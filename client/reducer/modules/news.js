// Actions
const FETCH_NEWS_DATA = 'yapi/news/FETCH_NEWS_DATA';

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
      state.newsData.list.sort(function(a,b){
        return b.add_time - a.add_time;
      })
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
    default:
      return state;
  }
}

// Action Creators
import axios from 'axios';
import variable from '../../constants/variable';

export function fetchNewsData (typeid,page,limit) {
  const param = {
    typeid: typeid,
    page: page,
    limit: limit?limit:variable.PAGE_LIMIT
  }
  return {
    type: FETCH_NEWS_DATA,
    payload: axios.get('/api/log/list',{
      params: param
    })
  };
}

export function getMockUrl(project_id){
  const params = {id: project_id};
  return {
    type:"",
    payload: axios.get('/api/project/get', {params: params})
  }
  
}

