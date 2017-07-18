import React, { Component } from 'react'
import {formatTime} from '../../common.js'
import { Link } from 'react-router-dom'
//import PropTypes from 'prop-types'
import {
  Table,
  Button
} from 'antd'
import axios from 'axios';



const columns = [{
  title: 'UID',
  dataIndex: '_id',
  key: '_id'
}, {
  title: '用户名',
  dataIndex: 'username',
  key: 'username'
}, {
  title: 'Email',
  dataIndex: 'email',
  key: 'email'
}, {
  title: '用户角色',
  dataIndex: 'role',
  key: 'role'
}, {
  title: '更新日期',
  dataIndex: 'up_time',
  key: 'up_time'
}, {
  title: '功能',
  key: 'action',
  render: (item) => {
    return (
      <span>
        <Button type="primary"><Link to={"/user/profile/"+item._id} > 查看 </Link></Button>
        <Button type="danger">删除</Button>
      </span>
    )
  }
}]

class List extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  getUserList() {
    axios.get('/user/list').then((res) => {
      let result = res.data;

      if (result.errcode === 0) {    
        let list = result.data.list;
        list.map( (item, index) => {
          item.key = index;
          item.up_time = formatTime(item.up_time)
        } )
        this.setState({
          data: list
        });
      }
    })
  }

  componentDidMount() {
    this.getUserList()
  }

  render() {

    const data = this.state.data;

    return (
      <section className="user-table">

        <Table columns={columns} dataSource={data} />

      </section>
    )
  }
}

export default List
