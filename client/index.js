import React from 'react'
import ReactDOM from 'react-dom'
import App from './Application'
import { Provider } from 'react-redux'
import createStore from './reducer/create';
import { DevTools } from './containers';

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <div>
      <App />
      <DevTools />
    </div>
  </Provider>,
  document.getElementById('yapi')
)
