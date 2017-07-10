// import { React, Component } from '../../base.js'
import './Home.scss'
import React, { Component } from 'react'
import Header from '../../components/Header/Header.js'

class Home extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <acticle className="home-main">
        <Header />
      </acticle>
    )
  }
}

export default Home
