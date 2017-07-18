import {
  CHANGE_CUR_UID
} from '../constants/action-types.js'

export function changeCurUid(curUid) {
  return {
    type: CHANGE_CUR_UID,
    data: curUid
  }
}
