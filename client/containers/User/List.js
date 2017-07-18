import React, { Component } from 'react'
//import PropTypes from 'prop-types'
import {
  Table,
  Button
} from 'antd'
import axios from 'axios';


const columns = [{
  title: 'UID',
  dataIndex: 'uid',
  key: 'uid'
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
  render: () => {
    return (
      <span>
        <Button type="primary">查看</Button>
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
      let data = res.data;
      if (res.errno === 0) {
        this.setState('data', data.data);
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
