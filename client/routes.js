import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Home, Login, ProjectGroups } from './containers/index'

export default store => {
  return (
    <Router>
      <div className="router-main">
        <Route path="/" component={ Home } />
        <Route path="/Login" component={ Login } />
        <Route path="/ProjectGroups" component={ ProjectGroups } />
      </div>
    </Router>
  )
}