import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import axios from 'axios';
import { message } from 'antd';
import { Postman } from '../../../../../components'
import AddColModal from './AddColModal'

// import {
// } from '../../../reducer/modules/group.js'

import './Run.scss'


@connect(
  state => ({
    currInterface: state.inter.curdata,
    currProject: state.project.currProject
  })
)
@withRouter
export default class Run extends Component {

  static propTypes = {
    currProject: PropTypes.object,
    currInterface: PropTypes.object,
    match: PropTypes.object
  }

  state = {
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
  }

  componentWillReceiveProps() {
  }

  savePostmanRef = (postman) => {
    this.postman = postman;
  }

  saveCase = async (colId, caseName) => {
    const project_id = this.props.match.params.id;
    const interface_id = this.props.currInterface._id;
    const {
      caseEnv: case_env,
      pathname: path,
      method,
      pathParam: req_params,
      query: req_query,
      headers: req_headers,
      bodyType: req_body_type,
      bodyForm: req_body_form,
      bodyOther: req_body_other,
      resMockTest: mock_verify

    } = this.postman.state;

    let params = {
      interface_id,
      casename: caseName,
      col_id: colId,
      project_id,
      case_env,
      path,
      method,
      req_params,
      req_query,
      req_headers,
      req_body_type,
      req_body_form,
      req_body_other,
      mock_verify
    };

    if(this.postman.state.test_status !== 'error'){
      params.test_res_body = this.postman.state.res;
      params.test_report = this.postman.state.validRes;
      params.test_status = this.postman.state.test_status;
      params.test_res_header = this.postman.state.resHeader;
    }

    if(params.test_res_body && typeof params.test_res_body === 'object'){
      params.test_res_body = JSON.stringify(params.test_res_body, null, '   ');
    }

    const res = await axios.post('/api/col/add_case', params);
    if (res.data.errcode) {
      message.error(res.data.errmsg)
    } else {
      message.success('添加成功')
      this.setState({saveCaseModalVisible: false})
    }
  }

  render () {
    const { currInterface, currProject } = this.props;
    const data = Object.assign({}, currInterface, currProject, {_id: currInterface._id})
    return (
      <div>
        <Postman data={data} type="inter" saveTip="保存到集合" save={() => this.setState({saveCaseModalVisible: true})} ref={this.savePostmanRef} />
        <AddColModal
          visible={this.state.saveCaseModalVisible}
          caseName={currInterface.title}
          onCancel={() => this.setState({saveCaseModalVisible: false})}
          onOk={this.saveCase}
        ></AddColModal>
      </div>
    )
  }
}
