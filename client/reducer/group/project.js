import {
  FETCH_PROJECT_LIST,
  PROJECT_ADD,
  PROJECT_DEL,
  OPRATE_UPDATE_MODAL
} from '../../constants/action-types';

const initialState = {
  isUpdateModalShow: false,
  handleUpdateIndex: -1,
  projectList: [],
  total: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case OPRATE_UPDATE_MODAL: {
      return {
        ...state,
        isUpdateModalShow: action.payload.data,
        handleUpdateIndex: action.payload.index
      };
    }
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
