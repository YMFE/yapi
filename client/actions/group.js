import {
  FETCH_GROUP_LIST,
  FETCH_CURR_GROUP
} from '../constants/action-types';

export function fetchGroupList() {
  return {
    type: FETCH_GROUP_LIST,
    payload: {
      data: ['MFE', 'Hotel', 'Vacation', 'Flight', 'Pay']
    }
  }
}

export function fetchCurrGroup() {
  return {
    type: FETCH_CURR_GROUP,
    payload: {
      data: 'MFE'
    }
  }
}
