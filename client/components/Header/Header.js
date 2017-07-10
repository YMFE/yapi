import './Header.scss'
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

class Header extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <acticle className="header-box">
        <div className="content">
          <h1>YAPI</h1>

          <ul>
            <li>
              <Link to={`/Login`}>登录</Link>
            </li>
            <li>
              <Link to={`/ProjectGroups`}>分组</Link>
            </li>
          </ul>

          <em><i className="iconfont" data-reactid="30"></i>王亮</em>
        </div>
      </acticle>
    )
  }
}

export default Header