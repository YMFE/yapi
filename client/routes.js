import React from 'react'
import { Route, HashRouter } from 'react-router-dom'
import { Header, Home, ProjectGroups, Interface, News, AddInterface } from './containers/index'
import User from './containers/User/User.js'

export default () => {
  return (
    <HashRouter>
      <div className="router-main">
        <Header/>
        <Route path="/" component={ Home } exact />
        <Route path="/ProjectGroups" component={ ProjectGroups } />
        <Route path="/Interface" component={ Interface } />
        <Route path="/user" component={User} />
        <Route path="/News" component={ News } />
        <Route path="/AddInterface" component={ AddInterface } />
      </div>
    </HashRouter>
  )
}
