import React, { Component } from 'react'
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
    const {
      currDomain: domain,
      pathname: path,
      method,
      pathParam: req_params,
      query: req_query,
      headers: req_headers,
      bodyType: req_body_type,
      bodyForm: req_body_form,
      bodyOther: req_body_other
    } = this.postman.state;
    const res = await axios.post('/api/col/add_case', {
      casename: caseName,
      col_id: colId,
      project_id,
      domain,
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
      message.success('添加成功')
      this.setState({saveCaseModalVisible: false})
    }
  }

  render () {
    const { currInterface, currProject } = this.props;
    const data = Object.assign({}, currInterface, currProject)

    return (
      <div>
        <Postman data={data} save={() => this.setState({saveCaseModalVisible: true})} ref={this.savePostmanRef} />
        <AddColModal
          visible={this.state.saveCaseModalVisible}
          onCancel={() => this.setState({saveCaseModalVisible: false})}
          onOk={this.saveCase}
        ></AddColModal>
      </div>
    )
  }
}
