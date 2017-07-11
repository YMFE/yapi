import React from 'react'
import 'babel-polyfill'
import ReactDOM from 'react-dom'
import App from './App'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import ReduxContainer from './ReduxContainer.js'

// 合并 redux 创建stroe
const store = createStore(combineReducers( ReduxContainer ))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('yapi')
)
