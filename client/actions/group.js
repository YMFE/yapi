import {
  FETCH_GROUP_LIST,
  SET_CURR_GROUP
} from '../constants/action-types';
import axios from 'axios';

export function fetchGroupList() {
  return {
    type: FETCH_GROUP_LIST,
    payload: axios.get('/group/list')
  }
}

export function setCurrGroup(group) {
  return {
    type: SET_CURR_GROUP,
    payload: group
  }
}

export function addGroup(groupName) {
  return function(dispatch, getState) {
    const group = getState().group;
    const groupList = group.groupList || [];
    const newGroupList = groupList.concat([{ group_name: groupName + groupList.length }]);
    dispatch({
      type: FETCH_GROUP_LIST,
      payload: { data: {
        data: newGroupList,
        errcode: 0
      }}
    });
  }
}
