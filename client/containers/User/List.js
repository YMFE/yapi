import React, { Component } from 'react'
//import PropTypes from 'prop-types'
import {
  Table,
  Button
} from 'antd'



class List extends Component {

  constructor(props) {
    super(props)

  }

  render() {

    const columns = [{
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid'
    }, {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    }, {
      title: 'email',
      dataIndex: 'email',
      key: 'email'
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
            <Button type="primary">编辑</Button>
            <Button type="danger">删除</Button>
          </span>
        )
      }
    }]

 
    const data = [
      { uid: 1, username: 'admin', email: 'admin@admin.com', up_time: '2017.07.01', key: 1 },
      { uid: 2, username: 'admin2', email: 'admin21113qq3ß@admin311.com', up_time: '2017.07.21', key: 2 }
    ];

    return (
      <section className="user-table">

        <Table columns={columns} dataSource={data} />

      </section>
    )
  }
}

export default List
