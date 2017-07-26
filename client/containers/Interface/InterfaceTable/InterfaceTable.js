import React, { Component } from 'react'
import { Table, Popconfirm, message } from 'antd'
import PropTypes from 'prop-types'
import axios from 'axios'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteInterfaceData } from '../../../actions/interfaceAction.js'

@connect(
  state => {
    return {
      interfaceData: state.Interface.interfaceData
    }
  },
  {
    deleteInterfaceData
  }
)

class InterfaceTable extends Component {
  static propTypes = {
    interfaceData: PropTypes.array,
    data: PropTypes.array,
    projectId: PropTypes.string,
    deleteInterfaceData: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  @autobind
  confirm (interfaceId) {
    this.deleteInterface(interfaceId)
    message.success('删除成功!');
  }

  deleteInterfaceData (interfaceId) {
    let interfaceArr = []
    let { interfaceData } = this.props
    interfaceData.forEach(value => {
      if (value._id !== interfaceId) {
        interfaceArr.push(value)
      }
    })
    this.props.deleteInterfaceData(interfaceArr)
  }

  deleteInterface (interfaceId) {
    const params = {
      id: interfaceId
    }
    axios.post('/interface/del', params)
      .then(() => {
        this.deleteInterfaceData(interfaceId)
      })
      .catch(err => {
        console.log(err)
      })
  }

  render () {
    const columns = [{
      title: '接口名称',
      dataIndex: 'title',
      key: 'title'
    },{
      title: '接口URL',
      dataIndex: 'path',
      key: 'path'
    },{
      title: '请求方式',
      dataIndex: 'method',
      key: 'method'
    },{
      title: '更新日期',
      dataIndex: 'add_time',
      key: 'add_time'
    }, {
      title: '功能',
      'key': 'action',
      render: (data) => {
        // const deleteInterface = this.deleteInterface.bind(this, data._id)
        const confirm = this.confirm.bind(this, data._id)
        return (
          <span>
            <Link to={`/AddInterface/edit/${data._id}`}><span>编辑</span></Link>
            <span className="ant-divider" />
            <Link to={`/AddInterface/edit/${data._id}`}><span>测试</span></Link>
            <span className="ant-divider" />
            <Popconfirm title="是否删除接口!" onConfirm={confirm} okText="Yes" cancelText="No">
              <a href="">删除</a>
            </Popconfirm>
          </span>
        )
      }
    }]

    const data = this.props.data;

    return (
      <section className="interface-table">
        <Table bordered={true} columns={columns} dataSource={data} />
      </section>
    )
  }
}

export default InterfaceTable
