import {
  FETCH_ADD_INTERFACE_INPUT
} from '../constants/action-types.js'

export function pushInputVal (value) {
  return {
    type: FETCH_ADD_INTERFACE_INPUT,
    payload: value
  };
}
