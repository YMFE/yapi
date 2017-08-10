import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, HashRouter, Redirect, Switch } from 'react-router-dom';
import { Home, Group, Project, News, AddInterface, Follows } from './containers/index';
import User from './containers/User/User.js';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Loading from './components/Loading/Loading';
import { checkLoginState } from './reducer/modules/user';
import { requireAuthentication } from './components/AuthenticatedComponent';

const LOADING_STATUS = 0;

@connect(
  state => {
    return {
      loginState: state.user.loginState
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

  // componentWillMount() {
  //   if( !this.props.isAuthenticated ){
  //     this.props.history.push('/');
  //     this.props.changeMenuItem('/');
  //   }
  // }

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
              <Route path="/" component={Home} exact />
              <Switch>
                <Redirect exact from='/group' to='/group/1' />
                <Route exact path="/group/:groupName" component={requireAuthentication(Group)} />
              </Switch>
              <Route path="/project" component={requireAuthentication(Project)} />
              <Route path="/user" component={requireAuthentication(User)} />
              <Route path="/news" component={requireAuthentication(News)} />
              <Route path="/add-interface" component={requireAuthentication(AddInterface)} />
              <Route path="/follow" component={requireAuthentication(Follows)} />
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
