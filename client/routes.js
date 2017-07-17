import React from 'react'
import { Route, HashRouter } from 'react-router-dom'
import { Home, ProjectGroups, Interface } from './containers/index'
import Header from './components/Header/Header'

export default () => {
  return (
    <HashRouter>
      <div className="router-main">
        <Header/>
        <Route path="/" component={ Home } exact />
        <Route path="/ProjectGroups" component={ ProjectGroups } />
        <Route path="/Interface" component={ Interface } />
      </div>
    </HashRouter>
  )
}
