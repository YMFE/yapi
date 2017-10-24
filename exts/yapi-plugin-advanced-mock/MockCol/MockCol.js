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
    const { caseData: currcase } = this.state;
    const interface_id = this.props.match.params.actionId;
    const project_id = this.props.match.params.id;
    caseData = Object.assign({
      ...caseData,
      interface_id: interface_id,
      project_id: project_id
    })
    if (!this.state.isAdd) {
      caseData.id = currcase._id;
    }
    await axios.post('/api/plugin/advmock/case/save', caseData).then(async res => {
      if (res.data.errcode === 0) {
        message.success(this.state.isAdd ? '添加成功' : '保存成功');
        await this.props.fetchMockCol(interface_id);
        this.setState({ caseDesModalVisible: false })
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
    const initCaseData = {
      ip: '',
      ip_enable: false,
      name: '',
      code: '200',
      deplay: 0,
      headers: [{name: '', value: ''}],
      paramsArr: [{name: '', value: ''}],
      res_body: ''
    }

    const columns = [{
      title: '期望名称',
      dataIndex: 'name',
      key: 'name'
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
      dataIndex: 'up_time',
      key: 'up_time',
      render: text => formatTime(text)
    }, {
      title: '操作',
      dataIndex: '_id',
      key: '_id',
      render: (_id, recode) => {
        return (
          <div>
            <span style={{marginRight: 5}}>
              <Button size="small" onClick={() => this.setState({
                isAdd: false,
                caseDesModalVisible: true,
                caseData: recode
              })}>编辑</Button>
            </span>
            <span>
              <Button size="small" onClick={() => {}}>删除</Button>
            </span>
          </div>
        )
      }
    }];

    return (
      <div>
        <div style={{marginBottom: 8}}>
          <Button type="primary" onClick={() => this.setState({
            isAdd: true,
            caseDesModalVisible: true,
            caseData: initCaseData
          })}>添加期望</Button>
        </div>
        <Table columns={columns} dataSource={data} pagination={false} rowKey='_id' />
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
