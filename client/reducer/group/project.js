import {
  FETCH_PROJECT_LIST,
  PROJECT_ADD
} from '../../constants/action-types';

const initialState = {
  projectList: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROJECT_LIST: {
      return {
        ...state,
        projectList: action.payload.data.data
      };
    }
    case PROJECT_ADD: {
      return state;
    }
    default:
      return state;
  }
};
