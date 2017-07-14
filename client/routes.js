import React from 'react'
import { Route, HashRouter } from 'react-router-dom'
import { Home, Login, ProjectGroups, Interface } from './containers/index'

export default () => {
  return (
    <HashRouter>
      <div className="router-main">
        <Route path="/" component={ Home } exact />
        <Route path="/Login" component={ Login } />
        <Route path="/ProjectGroups" component={ ProjectGroups } />
        <Route path="/Interface" component={ Interface } />
      </div>
    </HashRouter>
  )
}
