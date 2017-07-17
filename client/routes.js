import React from 'react'

import { Route, HashRouter } from 'react-router-dom'
import { Home, ProjectGroups, Interface, News } from './containers/index'
import User from './containers/User/User.js'

import Header from './components/Header/Header'

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
      </div>

    </HashRouter>
  )
}
   