import './View.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Table } from 'antd'
const mockEditor = require('./mockEditor.js')
// import { formatTime } from '../../../../common.js';

// import { Card } from 'antd'
// import { getMockUrl } from '../../reducer/modules/news.js'

@connect(state=>{
  return {
    curData: state.inter.curdata
  }
})




class View extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    viewData: PropTypes.object
  }


  componentDidMount() {
    let that = this;
    mockEditor({
      container: 'vreq_body_json',
      data: that.props.req_body_form,
      onChange: function () {}
    })
    mockEditor({
      container: 'vres_body_json',
      data: that.props.res_body,
      onChange: function () {}
    })
    mockEditor({
      container: 'vreq_query_json',
      data: that.props.req_query,
      onChange: function () {}
    })
  }

  render () {

    const dataSource = [{
      key: 1,
      name: '1',
      value: '胡彦斌',
      desc: 32
    }, {
      key: 2,
      name: '2',
      value: '胡彦斌',
      desc: 32
    }];

    const columns = [{
      title: '参数名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '参数值',
      dataIndex: 'value',
      key: 'value'
    }, {
      title: '备注',
      dataIndex: 'desc',
      key: 'desc',
      width: '45%'
    }];




    return <div className="caseContainer">
      {/*<Card title={`接口名:${this.props.viewData.casename}`}></Card>*/}
      <div className="colName">
        <span className="colKey">接口名：</span>
        <span className="colValue">{this.props.viewData.title}</span>
      </div>
      <div className="colPath">
        <span className="colKey">接口路径：</span>
        <span className="colValue">{this.props.viewData.path}</span>
      </div>
      <div className="colstatus">
        <span className="colKey">状态：</span>
        <span className="colValue">{this.props.viewData.status}</span>
      </div>
      <div className="colMock">
        <span className="colKey">Mock地址：</span>
        <span className="colValue">{this.props.viewData.mockUrl}</span>
      </div>
      <div className="colDesc">
        <span className="colKey">接口描述：</span>
        <span className="colValue">{this.props.viewData.desc}</span>
      </div>
      <div className="colHeader">
        <span className="colKey">请求Headers：</span>
        <Table size="small" pagination = {false} columns= {columns} dataSource = {dataSource} />
      </div>
      <div className="colQuery">
        <span className="colKey">Query：</span>
        <div span={18} offset={4} id="vreq_query_json" style={{ minHeight: "150px" }}></div>
      </div>
      <div className="colBody">
        <span className="colKey">请求Body：</span>
        <div span={18} offset={4} id="vreq_body_json" style={{ minHeight: "300px" }}></div>
      </div>
      <div className="colBody">
        <span className="colKey">响应Body：</span>
        <div span={18} offset={4} id="vres_body_json" style={{ minHeight: "300px" }}></div>
      </div>
      
      
      
    </div>
  }
}

let data = {
  title: '',
  path: '',
  status: 'undone',
  method: 'get',
  req_query: [{
    name: '',
    desc: '',
    required: "1"
  }],
  req_body_type: 'form',
  req_headers: [{
    name: '',
    value: '', required: "1"
  }],
  req_body_form: [{
    name: '',
    type: '',
    required: ''
  }],
  res_body_type: 'json',
  res_body: '{a:123}',
  desc: 'FP的好处是没有OO的复杂仪式感，是沿着数据结构+算法的思路进行抽象和结构化。如果顶层设计做好，代码复用度极高，代码量少。比如要生成一颗树我用迭归算法直接生成',
  res_body_mock: '',
  mockUrl: "this.props.mockUrl"
}
// {
//     casename:"caename",
//     uid: 107,
//     col_id: 211,
//     index: 0,
//     project_id: 112,
//     add_time: new Date().getTime(),
//     up_time: new Date().getTime(),
//     env: "测试环境",
//     domain: "域名",
//     path: "路径",
//     method: "GET",
//     req_query: [{
//       name: "String", 
//       value: "String",
//       required: "1"
//     }],
//     req_headers: [{
//       name: "String", 
//       value: "String",
//       required: "1"
//     }],
//     req_body_type: "json",
//     res_body_form: [{
//       name: "String", 
//       value: "String",
//       required: "1"
//     }],
//     res_body_other: "String"
//   }
View.defaultProps = {
  viewData: data
}

export default View
