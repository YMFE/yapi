import React, { Component } from 'react'
import { Table } from 'antd'
import PropTypes from 'prop-types'
import axios from 'axios'
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
    }, {
      title: '接口URL',
      dataIndex: 'path',
      key: 'path'
    },{
      title: '更新日期',
      dataIndex: 'add_time',
      key: 'add_time'
    }, {
      title: '功能',
      'key': 'action',
      render: (data) => {
        const deleteInterface = this.deleteInterface.bind(this, data._id)
        console.log(data)
        return (
          <span>
            <Link to={`/AddInterface/edit/${data._id}`}><span>编辑</span></Link>
            <span className="ant-divider" />
            <Link to={`/AddInterface/edit/${data._id}`}><span>测试</span></Link>
            <span className="ant-divider" />
            <a onClick={deleteInterface}>删除</a>
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
