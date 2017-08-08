import React from 'react'
import { Route, HashRouter } from 'react-router-dom'
import { Header, Home, ProjectGroups, Interface, News, AddInterface, Follows } from './containers/index'
import User from './containers/User/User.js'

export default () => {
  return (
    <HashRouter>
      <div className="router-main">
        <Header/>
        <Route path="/" component={ Home } exact />

        <Route path="/group" component={ ProjectGroups } >
          <Route  exact={false} path="/group/:groupName" component={ ProjectGroups } />
        </Route>
        <Route path="/project" component={ Interface } />
        <Route path="/user" component={User} />
        <Route path="/news" component={ News } />
        <Route path="/add-interface" component={ AddInterface } />
        <Route path="/follow" component={ Follows } />
      </div>
    </HashRouter>
  )
}
