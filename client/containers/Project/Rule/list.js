import './list.scss'
import React from 'react'
import { Table, Popconfirm } from 'antd'
import PropTypes from 'prop-types'

class InterfaceTemplateList extends  React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }
  static propTypes = {
    list: PropTypes.array,
    editrule: PropTypes.func,
    deleterule: PropTypes.func
  };
  render() {
    const columns = [
      {
        title: '规则名称',
        dataIndex: 'title',
        key: 'title'
      }, {
        title: '创建者',
        dataIndex: 'username',
        key: 'username'
      }, {
        title: '描述',
        dataIndex: 'desc',
        key: 'desc'
      }, {
        title: '操作',
        dataIndex: 'handle',  
        key: 'handle',
        render: (value, record) => {
          return (
            <div className="handle-interface-list">
              <a href="javascript:void(0)" onClick={() => {this.props.editrule(record)}}>编辑</a>
              <Popconfirm onConfirm={() => {this.props.deleterule(record)}} title="删除确认？" okText="确定" cancelText="取消">
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            </div>
          )
        }
      }
    ]
    return (
      <div>
        <Table
          rowKey={record => record._id}
          columns={columns}
          dataSource={this.props.list}
        />
      </div>
    )
  }
}
export default InterfaceTemplateList