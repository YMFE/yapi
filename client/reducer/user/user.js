const CHANGE_CUR_UID = 'yapi/user/CHANGE_CUR_UID';

// Reducer
const initialState = {
  curUid: "0"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_CUR_UID: {
      return {
        ...state,
        curUid: action.data
      };
    }

    default:
      return state;
  }
};

// Action Creators
export function changeCurUid(curUid) {
  return {
    type: CHANGE_CUR_UID,
    data: curUid
  }
}
