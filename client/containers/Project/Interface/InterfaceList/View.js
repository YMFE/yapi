import '../interface.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { formatTime } from '../../../../common.js';

// import { Card } from 'antd'
// import { getMockUrl } from '../../reducer/modules/news.js'

@connect()

class View extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    viewData: PropTypes.object
  }

  render () {
    return <div className="caseContainer">
      {/*<Card title={`接口名:${this.props.viewData.casename}`}></Card>*/}
      <div className="casename">
        <span className="colKey">接口名：</span>
        <span className="colValue">{this.props.viewData.casename}</span>
      </div>
      <div className="colTime">
        <span className="colKey">添加时间：</span>
        <span className="colValue">{formatTime(this.props.viewData.add_time/1000)}</span>
      </div>
      <div className="colTime">
        <span className="colKey">更新时间：</span>
        <span className="colValue">{formatTime(this.props.viewData.up_time/1000)}</span>
      </div>
      <div className="colEnv">
        <span className="colKey">测试环境：</span>
        <span className="colValue">{this.props.viewData.env}</span>
      </div>
      <div className="colDomain">
        <span className="colKey">域名：</span>
        <span className="colValue">{this.props.viewData.domain}</span>
      </div>
      <div className="colPath">
        <span className="colKey">路径：</span>
        <span className="colValue">{this.props.viewData.path}</span>
      </div>
      <div className="colMethod">
        <span className="colKey">请求方法：</span>
        <span className="colValue">{this.props.viewData.method}</span>
      </div>
    </div>
  }
}

View.defaultProps = {
  viewData: {
    casename:"caename",
    uid: 107,
    col_id: 211,
    index: 0,
    project_id: 112,
    add_time: new Date().getTime(),
    up_time: new Date().getTime(),
    env: "测试环境",
    domain: "域名",
    path: "路径",
    method: "GET",
    req_query: [{
      name: "String", 
      value: "String"
    }],
    req_headers: [{
      name: "String", 
      value: "String"
    }],
    req_body_type: "json",
    res_body_form: [{
      name: "String", 
      value: "String"
    }],
    res_body_other: "String"
  }
}

export default View
