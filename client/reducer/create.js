import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import messageMiddleware from './middleware/messageMiddleware';

import reducer from './modules/reducer';

export default function createStore(initialState = {}) {
  const middleware = [thunkMiddleware, promiseMiddleware, messageMiddleware];

  let finalCreateStore;
  if (ENV_PARAMS.development) {
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : require('../containers/DevTools/DevTools').default.instrument()
    )(_createStore);

  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const store = finalCreateStore(reducer, initialState);

  return store;
}
