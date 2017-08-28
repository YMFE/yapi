import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Home, Group, Project, Follows, AddProject, Login } from './containers/index';
import {message} from 'antd'
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
    message.warning('YApi平台正在公测，发布正式版会删除所有公测数据！', 5)
    this.props.checkLoginState();
  }

  route = (status) => {
    let r;
    if (status === LOADING_STATUS) {
      return <Loading visible />;
    } else {
      r = (
        <Router >
          <div className="g-main">
            <div className="router-main">
              {this.props.loginState !== 1 ? <Header /> : null}
              <div className="router-container">
                <Route exact path="/" component={Home} />
                <Route path="/group" component={requireAuthentication(Group)} />
                <Route path="/project/:id" component={requireAuthentication(Project)} />
                <Route path="/user" component={requireAuthentication(User)} />
                <Route path="/follow" component={requireAuthentication(Follows)} />
                <Route path="/add-project" component={requireAuthentication(AddProject)} />
                <Route path="/login" component={Login} />
                {
                // <Route path="/news" component={requireAuthentication(News)} />
                // <Route path="/add-interface" component={requireAuthentication(AddInterface)} />
                }
              </div>
            </div>
            <Footer />
          </div>
        </Router>
      )
    }
    return r;
  }

  render() {
    return this.route(this.props.loginState);
  }
}
