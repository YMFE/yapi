import React, { Component } from 'react'
import axios from 'axios';
import { Route, HashRouter, Redirect } from 'react-router-dom'
import { Home, ProjectGroups, Interface, News } from './containers/index'
import User from './containers/User/User.js'
import Header from './components/Header/Header'

const LOADING_STATUS = 0;
const GUEST_STATUS = 1;
const MEMBER_STATUS = 2;

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      login: LOADING_STATUS
    }
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
            <Route path="/" component={Home} exact />
            <Redirect to="/" />
          </div>


        </HashRouter>
      )
    } else {
      r = (
        <HashRouter>
          <div className="router-main">
            <Header />
            <Route path="/" component={ProjectGroups} exact />
            <Route path="/ProjectGroups" component={ProjectGroups} />
            <Route path="/Interface" component={Interface} />
            <Route path="/user" component={User} />
            <Route path="/News" component={News} />
          </div>

        </HashRouter>
      )
    }
    return r

  }

  componentDidMount() {
    console.log('app.js init')
    axios.get('/user/status').then((res) => {
      if (res.data.errcode === 0 && res.data.data._id > 0) {
        this.setState({
          login: MEMBER_STATUS
        })
      } else {
        this.setState({
          login: GUEST_STATUS
        })
      }
    }, (err) => {
      this.setState({
        login: GUEST_STATUS
      })
      console.log(err.message)
    })

  }

  render() {
    console.log(MEMBER_STATUS)
    console.log(this.route(this.state.login))
    return this.route(this.state.login)


  }
}

export default App
