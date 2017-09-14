import './plugin'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './Application'
import { Provider } from 'react-redux'
import createStore from './reducer/create';
import './styles/theme.less'
import './styles/common.scss';
const store = createStore();
if (process.env.NODE_ENV === 'production') {
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <App />
      </div>
    </Provider>,
    document.getElementById('yapi')
  )
} else {
  const DevTools = require('./containers/DevTools/DevTools.js')
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <App />
        <DevTools />
      </div>
    </Provider>,
    document.getElementById('yapi')
  )
}
