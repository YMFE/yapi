import React from 'react'
import ReactDOM from 'react-dom'
import App from './Application'
import { Provider } from 'react-redux'
import createStore from './reducer/create';
import './styles/theme.less'

const store = createStore();
if (ENV_PARAMS.development) {
  //const DevTools = require('./containers/DevTools/DevTools.js')
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <App />
        {/* <DevTools /> */}
      </div>
    </Provider>,
    document.getElementById('yapi')
  )
}else{
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <App />
      </div>
    </Provider>,
    document.getElementById('yapi')
  )
}

