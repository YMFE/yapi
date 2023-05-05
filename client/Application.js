import React, { PureComponent as Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import {
  Group,
  Project,
  Follows,
  AddProject,
  Login,
  StaticPage,
} from './containers/index'
import { Alert, Spin } from 'antd'
import User from './containers/User/User.js'
import Header from './components/Header/Header'
import MyPopConfirm from './components/MyPopConfirm/MyPopConfirm'
import { checkLoginState } from './reducer/modules/user'
import { requireAuthentication } from './components/AuthenticatedComponent'
import Notify from './components/Notify/Notify'

const plugin = require('client/plugin.js')

const LOADING_STATUS = 0
// const GUEST_STATUS = 1;
// const MEMBER_STATUS = 2;

const alertContent = () => {
  const ua = window.navigator.userAgent,
    isChrome = ua.indexOf('Chrome') && window.chrome
  if (!isChrome) {
    return (
      <Alert
        style={{ zIndex: 99 }}
        message={'Only support Chrome，please use Chrome to visit'}
        banner
        closable
      />
    )
  }
}

let AppRoute = {
  home: {
    path: '/',
    component: Login,
  },
  group: {
    path: '/group',
    component: Group,
  },
  staticPage: {
    public: true,
    path: '/public/:id/page/:wiki_id',
    component: StaticPage,
  },
  project: {
    path: '/project/:id',
    component: Project,
  },
  user: {
    path: '/user',
    component: User,
  },
  follow: {
    path: '/follow',
    component: Follows,
  },
  addProject: {
    path: '/add-project',
    component: AddProject,
  },
  login: {
    path: '/login',
    component: Login,
  },
}
// add router hook
plugin.emitHook('app_route', AppRoute)

@connect(
  state => {
    return {
      loginState: state.user.loginState,
      curUserRole: state.user.role,
    }
  },
  {
    checkLoginState,
  },
)
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login: LOADING_STATUS,
    }
  }

  static propTypes = {
    checkLoginState: PropTypes.func,
    loginState: PropTypes.number,
    curUserRole: PropTypes.string,
  }

  componentDidMount() {
    this.props.checkLoginState()
  }

  showConfirm = (msg, callback) => {
    let container = document.createElement('div')
    document.body.appendChild(container)
    ReactDOM.render(<MyPopConfirm msg={msg} callback={callback} />, container)
  }

  route = status => {
    let r
    if (status === LOADING_STATUS) {
      return (
        <Spin
          size="large"
          style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )
    } else {
      r = (
        <Router getUserConfirmation={this.showConfirm}>
          <div className="g-main">
            <div className="router-main">
              {this.props.curUserRole === 'admin' && <Notify />}
              {alertContent()}
              {this.props.loginState !== 1 ? <Header /> : null}
              <div className="router-container">
                {Object.keys(AppRoute).map(key => {
                  let item = AppRoute[key]
                  return key === 'login' ? (
                    <Route
                      key={key}
                      path={item.path}
                      component={item.component}
                    />
                  ) : key === 'home' || item.public ? (
                    <Route
                      key={key}
                      exact
                      path={item.path}
                      component={item.component}
                    />
                  ) : (
                    <Route
                      key={key}
                      path={item.path}
                      component={requireAuthentication(item.component)}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </Router>
      )
    }
    return r
  }

  render() {
    return this.route(this.props.loginState)
  }
}

export default App
