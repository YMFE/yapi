import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import axios from 'axios'
import {
  Table, Tag
} from 'antd';
import { formatTime } from '../../../../common.js'

@connect(
  state => {
    return {
      curProject: state.project.currProject
    }
  })
class InterfaceList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      sortedInfo: {
        order: 'ascend',
        columnKey: 'title'
      }
    }
  }

  static propTypes = {
    match: PropTypes.object,
    curProject: PropTypes.object
  }

  handleRequest = async (props) => {
    const { params } = props.match;
    if (!params.actionId) {
      let projectId = params.id;
      let r = await axios.get('/api/interface/list?project_id=' + projectId);
      this.setState({
        data: r.data.data
      })
    } else if (isNaN(params.actionId)) {
      let catid = params.actionId.substr(4)
      let r = await axios.get('/api/interface/list_cat?catid=' + catid);
      this.setState({
        data: r.data.data
      })
    }
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter
    });
  }

  componentWillMount() {
    this.actionId = this.props.match.params.actionId;
    this.handleRequest(this.props)
  }

  componentWillReceiveProps(nextProps) {
    let _actionId = nextProps.match.params.actionId;
    if (this.actionId !== _actionId) {
      this.actionId = _actionId;
      this.handleRequest(nextProps)
    }
  }

  render() {
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    const columns = [{
      title: '接口名称',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => {
        return a.title.localeCompare(b.title) === 1
      },
      sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order
    }, {
      title: '接口路径',
      dataIndex: 'path',
      key: 'path',
      render: (item)=>{
        return <span>{this.props.curProject.basepath + item}</span>
      }
    }, {
      title: '请求方式',
      dataIndex: 'method',
      key: 'method'
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (item) => {
        return <div>{item === 'done' ?
          <Tag color="#87d068">完成</Tag>
          :
          <Tag color="#f50">未完成</Tag>
        }</div>
      },
      filters: [{
        text: '完成',
        value: 'done'
      }, {
        text: '未完成',
        value: 'undone'
      }],
      onFilter: (value, record) => record.status.indexOf(value) === 0
    }, {
      title: '更新日期',
      dataIndex: 'up_time',
      key: 'up_time',
      render: (item) => {
        return <span>{formatTime(item)}</span>
      }
    }]

    const data = this.state.data.map(item => {
      item.key = item._id;
      return item;
    });

    return (
      <div style={{padding:"15px"}}>
        <h2 style={{marginBottom: '10px'}}>接口列表</h2>
        <Table pagination={false} columns={columns} onChange={this.handleChange} dataSource={data} />
      </div>
    )
  }
}

export default InterfaceList