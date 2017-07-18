import {
  PROJECT_ADD
} from '../../constants/action-types';

const initialState = {
  groupList: [],
  currGroup: 'MFE'
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_ADD: {
      console.log(action.payload);
      return state;
    }
    default:
      return state;
  }
};
