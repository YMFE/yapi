import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { message } from 'antd'
import { fetchInterfaceColList, setColData, fetchCaseData } from '../../../../reducer/modules/interfaceCol'
import { Postman } from '../../../../components'

@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currColId: state.interfaceCol.currColId,
      currCaseId: state.interfaceCol.currCaseId,
      currCase: state.interfaceCol.currCase,
      isShowCol: state.interfaceCol.isShowCol,
      currProject: state.project.currProject
    }
  },
  {
    fetchInterfaceColList,
    fetchCaseData,
    setColData
  }
)
@withRouter
export default class InterfaceCaseContent extends Component {

  static propTypes = {
    match: PropTypes.object,
    interfaceColList: PropTypes.array,
    fetchInterfaceColList: PropTypes.func,
    fetchCaseData: PropTypes.func,
    setColData: PropTypes.func,
    history: PropTypes.object,
    currColId: PropTypes.number,
    currCaseId: PropTypes.number,
    currCase: PropTypes.object,
    isShowCol: PropTypes.bool,
    currProject: PropTypes.object
  }

  constructor(props) {
    super(props)
  }

  getColId(colList, currCaseId) {
    let currColId = 0;
    colList.forEach(col => {
      col.caseList.forEach(caseItem => {
        if (+caseItem._id === currCaseId) {
          currColId = col._id;
        }
      })
    })
    return currColId;
  }

  async componentWillMount() {
    const result = await this.props.fetchInterfaceColList(this.props.match.params.id)
    let { currCaseId } = this.props;
    const params = this.props.match.params;
    const { actionId } = params;
    currCaseId = +actionId || +currCaseId || result.payload.data.data[0].caseList[0]._id;
    let currColId = this.getColId(result.payload.data.data, currCaseId);
    this.props.history.push('/project/' + params.id + '/interface/case/' + currCaseId)
    this.props.fetchCaseData(currCaseId)
    this.props.setColData({currCaseId: +currCaseId, currColId, isShowCol: false})
  }

  componentWillReceiveProps(nextProps) {
    const oldCaseId = this.props.match.params.actionId
    const newCaseId = nextProps.match.params.actionId
    if (oldCaseId !== newCaseId) {
      let currColId = this.getColId(this.props.interfaceColList, newCaseId);
      this.props.fetchCaseData(newCaseId);
      this.props.setColData({currCaseId: +newCaseId, currColId, isShowCol: false})
    }
  }

  savePostmanRef = (postman) => {
    this.postman = postman;
  }

  updateCase = async () => {
    const {
      caseEnv: case_env,
      pathname: path,
      method,
      pathParam: req_params,
      query: req_query,
      headers: req_headers,
      bodyType: req_body_type,
      bodyForm: req_body_form,
      bodyOther: req_body_other
    } = this.postman.state;
    const {_id: id, casename} = this.props.currCase;
    const res = await axios.post('/api/col/up_case', {
      id,
      casename,
      case_env,
      path,
      method,
      req_params,
      req_query,
      req_headers,
      req_body_type,
      req_body_form,
      req_body_other
    });
    if (res.data.errcode) {
      message.error(res.data.errmsg)
    } else {
      message.success('更新成功')
      this.props.fetchCaseData(id);
    }
  }

  render() {
    const { currCase, currProject } = this.props;
    const data = Object.assign({}, currCase, currProject, {_id: currCase._id});
    return (
      <div style={{padding: '6px 0'}}>
        <h1 style={{marginLeft: 8}}>
          {currCase.casename}
          <span style={{marginLeft: 6, fontSize: 12}}>
            <Link to={`/project/${currProject._id}/interface/api/${currCase.interface_id}`}>对应接口</Link>
          </span>
        </h1>
        <div>
          <Postman data={data} type="case" saveTip="更新保存修改" save={this.updateCase} ref={this.savePostmanRef} />
        </div>
      </div>
    )
  }
}
