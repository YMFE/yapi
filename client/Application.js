import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, HashRouter, Redirect, Switch } from 'react-router-dom';
import { Home, ProjectGroups, Interface, News, AddInterface } from './containers/index';
import User from './containers/User/User.js';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Breadcrumb from './components/Breadcrumb/Breadcrumb';
import Loading from './components/Loading/Loading';
import { checkLoginState } from './reducer/login/login';
import { requireAuthentication } from './components/AuthenticatedComponent';

const LOADING_STATUS = 0;

@connect(
  state => {
    return {
      loginState: state.login.loginState
    };
  },
  {
    checkLoginState
  }
)
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: LOADING_STATUS
    };
  }

  static propTypes = {
    checkLoginState: PropTypes.func,
    loginState: PropTypes.number
  };

  componentDidMount() {
    this.props.checkLoginState();
  }

  route = (status) => {
    let r;
    if (status === LOADING_STATUS) {
      return <Loading visible />;
    } else {
      r = (
        <HashRouter>
          <div className="router-main">
            <Header />
            <div className="router-container">
              <Breadcrumb />
              <Route path="/" component={Home} exact />
              <Switch>
                <Redirect exact from='/group' to='/group/1' />
                <Route exact path="/group/:groupName" component={requireAuthentication(ProjectGroups)} />
              </Switch>
              <Route path="/project" component={requireAuthentication(Interface)} />
              <Route path="/user" component={requireAuthentication(User)} />
              <Route path="/news" component={requireAuthentication(News)} />
              <Route path="/add-interface" component={requireAuthentication(AddInterface)} />
            </div>
            <Footer />
          </div>
        </HashRouter>
      )
    }
    return r;
  }

  render() {
    return this.route(this.props.loginState);
  }
}
