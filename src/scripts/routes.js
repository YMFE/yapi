import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Home } from '../../client/containers/index'

export default store => {
  return (
    <Router>
      <Route path="/" component={ Home } />
    </Router>
  )
}