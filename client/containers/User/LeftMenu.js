import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {Input, Row, Col} from 'antd'

class LeftMenu extends Component {


  constructor(props) {
    super(props)
    this.state = {
      curitem: 'profile'
    }
    console.log(this.props)
  }

  handleCurItem(curitem) {
    return () => {
      this.setState({
        curitem: curitem
      })
    }
  }

  render() {
    const menus = [{
      title: '个人资料',
      path: '/user/profile'
    }, {
      title: '用户管理',
      path: '/user/list'
    }
    ]

    let content = menus.map((menu, index) => {
      return (
        <li key={index} className={location.hash === '#' + menu.path ? 'active' : ''}>
          <Link to={menu.path} >{menu.title}</Link>
        </li>
      )
    })

    const Search = Input.Search;

    return (<div>
      <Row type="flex" justify="start" className="search">
        <Col span="24">
          <Search
            placeholder="搜索用户"
            onSearch={value => console.log(value)}
          />
        </Col>

      </Row>
      <ul className="user-list">
        {content}
      </ul>
    </div>
    )
  }
}

export default LeftMenu