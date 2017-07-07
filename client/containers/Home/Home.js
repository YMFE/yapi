// import { React, Component } from '../../base.js'
import '../../styles/Home/Home.scss'
import React, { Component } from 'react'
import { Button, Input, Icon, Checkbox } from 'antd'
import Header from '../../components/Header/Header.js'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

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