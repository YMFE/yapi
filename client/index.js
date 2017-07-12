import React from 'react'
import 'babel-polyfill'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise';
import ReactDOM from 'react-dom'
import App from './App'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxContainer from './ReduxContainer.js'

// 合并 redux 创建stroe
const store = createStore(combineReducers( ReduxContainer ), applyMiddleware(
  thunkMiddleware.default,
  promiseMiddleware
))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('yapi')
)
