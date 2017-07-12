import React, { Component } from 'react'
import { Table, Button } from 'antd'
import PropTypes from 'prop-types'

class InterfaceTable extends Component {
  static propTypes = {
    data: PropTypes.array,
  }

  constructor(props) {
    super(props)
  }

  render () {
    const columns = [{
      title: '接口名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '接口URL',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '操作者',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: '更新日期',
      dataIndex: 'date',
      key: 'date',
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

    const data = this.props.data;
    console.log(this.props.data)

    return (
      <section className="interface-table">
        <Table columns={columns} dataSource={data} />
      </section>
    )
  }
}

export default InterfaceTable