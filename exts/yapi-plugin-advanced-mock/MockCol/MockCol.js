import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { Table, Button, message } from 'antd';
import { fetchMockCol } from '../../../client/reducer/modules/mockCol'
import { formatTime } from '../../../client/common.js';
import CaseDesModal from './CaseDesModal';

@connect(
  state => {
    return {
      list: state.mockCol.list
    }
  },
  {
    fetchMockCol
  }
)
@withRouter
export default class MockCol extends Component {
  static propTypes = {
    list: PropTypes.array,
    match: PropTypes.object,
    fetchMockCol: PropTypes.func
  }

  state = {
    caseData: {},
    caseDesModalVisible: false,
    isAdd: false
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const interfaceId = this.props.match.params.actionId
    this.props.fetchMockCol(interfaceId);
  }

  handleOk = async (caseData) => {
    const interface_id = this.props.match.params.action;
    const project_id = this.props.match.params.id;
    caseData = Object.assign({
      ...caseData,
      interface_id: interface_id,
      project_id: project_id
    })
    if (!this.state.isAdd) {
      caseData.id = 0;
    }
    axios.post('/api/plugin/advmock/case/save', caseData).then(res => {
      if (res.data.errcode === 0) {
        message.success(this.state.isAdd ? '添加成功' : '保存成功');
      } else {
        message.error(res.data.errmsg);
      }
    })
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  render() {

    const data = this.props.list;
    const { isAdd, caseData, caseDesModalVisible } = this.state;

    const columns = [{
      title: '期望名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <a href="#">{text}</a>
    }, {
      title: 'ip',
      dataIndex: 'ip',
      key: 'ip'
    }, {
      title: '创建人',
      dataIndex: 'username',
      key: 'username'
    }, {
      title: '编辑时间',
      key: 'action',
      render: text => formatTime(text)
    }, {
      title: '操作',
      dataIndex: 'address',
      key: 'address'
    }];

    return (
      <div style={{ padding: '20px 10px' }}>
        <Button type="primary" onClick={() => this.setState({isAdd: true, caseDesModalVisible: true})}>添加期望</Button>
        <Table columns={columns} dataSource={data} />
        <CaseDesModal
          visible={caseDesModalVisible}
          isAdd={isAdd}
          caseData={caseData}
          onOk={this.handleOk}
          onCancel={() => this.setState({caseDesModalVisible: false})}
          ref={this.saveFormRef}
        ></CaseDesModal>
      </div>
    )
  }
}
