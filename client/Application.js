import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Route, HashRouter, Redirect, Switch } from 'react-router-dom'
import { Home, ProjectGroups, Interface, News, AddInterface } from './containers/index'
import User from './containers/User/User.js'
import Header from './components/Header/Header'
import { checkLoginState } from './actions/login'

const LOADING_STATUS = 0;
const GUEST_STATUS = 1;
// const MEMBER_STATUS = 2;


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login: LOADING_STATUS
    }
  }
  static propTypes = {
    checkLoginState:PropTypes.func,
    loginState:PropTypes.number
  }
  route = (status) => {
    let r;
    if (status === LOADING_STATUS) {
      return <span>loading...</span>
    } else if (status === GUEST_STATUS) {
      r = (
        <HashRouter>
          <div className="router-main">
            <Header />
            <Switch>
              <Route
                path="/"
                component={Home}/>
              <Redirect from="(/:str)" to="/" />
            </Switch>
          </div>
        </HashRouter>
      )
    } else {
      r = (
        <HashRouter>
          <div className="router-main">
            <Header />
            <Route path="/" component={Home} exact />
            <Route path="/ProjectGroups" component={ProjectGroups} />
            <Route path="/Interface" component={Interface} />
            <Route path="/user" component={User} />
            <Route path="/News" component={News} />
            <Route path="/AddInterface" component={ AddInterface } />
          </div>
        </HashRouter>
      )
    }
    return r

  }

  componentDidMount() {
    this.props.checkLoginState();
  }

  render() {
    return this.route(this.props.loginState)
  }
}

export default connect(
  state => {
    return{
      loginState:state.login.loginState
    }
  },
  {
    checkLoginState
  }
)(App)
