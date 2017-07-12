import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
import { Table } from 'antd'

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <a href="#">{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Action',
  key: 'action',
  render: () => (
    <span>
      <a href="#">修改</a>
      <span className="ant-divider" />
      <a href="#">删除</a>
    </span>
  ),
}];

const data = [{
  key: '1',
  age: 32
}, {
  key: '2',
  age: 42
}, {
  key: '3',
  age: 32
}];



export default class GroupList extends Component {
  render() {
    return (
      <Table columns={columns} dataSource={data} />
    );
  }
}
