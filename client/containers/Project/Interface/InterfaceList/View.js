import './View.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Table } from 'antd'
const mockEditor = require('./mockEditor.js')
import { formatTime } from '../../../../common.js';

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
    curData: PropTypes.object
  }

  req_body_form(req_body_type,req_body_form){
    if(req_body_type === 'json'){
      mockEditor({
        container: 'vreq_body_json',
        data: req_body_form,
        readOnly:true,
        onChange: function () {}
      })
      return <div className="colBody">
        <span className="colKey">请求Body：</span>
        <div id="vreq_body_json" style={{ minHeight: "300px" }}></div>
      </div>

    }else if(req_body_type === 'form'){

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
        dataIndex: 'required',
        key: 'required',
        width: '45%'
      }];

      const dataSource = [];
      if(req_body_form&&req_body_form.length){
        req_body_form.map((item,i)=>{
          dataSource.push({
            key: i,
            name: item.name,
            value: item.desc,
            required: item.required?"必须":"非必须"
          })
        })
      }

      return <div className="colBody">
        <span className="colKey">请求Body：</span>
        <Table bordered size="small" pagination = {false} columns= {columns} dataSource = {dataSource} />
      </div>

    }else if(req_body_type === 'file'){

      return <div className="colBody">
        <span className="colKey">请求Body：</span>
        <div style={{ minHeight: "300px" }}>file</div>
      </div>

    }else if(req_body_type === 'raw'){

      return <div className="colBody">
        <span className="colKey">请求Body：</span>
        <div style={{ minHeight: "300px" }}>raw</div>
      </div>
    }
  }
  res_body(res_body_type,res_body){
    if(res_body_type === 'json'){
      return <div className="colBody">
        <span className="colKey">返回Body：</span>
        <div id="vres_body_json" style={{ minHeight: "300px" }}></div>
      </div>

    }else if(res_body_type === 'form'){

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
        dataIndex: 'required',
        key: 'required',
        width: '45%'
      }];

      const dataSource = [];
      if(res_body&&res_body.length){
        res_body.map((item,i)=>{
          dataSource.push({
            key: i,
            name: item.name,
            value: item.desc,
            required: item.required?"必须":"非必须"
          })
        })
      }

      return <div className="colBody">
        <span className="colKey">返回Body：</span>
        <Table bordered size="small" pagination = {false} columns= {columns} dataSource = {dataSource} />
      </div>

    }else if(res_body_type === 'file'){

      return <div className="colBody">
        <span className="colKey">返回Body：</span>
        <div>{res_body}</div>
      </div>

    }else if(res_body_type === 'raw'){

      return <div className="colBody">
        <span className="colKey">返回Body：</span>
        <div>{res_body}</div>
      </div>
    }
  }

  req_query(query){
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
      dataIndex: 'required',
      key: 'required',
      width: '45%'
    }];

    const dataSource = [];
    if(query&&query.length){
      query.map((item,i)=>{
        dataSource.push({
          key: i,
          name: item.name,
          value: item.desc,
          required: item.required?"必须":"非必须"
        })
      })
    }

    return  <Table bordered size="small" pagination = {false} columns= {columns} dataSource = {dataSource} />;
  }
  componentDidUpdate(){
    if(this.props.curData.req_body_type === "json"){
      mockEditor({
        container: 'vreq_body_json',
        data: this.props.curData.req_body_form,
        readOnly:true,
        onChange: function () {}
      })
    }
    if(this.props.curData.res_body_type === "json"){
      mockEditor({
        container: 'vres_body_json',
        data: this.props.curData.res_body,
        readOnly:true,
        onChange: function () {}
      })
    }
  }
  render () {

    const dataSource = [];
    if(this.props.curData.req_headers&&this.props.curData.req_headers.length){
      this.props.curData.req_headers.map((item,i)=>{
        dataSource.push({
          key: i,
          name: item.name,
          required: item.required?"必须":"非必须",
          value: item.value
        })
      })
    }
    
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
      dataIndex: 'required',
      key: 'required',
      width: '45%'
    }];

    return this.props.curData.title?<div className="caseContainer">
      <div className="colName">
        <span className="colKey">接口名：</span>
        <span className="colValue">{this.props.curData.title}</span>
      </div>
      <div className="colMethod">
        <span className="colKey">请求方法：</span>
        <span className="colValue">{this.props.curData.method}</span>
      </div>
      <div className="colPath">
        <span className="colKey">接口路径：</span>
        <span className="colValue">{this.props.curData.path}</span>
      </div>
      <div className="colstatus">
        <span className="colKey">状态：</span>
        <span className="colValue">{this.props.curData.status}</span>
      </div>
      <div className="colAddTime">
        <span className="colKey">创建时间：</span>
        <span className="colValue">{formatTime(this.props.curData.add_time)}</span>
      </div>
      <div className="colUpTime">
        <span className="colKey">更新时间：</span>
        <span className="colValue">{formatTime(this.props.curData.up_time)}</span>
      </div>
      <div className="colDesc">
        <span className="colKey">接口描述：</span>
        <span className="colValue">{this.props.curData.desc}</span>
      </div>
      <div className="colHeader">
        <span className="colKey">请求Headers：</span>
        <Table bordered size="small" pagination = {false} columns= {columns} dataSource = {dataSource} />
      </div>
      <div className="colQuery">
        <span className="colKey">Query：</span>
        {this.req_query(this.props.curData.req_query)}
      </div>
      <div className="colreqBodyType">
        <span className="colKey">请求Body类型：</span>
        <span className="colValue">{this.props.curData.req_body_type}</span>
      </div>
      {this.req_body_form("form",this.props.curData.req_body_form)}
      <div className="colreqBodyType">
        <span className="colKey">返回Body类型：</span>
        <span className="colValue">{this.props.curData.req_body_type}</span>
      </div>
      {this.res_body("json",this.props.curData.res_body)}
      {/*{this.res_body("file",[{
        name: "key",
        desc: "123",
        required: 0
      }])}*/}
    </div>:<div className="caseContainer">接口不存在</div>;
  }
}


export default View
