import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Input, Row, Col } from 'antd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

@connect(
  state => {
    return {
      curUid: state.user.curUid
    }
  }
)

class LeftMenu extends Component {
  static propTypes = {
    curUid: PropTypes.string
  }
  constructor(props) {
    super(props)
  }

  handleActive = () => {
    this.setState({
      ______a: 1 //强制刷新
    })
  }

  render() {
    const menus = [{
      title: '个人资料',
      path: "/user/profile/107"
    }, {
      title: '用户管理',
      path: '/user/list',
      auth: (role) => {
        if (role === 'admin') {
          return true;
        }
        return false;
      }
    }
    ]

    let content = menus.map((menu, index) => {
      if (typeof menu.auth === 'function' && menu.auth('admin') === false) {
        return '';
      }
      return (
        <li onClick={this.handleActive} key={index} className={location.hash === '#' + menu.path ? 'active' : ''}>
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