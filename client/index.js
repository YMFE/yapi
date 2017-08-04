import React from 'react'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise';
import ReactDOM from 'react-dom'
import App from './Application'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import ReduxContainer from './ReduxContainer.js'
import { DevTools } from './containers';

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(
    thunkMiddleware.default,
    promiseMiddleware
  ),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument()
);

// 合并 redux 创建stroe
const store = createStore(combineReducers( ReduxContainer ), {}, enhancer)

ReactDOM.render(
  <Provider store={store}>
    <div>
      <App />
      <DevTools />
    </div>
  </Provider>,
  document.getElementById('yapi')
)
