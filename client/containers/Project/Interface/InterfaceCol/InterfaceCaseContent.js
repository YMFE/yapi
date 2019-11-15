import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { message, Tooltip, Input } from 'antd';
import { getEnv ,getToken} from '../../../../reducer/modules/project';
import {
  fetchInterfaceColList,
  setColData,
  fetchCaseData,
  fetchCaseList
} from '../../../../reducer/modules/interfaceCol';
import { Postman } from '../../../../components';

import './InterfaceCaseContent.scss';

@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currColId: state.interfaceCol.currColId,
      currCaseId: state.interfaceCol.currCaseId,
      currCase: state.interfaceCol.currCase,
      isShowCol: state.interfaceCol.isShowCol,
      currProject: state.project.currProject,
      projectEnv: state.project.projectEnv,
      curUid: state.user.uid,
      token: state.project.token
    };
  },
  {
    fetchInterfaceColList,
    fetchCaseData,
    setColData,
    fetchCaseList,
    getEnv,
    getToken
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
    fetchCaseList: PropTypes.func,
    history: PropTypes.object,
    currColId: PropTypes.number,
    currCaseId: PropTypes.number,
    currCase: PropTypes.object,
    isShowCol: PropTypes.bool,
    currProject: PropTypes.object,
    getEnv: PropTypes.func,
    getToken: PropTypes.func,
    token: PropTypes.string,
    projectEnv: PropTypes.object,
    curUid: PropTypes.number
  };

  state = {
    isEditingCasename: true,
    editCasename: ''
  };

  constructor(props) {
    super(props);
    this.cancelSourceSet = new Set();
  }

  /**
   * 取消上一次的请求
   */
  cancelRequestBefore = () => {
    this.cancelSourceSet.forEach(v => {
      v.cancel();
    });
    this.cancelSourceSet.clear();
  };

  getColId(colList, currCaseId) {
    let currColId = 0;
    colList.forEach(col => {
      col.caseList&&col.caseList.forEach(caseItem => {
        if (+caseItem._id === +currCaseId) {
          currColId = col._id;
        }
      });
    });
    return currColId;
  }

  async componentWillMount() {
    let cancelSource = axios.CancelToken.source();
    this.cancelSourceSet.add(cancelSource);
    const result = await this.props.fetchInterfaceColList(this.props.match.params.id, {
      cancelToken: cancelSource.token
    });
    this.cancelSourceSet.delete(cancelSource);
    if (axios.isCancel(result.payload)) return;

    let { currCaseId } = this.props;
    const params = this.props.match.params;
    const { actionId } = params;
    currCaseId = +actionId || +currCaseId || result.payload.data.data[0].caseList[0]._id;
    let currColId = this.getColId(result.payload.data.data, currCaseId);
    this.props.history.push('/project/' + params.id + '/interface/case/' + currCaseId);

    cancelSource = axios.CancelToken.source();
    this.cancelSourceSet.add(cancelSource);
    // 先 fetchCaseData 然后 this.props.currCase 才会有数据
    let res = await this.props.fetchCaseData(currCaseId, {
      cancelToken: cancelSource.token
    });
    this.cancelSourceSet.delete(cancelSource);
    if (axios.isCancel(res.payload)) return;

    cancelSource = axios.CancelToken.source();
    this.cancelSourceSet.add(cancelSource);
    let resArr = await Promise.all([
      // 获取当前case 下的环境变量
      this.props.getEnv(this.props.currCase.project_id, {
        cancelToken: cancelSource.token
      }),
      this.props.getToken(this.props.currCase.project_id, {
        cancelToken: cancelSource.token
      })
    ]);
    this.cancelSourceSet.delete(cancelSource);
    if (resArr.some(res => axios.isCancel(res.payload))) return;

    this.props.setColData({ currCaseId: +currCaseId, currColId, isShowCol: false });
    // await this.getCurrEnv()

    this.setState({ editCasename: this.props.currCase.casename });
  }

  async componentWillReceiveProps(nextProps) {
    const oldCaseId = this.props.match.params.actionId;
    const newCaseId = nextProps.match.params.actionId;
    const { interfaceColList } = nextProps;
    let currColId = this.getColId(interfaceColList, newCaseId);
    if (oldCaseId !== newCaseId) {

      this.cancelRequestBefore();
      let cancelSource = axios.CancelToken.source();
      this.cancelSourceSet.add(cancelSource);
      let res = await this.props.fetchCaseData(newCaseId, {
        cancelToken: cancelSource.token
      });
      this.cancelSourceSet.delete(cancelSource);
      if (axios.isCancel(res.payload)) return;

      this.cancelRequestBefore();
      cancelSource = axios.CancelToken.source();
      this.cancelSourceSet.add(cancelSource);
      res = await this.props.getEnv(this.props.currCase.project_id, {
        cancelToken: cancelSource.token
      });
      this.cancelSourceSet.delete(cancelSource);
      if (axios.isCancel(res.payload)) return;

      this.props.setColData({ currCaseId: +newCaseId, currColId, isShowCol: false });
      // await this.getCurrEnv()
      this.setState({ editCasename: this.props.currCase.casename });
    }
  }

  componentWillUnmount() {
    this.cancelRequestBefore();
  }

  savePostmanRef = postman => {
    this.postman = postman;
  };

  updateCase = async () => {
    const {
      case_env,
      req_params,
      req_query,
      req_headers,
      req_body_type,
      req_body_form,
      req_body_other,
      test_script,
      enable_script,
      test_res_body,
      test_res_header,
      case_pre_script,
      case_post_script
    } = this.postman.state;

    const { editCasename: casename } = this.state;
    const { _id: id } = this.props.currCase;
    let params = {
      id,
      casename,
      case_env,
      req_params,
      req_query,
      req_headers,
      req_body_type,
      req_body_form,
      req_body_other,
      test_script,
      enable_script,
      test_res_body,
      test_res_header,
      case_pre_script,
      case_post_script
    };

    console.log({params});
    const res = await axios.post('/api/col/up_case', params);
    if (this.props.currCase.casename !== casename) {
      this.props.fetchInterfaceColList(this.props.match.params.id);
    }
    if (res.data.errcode) {
      message.error(res.data.errmsg);
    } else {
      message.success('更新成功');
      this.props.fetchCaseData(id);
    }
  };

  triggerEditCasename = () => {
    this.setState({
      isEditingCasename: true,
      editCasename: this.props.currCase.casename
    });
  };
  cancelEditCasename = () => {
    this.setState({
      isEditingCasename: false,
      editCasename: this.props.currCase.casename
    });
  };

  render() {
    const { currCase, currProject, projectEnv } = this.props;
    const { isEditingCasename, editCasename } = this.state;

    const data = Object.assign(
      {},
      currCase,
      {
        env: projectEnv.env,
        pre_script: currProject.pre_script,
        after_script: currProject.after_script
      },
      { _id: currCase._id }
    );

    return (
      <div style={{ padding: '6px 0' }} className="case-content">
        <div className="case-title">
          {!isEditingCasename && (
            <Tooltip title="点击编辑" placement="bottom">
              <div className="case-name" onClick={this.triggerEditCasename}>
                {currCase.casename}
              </div>
            </Tooltip>
          )}

          {isEditingCasename && (
            <div className="edit-case-name">
              <Input
                value={editCasename}
                onChange={e => this.setState({ editCasename: e.target.value })}
                style={{ fontSize: 18 }}
              />
            </div>
          )}
          <span className="inter-link" style={{ margin: '0px 8px 0px 6px', fontSize: 12 }}>
            <Link
              className="text"
              to={`/project/${currCase.project_id}/interface/api/${currCase.interface_id}`}
            >
              对应接口
            </Link>
          </span>
        </div>
        <div>
          {Object.keys(currCase).length > 0 && (
            <Postman
              data={data}
              projectToken={this.props.token}
              type="case"
              saveTip="更新保存修改"
              save={this.updateCase}
              ref={this.savePostmanRef}
              interfaceId={currCase.interface_id}
              projectId={currCase.project_id}
              curUid={this.props.curUid}
            />
          )}
        </div>
      </div>
    );
  }
}
