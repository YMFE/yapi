import {
  FETCH_PROJECT_LIST,
  PROJECT_ADD,
  PROJECT_DEL
} from '../../constants/action-types';

const initialState = {
  projectList: [],
  total: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROJECT_LIST: {
      return {
        ...state,
        projectList: action.payload.data.data.list,
        total: action.payload.data.data.total
      };
    }
    case PROJECT_ADD: {
      return state;
    }
    case PROJECT_DEL: {
      return state;
    }
    default:
      return state;
  }
};
