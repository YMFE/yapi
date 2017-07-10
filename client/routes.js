import React from 'react'
import { Route, HashRouter, Redirect } from 'react-router-dom'
import { Home, Login, ProjectGroups } from './containers/index'

export default store => {
  return (
    <HashRouter>
      <div className="router-main">
        <Route path="/" component={ Home } />
        <Route path="/Login" component={ Login } />
        <Route path="/ProjectGroups" component={ ProjectGroups } />
      </div>
    </HashRouter>
  )
}
