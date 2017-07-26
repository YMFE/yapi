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
