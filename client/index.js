import './styles/common.scss';
import './styles/theme.less'

import './plugin'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './Application'
import { Provider } from 'react-redux'
import createStore from './reducer/create';

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <div>
      <App />
    </div>
  </Provider>,
  document.getElementById('yapi')
)
