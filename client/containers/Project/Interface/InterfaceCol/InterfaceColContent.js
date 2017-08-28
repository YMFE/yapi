import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Table, Tooltip } from 'antd'
import { fetchInterfaceColList, fetchCaseList, setColData } from '../../../../reducer/modules/interfaceCol'
import { formatTime } from '../../../../common.js'

@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currColId: state.interfaceCol.currColId,
      currCaseId: state.interfaceCol.currCaseId,
      isShowCol: state.interfaceCol.isShowCol,
      currCaseList: state.interfaceCol.currCaseList
    }
  },
  {
    fetchInterfaceColList,
    fetchCaseList,
    setColData
  }
)
@withRouter
export default class InterfaceColContent extends Component {

  static propTypes = {
    match: PropTypes.object,
    interfaceColList: PropTypes.array,
    fetchInterfaceColList: PropTypes.func,
    fetchCaseList: PropTypes.func,
    setColData: PropTypes.func,
    history: PropTypes.object,
    currCaseList: PropTypes.array,
    currColId: PropTypes.number,
    currCaseId: PropTypes.number,
    isShowCol: PropTypes.bool
  }

  constructor(props) {
    super(props)
  }

  async componentWillMount() {
    const result = await this.props.fetchInterfaceColList(this.props.match.params.id)
    let { currColId } = this.props;
    const params = this.props.match.params;
    const { actionId } = params;
    currColId = +actionId ||
                result.payload.data.data.find(item => +item._id === +currColId) && +currColId ||
                result.payload.data.data[0]._id;
    this.props.history.push('/project/' + params.id + '/interface/col/' + currColId)
    this.props.fetchCaseList(currColId)
    this.props.setColData({currColId: +currColId, isShowCol: true})
  }

  componentWillReceiveProps(nextProps) {
    const { interfaceColList } = nextProps;
    const { actionId: oldCaseId, id } = this.props.match.params
    let newCaseId = nextProps.match.params.actionId
    if (!interfaceColList.find(item => +item._id === +newCaseId)) {
      this.props.history.push('/project/' + id + '/interface/col/' + interfaceColList[0]._id)
    } else if (oldCaseId !== newCaseId) {
      this.props.fetchCaseList(newCaseId);
      this.props.setColData({currColId: +newCaseId, isShowCol: true})
    }
  }

  render() {

    const { currCaseList } = this.props;

    const columns = [{
      title: '用例名称',
      dataIndex: 'casename',
      key: 'casename'
    }, {
      title: '接口路径',
      dataIndex: 'path',
      key: 'path',
      render: (path, record) => {
        return (
          <Tooltip title="跳转到对应接口">
            <a href={`/project/2909/interface/api/${record.interface_id}`}>{path || 'fdsf'}</a>
          </Tooltip>
        )
      }
    }, {
      title: '请求方式',
      dataIndex: 'method',
      key: 'method'
    }, {
      title: '更新时间',
      dataIndex: 'up_time',
      key: 'up_time',
      render: (item) => {
        return <span>{formatTime(item)}</span>
      }
    }];

    return (
      <div>
        <div style={{padding:"15px"}}>
          <h2 style={{marginBottom: '10px'}}>测试集合</h2>
          <Table dataSource={currCaseList} columns={columns} pagination={false} rowKey="_id"/>
        </div>
      </div>
    )
  }
}
