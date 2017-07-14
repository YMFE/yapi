import React, { Component } from 'react'
import { Table, Button } from 'antd'
import PropTypes from 'prop-types'

class InterfaceTable extends Component {
  static propTypes = {
    data: PropTypes.array
  }

  constructor(props) {
    super(props)
  }

  render () {
    const columns = [{
      title: 'Uid',
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
      'key': 'action',
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
      {uid: 1, username: 'admin', email: 'admin@admin.com', up_time: '2017.07.01'}
    ];

    return (
      <section className="interface-table">
        <Table columns={columns} dataSource={data} />
      </section>
    )
  }
}

export default InterfaceTable
