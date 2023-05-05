import './styles/common.scss'

import { LocaleProvider } from 'antd'
import './plugin'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './Application'
import { Provider } from 'react-redux'
import createStore from './reducer/create'

import zhCN from 'antd/lib/locale-provider/zh_CN'
require('./styles/editor.css')

const store = createStore()

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={zhCN}>
      <App />
    </LocaleProvider>
  </Provider>,
  document.getElementById('yapi'),
)
