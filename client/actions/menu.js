import {
  CHANGE_MENU_ITEM
} from '../constants/action-types.js'

export function changeMenuItem(curKey) {
  return {
    type: CHANGE_MENU_ITEM,
    data: curKey
  }
}
