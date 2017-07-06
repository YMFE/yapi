import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Home, ProjectGroups } from './containers/index'

export default store => {
  return (
    <Router>
      <Route path="/" component={ ProjectGroups } />
    </Router>
  )
}