import './View.scss'
import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Table, Icon, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
const mockEditor = require('./mockEditor.js')
import { formatTime } from '../../../../common.js';
import ErrMsg from '../../../../components/ErrMsg/ErrMsg.js';
import variable from '../../../../constants/variable';
import constants from '../../../../constants/variable.js'

const HTTP_METHOD = constants.HTTP_METHOD;
// import { Card } from 'antd'
// import { getMockUrl } from '../../reducer/modules/news.js'

@connect(state => {
  return {
    curData: state.inter.curdata,
    currProject: state.project.currProject
  }
})

class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true
    }
  }
  static propTypes = {
    curData: PropTypes.object,
    currProject: PropTypes.object
  }

  req_body_form(req_body_type, req_body_form) {



    if (req_body_type === 'form') {

      const columns = [{
        title: '参数名称',
        dataIndex: 'name',
        key: 'name',
        width: 140
      }, {
        title: '参数类型',
        dataIndex: 'type',
        key: 'type',
        width: 100,
        render: (text) => {
          text = text || "";
          return text.toLowerCase() === "text" ? <span><i className="query-icon text">T</i>文本</span> : <span><Icon type="file" className="query-icon" />文件</span>
        }
      }, {
        title: '是否必须',
        dataIndex: 'required',
        key: 'required',
        width: 100
      }, {
        title: '示例',
        dataIndex: 'example',
        key: 'example',
        render(_, item) {
          return <p style={{whiteSpace: 'pre-wrap'}}>{item.example}</p>;
        }
      }, {
        title: '备注',
        dataIndex: 'value',
        key: 'value',
        render(_, item) {
          return <p style={{whiteSpace: 'pre-wrap'}}>{item.value}</p>;
        }
      }];

      const dataSource = [];
      if (req_body_form && req_body_form.length) {
        req_body_form.map((item, i) => {
          dataSource.push({
            key: i,
            name: item.name,
            value: item.desc,
            example: item.example,
            required: item.required == 0 ? "否" : "是",
            type: item.type
          })
        })
      }

      return <div style={{ display: dataSource.length ? "" : "none" }} className="colBody">
        <h3 className="col-title">Body：</h3>
        <Table bordered size="small" pagination={false} columns={columns} dataSource={dataSource} />
      </div>

    } else if (req_body_type === 'file') {

      return <div style={{ display: this.props.curData.req_body_other ? "" : "none" }} className="colBody">
        <h3 className="col-title">Body：</h3>
        <div>{this.props.curData.req_body_other}</div>
      </div>

    } else if (req_body_type === 'raw') {

      return <div style={{ display: this.props.curData.req_body_other ? "" : "none" }} className="colBody">
        <h3 className="col-title">Body：</h3>
        <div>{this.props.curData.req_body_other}</div>
      </div>
    }
  }
  res_body(res_body_type, res_body) {
    if (res_body_type === 'json') {
      let h = this.countEnter(this.props.curData.res_body);
      return <div  className="colBody">
        <div id="vres_body_json" style={{ minHeight: h * 16 + 100 }}></div>
      </div>
    } else if (res_body_type === 'raw') {
      return <div  className="colBody">
        <div>{res_body}</div>
      </div>
    }
  }

  req_query(query) {
    const columns = [{
      title: '参数名称',
      dataIndex: 'name',
      width: 140,
      key: 'name'
    }, {
      title: '是否必须',
      width: 100,
      dataIndex: 'required',
      key: 'required'
    }, {
      title: '示例',
      dataIndex: 'example',
      key: 'example',
      render(_, item) {
        return <p style={{whiteSpace: 'pre-wrap'}}>{item.example}</p>;
      }
    }, {
      title: '备注',
      dataIndex: 'value',
      key: 'value',
      render(_, item) {
        return <p style={{whiteSpace: 'pre-wrap'}}>{item.value}</p>;
      }
    }];

    const dataSource = [];
    if (query && query.length) {
      query.map((item, i) => {
        dataSource.push({
          key: i,
          name: item.name,
          value: item.desc,
          example: item.example,
          required: item.required == 0 ? "否" : "是"
        })
      })
    }

    return <Table bordered size="small" pagination={false} columns={columns} dataSource={dataSource} />;
  }

  countEnter(str) {
    let i = 0;
    let c = 0;
    if (!str || !str.indexOf) return 0;
    while (str.indexOf('\n', i) > -1) {
      i = str.indexOf('\n', i) + 2;
      c++;
    }
    return c;
  }
  bindAceEditor() {
    if (this.props.curData.req_body_type === "json" && this.props.curData.title) {
      mockEditor({
        container: 'vreq_body_json',
        data: this.props.curData.req_body_other,
        readOnly: true,
        onChange: function () { }
      })
    }
    if (this.props.curData.title && this.props.curData.res_body_type === "json") {
      let content = this.props.curData.res_body ? this.props.curData.res_body: '没有定义';
      mockEditor({
        container: 'vres_body_json',
        data: content,
        readOnly: true,
        onChange: function () { }
      })
    }
  }
  componentDidMount() {

    if (this.props.curData.title) {
      this.bindAceEditor.bind(this)();
    }
    if (!this.props.curData.title && this.state.init) {
      this.setState({ init: false });
    }
  }
  componentDidUpdate() {
    this.bindAceEditor.bind(this)();
  }
  componentWillUpdate() {
    if (!this.props.curData.title && this.state.init) {
      this.setState({ init: false });
    }
  }
  render() {
    const dataSource = [];
    if (this.props.curData.req_headers && this.props.curData.req_headers.length) {
      this.props.curData.req_headers.map((item, i) => {
        dataSource.push({
          key: i,
          name: item.name,
          required: item.required == 0 ? "否" : "是",
          value: item.value,
          example: item.example,
          desc: item.desc
        })
      })
    }

    const req_dataSource = [];
    if (this.props.curData.req_params && this.props.curData.req_params.length) {
      this.props.curData.req_params.map((item, i) => {
        req_dataSource.push({
          key: i,
          name: item.name,
          desc: item.desc,
          example: item.example
        })
      })
    }
    const req_params_columns = [{
      title: '参数名称',
      dataIndex: 'name',
      key: 'name',
      width: 140
    }, {
      title: '示例',
      dataIndex: 'example',
      key: 'example',
      render(_, item) {
        return <p style={{whiteSpace: 'pre-wrap'}}>{item.example}</p>;
      }
    }, {
      title: '备注',
      dataIndex: 'desc',
      key: 'desc',
      render(_, item) {
        return <p style={{whiteSpace: 'pre-wrap'}}>{item.desc}</p>;
      }
    }];

    const columns = [{
      title: '参数名称',
      dataIndex: 'name',
      key: 'name',
      width: '200px'
    }, {
      title: '参数值',
      dataIndex: 'value',
      key: 'value',
      width: '300px'
    }, {
      title: '是否必须',
      dataIndex: 'required',
      key: 'required',
      width: '100px'
    }, {
      title: '示例',
      dataIndex: 'example',
      key: 'example',
      render(_, item) {
        return <p style={{whiteSpace: 'pre-wrap'}}>{item.example}</p>;
      }
    }, {
      title: '备注',
      dataIndex: 'desc',
      key: 'desc',
      render(_, item) {
        return <p style={{whiteSpace: 'pre-wrap'}}>{item.desc}</p>;
      }
    }];
    let status = {
      undone: "未完成",
      done: "已完成"
    }

    let requestShow = (dataSource&& dataSource.length) || (req_dataSource && req_dataSource.length) || (this.props.curData.req_query && this.props.curData.req_query.length) || (this.props.curData.req_body_other) || (this.props.curData.req_body_form && this.props.curData.req_body_form.length);
    let methodColor = variable.METHOD_COLOR[this.props.curData.method ? this.props.curData.method.toLowerCase() : "get"];
    // statusColor = statusColor[this.props.curData.status?this.props.curData.status.toLowerCase():"undone"];
    let h = this.countEnter(this.props.curData.req_body_other);
    const aceEditor = <div style={{ display: this.props.curData.req_body_other && this.props.curData.req_body_type === "json" ? "block" : "none" }} className="colBody">
      <span className="colKey">请求Body：</span>
      <div id="vreq_body_json" style={{ minHeight: h * 16 + 20 }}></div>
    </div>
    if (!methodColor) methodColor = "get";
    let res = <div className="caseContainer">
      <h2 className="interface-title" style={{ marginTop: 0 }}>基本信息</h2>
      <div className="panel-view">
        <Row className="row">
          <Col span={4} className="colKey">接口名称：</Col>
          <Col span={8}>{this.props.curData.title}</Col>
          <Col span={4} className="colKey">创&ensp;建&ensp;人：</Col>
          <Col span={8} className="colValue"><Link className="user-name" to={"/user/profile/" + this.props.curData.uid} ><img src={'/api/user/avatar?uid=' + this.props.curData.uid} className="user-img" />{this.props.curData.username}</Link></Col>
        </Row>
        <Row className="row">
          <Col span={4} className="colKey">状&emsp;&emsp;态：</Col>
          <Col span={8} className={'tag-status ' + this.props.curData.status}>{status[this.props.curData.status]}</Col>
          <Col span={4} className="colKey">更新时间：</Col>
          <Col span={8}>{formatTime(this.props.curData.up_time)}</Col>
        </Row>
        <Row className="row">
          <Col span={4} className="colKey">接口路径：</Col>
          <Col span={18} className="colValue">
            <span style={{ color: methodColor.color, backgroundColor: methodColor.bac }} className="colValue tag-method">{this.props.curData.method}</span>
            <span className="colValue">{this.props.currProject.basepath}{this.props.curData.path}</span>
          </Col>
        </Row>
        <Row className="row">
          <Col span={4} className="colKey">Mock地址：</Col>
          <Col span={18} className="colValue href">
            <span onClick={() => window.open(location.protocol + '//' + location.hostname + (location.port !== "" ? ":" + location.port : "") + `/mock/${this.props.currProject._id}${this.props.currProject.basepath}${this.props.curData.path}`, '_blank')}>{location.protocol + '//' + location.hostname + (location.port !== "" ? ":" + location.port : "") + `/mock/${this.props.currProject._id}${this.props.currProject.basepath}${this.props.curData.path}`}</span></Col>
        </Row>
        {this.props.curData.desc ?
          <Row className="row remark">
            <Col span={4} className="colKey">接口备注：</Col>
            <Col span={18} className="colValue" dangerouslySetInnerHTML={{ __html: this.props.curData.desc }}></Col>
          </Row> : ""}
      </div>
      <h2
        className="interface-title"
        style={{ display: requestShow ? '' : 'none' }}
      >
        Request
      </h2>
      {req_dataSource.length ? <div className="colHeader">
        <h3 className="col-title">路径参数：</h3>
        <Table bordered size="small" pagination={false} columns={req_params_columns} dataSource={req_dataSource} />
      </div> : ""}
      {dataSource.length ? <div className="colHeader">
        <h3 className="col-title">Headers：</h3>
        <Table bordered size="small" pagination={false} columns={columns} dataSource={dataSource} />
      </div> : ""}
      {this.props.curData.req_query && this.props.curData.req_query.length ? <div className="colQuery">
        <h3 className="col-title">Query：</h3>
        {this.req_query(this.props.curData.req_query)}
      </div> : ""}
      {/*<div className="colreqBodyType">
        <span className="colKey">请求Body类型：</span>
        <span className="colValue">{this.props.curData.req_body_type}</span>
      </div>*/}
      <div style={{display: this.props.curData.method && HTTP_METHOD[this.props.curData.method.toUpperCase()].request_body ? '' : 'none'}}>
        { aceEditor }
        { 
          this.req_body_form(this.props.curData.req_body_type, this.props.curData.req_body_form)
        }
      </div>
      {/*<div className="colreqBodyType">
        <span className="colKey">返回Body类型：</span>
        <span className="colValue">{this.props.curData.res_body_type}</span>
      </div>*/}
      <h2 className="interface-title">Response</h2>
      {this.res_body(this.props.curData.res_body_type, this.props.curData.res_body)}
    </div>;
    if (!this.props.curData.title) {
      if (this.state.init) {
        res = <div></div>;
      } else {
        res = <ErrMsg type="noData" />;
      }
    }
    return res;
  }
}


export default View
