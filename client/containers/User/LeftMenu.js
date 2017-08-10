import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Menu, AutoComplete, Input, Icon } from 'antd'
import axios from 'axios'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Avatar from './Avatar.js'

const Option = AutoComplete.Option;
@connect(
  state => {
    console.log(state);
    return {
      curUid: state.user.uid + '',
      curUserName: state.user.userName,
      curUserRole: state.user.role
    }
  }
)
class LeftMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: []
    }
    this.searchSign = 0;
    this._searchSign = 0;
    this.interval = null;
  }

  static propTypes = {
    curUid: PropTypes.string,
    curUserName: PropTypes.string,
    curUserRole: PropTypes.string
  }

  //延迟搜索
  handleSearch = (value) => {
    if(!value || value.length < 1) return ;
    this.searchSign = this.searchSign + 1;
    this.interval && clearInterval(this.interval)
    this.interval = setInterval(() => {
      if (this.searchSign === this._searchSign) {
        this.interval = clearInterval(this.interval)
        axios.get('/user/search?q=' + value).then((res) => {
          if (res.data.errcode === 0) {
            this.setState({
              dataSource: res.data.data
            })
          }
        })

      } else {
        this._searchSign = this.searchSign;
      }
    }, 60)

  }

  renderOption = (item) => {
    return (
      <Option key={item.uid} text={item.username} >
        <Link to={"/user/profile/" + item.uid} > {item.username} </Link>
      </Option>
    )
  }

  render() {
    const menus = [{
      title: '个人资料',
      path: `/user/profile/${this.props.curUid}`
    }
    ]
    if(this.props.curUserRole === 'admin'){
      menus.push({
        title: '用户管理',
        path: '/user/list'
      })
    }
    let content = menus.map((menu) => {
      return (
        <Menu.Item key={'#' + menu.path} >
          <Link to={menu.path} >{menu.title}</Link>
        </Menu.Item>
      )
    })

    const { dataSource } = this.state;
    return (<div className="user-list">
      <div className='cur-user'>
        <Avatar />
        <div className='user-name'><span>用户名 :</span>{`${this.props.curUserName}`}</div>
      </div>
      <Row type="flex" justify="start" className="search">
        <Col span="24">
          <div className="certain-category-search-wrapper" style={{ width: "100%" }}>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              size="large"
              style={{ width: '100%' }}
              dataSource={dataSource.map(this.renderOption)}
              onSearch={this.handleSearch}
              placeholder="搜索用户"
              optionLabelProp="text"
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </div>
        </Col>
      </Row>
      <Menu mode='inline' defaultSelectedKeys={[location.hash]} className="user-nav">
        {content}
      </Menu>
    </div>
    )
  }
}

export default LeftMenu
