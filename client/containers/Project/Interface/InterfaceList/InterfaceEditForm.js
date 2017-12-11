import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import _ from 'underscore'
import constants from '../../../../constants/variable.js'
import { handlePath, nameLengthLimit } from '../../../../common.js'
import { changeEditStatus } from '../../../../reducer/modules/interface.js';
import json5 from 'json5'
import { message, Tabs, Affix } from 'antd'
import Editor from 'wangeditor'
import EasyDragSort from '../../../../components/EasyDragSort/EasyDragSort.js'
import mockEditor from 'client/components/AceEditor/mockEditor';

const TabPane = Tabs.TabPane;
let EditFormContext;
const validJson = (json) => {
  try {
    json5.parse(json);
    return true;
  } catch (e) {
    return false;
  }
}

import {
  Form, Select, Input, Tooltip,
  Button, Row, Col, Radio, Icon, AutoComplete, Switch
} from 'antd';

const Json5Example = `
  {
    /**
     * info
     */

    "id": 1 //appId
  }

`

const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const dataTpl = {
  req_query: { name: "", required: "1", desc: "", example: "" },
  req_headers: { name: "", required: "1", desc: "", example: "" },
  req_params: { name: "", desc: "", example: "" },
  req_body_form: { name: "", type: "text", required: "1", desc: "", example: "" }
}


const HTTP_METHOD = constants.HTTP_METHOD;
const HTTP_METHOD_KEYS = Object.keys(HTTP_METHOD);
const HTTP_REQUEST_HEADER = constants.HTTP_REQUEST_HEADER;

@connect(
  null,
  {
    changeEditStatus
  }
)
class InterfaceEditForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    curdata: PropTypes.object,
    mockUrl: PropTypes.string,
    onSubmit: PropTypes.func,
    basepath: PropTypes.string,
    cat: PropTypes.array,
    changeEditStatus: PropTypes.func
  }

  initState(curdata) {
    if (curdata.req_query && curdata.req_query.length === 0) delete curdata.req_query;
    if (curdata.req_headers && curdata.req_headers.length === 0) delete curdata.req_headers;
    if (curdata.req_body_form && curdata.req_body_form.length === 0) delete curdata.req_body_form;
    if (curdata.req_params && curdata.req_params.length === 0) delete curdata.req_params;
    if (curdata.req_body_form) {
      curdata.req_body_form = curdata.req_body_form.map((item) => {
        item.type = item.type === 'text' ? 'text' : 'file'
        return item
      })
    }
    // 设置标签的展开与折叠
    curdata['hideTabs'] = {
      req: {
        body: 'hide',
        query: 'hide',
        headers: 'hide'
      },
      other: {
        remark: '',
        mail: 'hide'
      }
    };
    curdata['hideTabs']['req'][HTTP_METHOD[curdata.method].default_tab] = '';
    return Object.assign({
      title: '',
      path: '',
      status: 'undone',
      method: 'get',

      req_params: [],

      req_query: [{
        name: '',
        desc: '',
        required: "1"
      }],

      req_headers: [{
        name: '',
        value: '', required: "1"
      }],

      req_body_type: 'form',
      req_body_form: [{
        name: '',
        type: 'text',
        required: '1'
      }],
      req_body_other: '',

      res_body_type: 'json',
      res_body: '',
      desc: '',
      res_body_mock: '',
      jsonType: 'tpl',
      mockUrl: this.props.mockUrl,
      req_radio_type: 'req-query'
    }, curdata)
  }

  constructor(props) {
    super(props)
    const { curdata } = this.props;
    this.state = this.initState(curdata);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.desc = this.editor.txt.html();
        if (values.res_body_type === 'json') {
          if (this.state.res_body && validJson(this.state.res_body) === false) {
            return message.error('返回body json格式有问题，请检查！')
          }
          try {
            values.res_body = JSON.stringify(JSON.parse(this.state.res_body), null, '   ')
          } catch (e) {
            values.res_body = this.state.res_body;
          }

        }
        if (values.req_body_type === 'json') {
          if (this.state.req_body_other && validJson(this.state.req_body_other) === false) {
            return message.error('响应Body json格式有问题，请检查！');
          }
          try {
            values.req_body_other = JSON.stringify(JSON.parse(this.state.req_body_other), null, '   ');
          } catch (e) {
            values.req_body_other = this.state.req_body_other
          }
        }

        values.method = this.state.method;
        values.req_params = values.req_params || [];
        values.req_headers = values.req_headers || [];
        let isfile = false, isHavaContentType = false;
        if (values.req_body_type === 'form') {          
          values.req_body_form.forEach((item) => {
            if (item.type === 'file') {
              isfile = true;
            }
          })

          values.req_headers.map((item) => {
            if (item.name === 'Content-Type') {
              item.value = isfile ? 'multipart/form-data' : 'application/x-www-form-urlencoded'
              isHavaContentType = true;
            }
          })
          if (isHavaContentType === false) {
            values.req_headers.unshift({
              name: 'Content-Type',
              value: isfile ? 'multipart/form-data' : 'application/x-www-form-urlencoded'
            })
          }
        } else if (values.req_body_type === 'json') {
          values.req_headers ? values.req_headers.map((item) => {
            if (item.name === 'Content-Type') {
              item.value = 'application/json'
              isHavaContentType = true;
            }
          }) : [];
          if (isHavaContentType === false) {
            values.req_headers = values.req_headers || [];
            values.req_headers.unshift({
              name: 'Content-Type',
              value: 'application/json'
            })
          }
        }
        values.req_headers = values.req_headers ? values.req_headers.filter((item) => item.name !== '') : []
        values.req_body_form = values.req_body_form ? values.req_body_form.filter((item) => item.name !== '') : []
        values.req_params = values.req_params ? values.req_params.filter(item => item.name !== '') : []
        values.req_query = values.req_query ? values.req_query.filter(item => item.name !== '') : []

        if (HTTP_METHOD[values.method].request_body !== true) {
          values.req_body_form = []
        }
        this.props.onSubmit(values)
        EditFormContext.props.changeEditStatus(false);
      }
    });
  }

  onChangeMethod = (val) => {
    let radio = [];
    if (HTTP_METHOD[val].request_body) {
      radio = ['req', 'body'];
    } else {
      radio = ['req', 'query'];
    }
    this.setState({
      req_radio_type: radio.join("-")
    })

    this.setState({ method: val }, () => {
      this._changeRadioGroup(radio[0], radio[1])
    })
  }

  componentDidMount() {
    EditFormContext = this;
    this.setState({
      req_radio_type: HTTP_METHOD[this.state.method].request_body ? 'req-body' : 'req-query'
    })
    let that = this;
    const initReqBody = that.state.req_body_other;
    const initResBody = that.state.res_body;
    mockEditor({
      container: 'req_body_json',
      data: that.state.req_body_other,
      onChange: function (d) {
        that.setState({
          req_body_other: d.text
        })
        EditFormContext.props.changeEditStatus(initReqBody !== d.text);
      },
      fullScreen: true
    })

    this.resBodyEditor = mockEditor({
      container: 'res_body_json',
      data: that.state.res_body,
      onChange: function (d) {
        that.setState({
          res_body: d.text
        });
        EditFormContext.props.changeEditStatus(initResBody !== d.text);
      },
      fullScreen: true
    })

    this.mockPreview = mockEditor({
      container: 'mock-preview',
      data: '',
      readOnly: true
    })

    let editor = this.editor = new Editor('#desc');
    editor.customConfig.zIndex = 100;
    const initEditorHTML = this.state.desc;
    editor.customConfig.onchange = function (html) {
      EditFormContext.props.changeEditStatus(initEditorHTML !== html);
    }
    editor.create();
    editor.txt.html(this.state.desc)
    if (navigator.userAgent.indexOf("Firefox") > 0) {
      document.getElementById('title').focus()
    }

  }

  componentWillUnmount() {
    EditFormContext.props.changeEditStatus(false);
  }

  addParams = (name, data) => {
    let newValue = {}
    data = data || dataTpl[name]
    newValue[name] = [].concat(this.state[name], data)
    this.setState(newValue)
  }

  delParams = (key, name) => {

    let curValue = this.props.form.getFieldValue(name);
    let newValue = {}
    newValue[name] = curValue.filter((val, index) => {
      return index !== key;
    })
    this.props.form.setFieldsValue(newValue)
    this.setState(newValue)
  }



  handleMockPreview = () => {
    let str = '';
    try {
      if (this.resBodyEditor.curData.format === true) {
        str = JSON.stringify(this.resBodyEditor.curData.mockData(), null, '  ');
      } else {
        str = '解析出错: ' + this.resBodyEditor.curData.format;
      }

    } catch (err) {
      str = '解析出错: ' + err.message;
    }
    this.mockPreview.setValue(
      str
    )
  }

  handleJsonType = (key) => {
    key = key || 'tpl';
    if (key === 'preview') {
      this.handleMockPreview()
    }
    this.setState({
      jsonType: key
    })
  }

  handlePath = (e) => {
    let val = e.target.value, queue = [];

    let insertParams =(name)=>{
      let findExist = _.find(this.state.req_params, { name: name });
      if (findExist) {
        queue.push(findExist)
      } else {
        queue.push({ name: name, desc: '' })
      }
    }
    val = handlePath(val)
    this.props.form.setFieldsValue({
      path: val
    })
    if (val && val.indexOf(":") !== -1) {
      let paths = val.split("/"), name, i;
      for (i = 1; i < paths.length; i++) {
        if (paths[i][0] === ':') {
          name = paths[i].substr(1);
          insertParams(name)
        }
      }
    }

    if(val && val.length > 3){
      val.replace(/\{(.+?)\}/g, function(str, match){
        insertParams(match)
      })
    }

    this.setState({
      req_params: queue
    })

  }

  // 点击切换radio
  changeRadioGroup = (e) => {
    const res = e.target.value.split('-');
    if (res[0] === 'req') {
      this.setState({
        req_radio_type: e.target.value
      })
    }
    this._changeRadioGroup(res[0], res[1]);
  }

  _changeRadioGroup = (group, item) => {
    const obj = {}
    // 先全部隐藏
    for (let key in this.state.hideTabs[group]) {
      obj[key] = 'hide';
    }
    // 再取消选中项目的隐藏
    obj[item] = '';
    this.setState({
      hideTabs: {
        ...this.state.hideTabs,
        [group]: obj
      }
    })
  }

  handleDragMove = (name) => {
    return (data) => {
      let newValue = {
        [name]: data
      }
      this.props.form.setFieldsValue(newValue);
      this.setState(newValue)
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    };

    const queryTpl = (data, index) => {

      return <Row
        key={index}
        className="interface-edit-item-content"
      >
        <Col span="5" className="interface-edit-item-content-col">
          {getFieldDecorator('req_query[' + index + '].name', {
            initialValue: data.name
          })(
            <Input placeholder="参数名称" />
            )}
        </Col>
        <Col span="3" className="interface-edit-item-content-col" >
          {getFieldDecorator('req_query[' + index + '].required', {
            initialValue: data.required
          })(
            <Select>
              <Option value="1">必需</Option>
              <Option value="0">非必需</Option>
            </Select>
            )}
        </Col>
        <Col span="6" className="interface-edit-item-content-col" >
          {getFieldDecorator('req_query[' + index + '].example', {
            initialValue: data.example
          })(
            <TextArea autosize={true} placeholder="参数示例" />
            )}
        </Col>
        <Col span="9" className="interface-edit-item-content-col">
          {getFieldDecorator('req_query[' + index + '].desc', {
            initialValue: data.desc
          })(
            <TextArea autosize={true} placeholder="备注" />
            )}
        </Col>
        <Col span="1" className="interface-edit-item-content-col" >
          <Icon type="delete" className="interface-edit-del-icon" onClick={() => this.delParams(index, 'req_query')} />
        </Col>
      </Row>
    }

    const headerTpl = (data, index) => {
      return <Row
        key={index}
        className="interface-edit-item-content"
      >
        <Col span="4" className="interface-edit-item-content-col">
          {getFieldDecorator('req_headers[' + index + '].name', {
            initialValue: data.name
          })(
            <AutoComplete
              dataSource={HTTP_REQUEST_HEADER}
              filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
              placeholder="参数名称"
            />
            )}
        </Col>
        <Col span="6" className="interface-edit-item-content-col">
          {getFieldDecorator('req_headers[' + index + '].value', {
            initialValue: data.value
          })(
            <Input placeholder="参数值" />
            )}
        </Col>
        <Col span="5" className="interface-edit-item-content-col">
          {getFieldDecorator('req_headers[' + index + '].example', {
            initialValue: data.example
          })(
            <TextArea autosize={true} placeholder="参数示例" />
            )}
        </Col>
        <Col span="8" className="interface-edit-item-content-col">
          {getFieldDecorator('req_headers[' + index + '].desc', {
            initialValue: data.desc
          })(
            <TextArea autosize={true} placeholder="备注" />
            )}
        </Col>
        <Col span="1" className="interface-edit-item-content-col" >
          <Icon type="delete" className="interface-edit-del-icon" onClick={() => this.delParams(index, 'req_headers')} />
        </Col>

      </Row>
    }

    const requestBodyTpl = (data, index) => {
      return <Row
        key={index}
        className="interface-edit-item-content"

      >
        <Col span="4" className="interface-edit-item-content-col">
          {getFieldDecorator('req_body_form[' + index + '].name', {
            initialValue: data.name
          })(
            <Input placeholder="name" />
            )}
        </Col>
        <Col span="3" className="interface-edit-item-content-col">
          {getFieldDecorator('req_body_form[' + index + '].type', {
            initialValue: data.type
          })(
            <Select>
              <Option value="text">text</Option>
              <Option value="file">file</Option>
            </Select>
            )}
        </Col>
        <Col span="3" className="interface-edit-item-content-col" >
          {getFieldDecorator('req_body_form[' + index + '].required', {
            initialValue: data.required
          })(
            <Select>
              <Option value="1">必需</Option>
              <Option value="0">非必需</Option>
            </Select>
            )}
        </Col>
        <Col span="5" className="interface-edit-item-content-col">
          {getFieldDecorator('req_body_form[' + index + '].example', {
            initialValue: data.example
          })(
            <TextArea autosize={true} placeholder="参数示例" />
            )}
        </Col>
        <Col span="8" className="interface-edit-item-content-col">
          {getFieldDecorator('req_body_form[' + index + '].desc', {
            initialValue: data.desc
          })(
            <TextArea autosize={true} placeholder="备注" />
            )}
        </Col>
        <Col span="1" className="interface-edit-item-content-col" >
          <Icon type="delete" className="interface-edit-del-icon" onClick={() => this.delParams(index, 'req_body_form')} />
        </Col>
      </Row>
    }

    const paramsTpl = (data, index) => {

      return <Row
        key={index}
        className="interface-edit-item-content"

      >
        <Col span="6" className="interface-edit-item-content-col">
          {getFieldDecorator('req_params[' + index + '].name', {
            initialValue: data.name
          })(
            <Input disabled placeholder="参数名称" />
            )}
        </Col>
        <Col span="7" className="interface-edit-item-content-col">
          {getFieldDecorator('req_params[' + index + '].example', {
            initialValue: data.example
          })(
            <TextArea autosize={true} placeholder="参数示例" />
            )}
        </Col>
        <Col span="11" className="interface-edit-item-content-col">
          {getFieldDecorator('req_params[' + index + '].desc', {
            initialValue: data.desc
          })(
            <TextArea autosize={true} placeholder="备注" />
            )}
        </Col>


      </Row>
    }

    const paramsList = this.state.req_params.map((item, index) => {
      return paramsTpl(item, index)
    })

    const QueryList = this.state.req_query.map((item, index) => {
      return queryTpl(item, index)
    })

    const headerList = this.state.req_headers ? this.state.req_headers.map((item, index) => {
      return headerTpl(item, index)
    }) : [];

    const requestBodyList = this.state.req_body_form.map((item, index) => {
      return requestBodyTpl(item, index)
    })

    const DEMOPATH= '/api/user/{id}'
    return (
      <Form onSubmit={this.handleSubmit}>

        <h2 className="interface-title" style={{ marginTop: 0 }}>基本设置</h2>
        <div className="panel-sub">
          <FormItem
            className="interface-edit-item"
            {...formItemLayout}
            label="接口名称"
          >
            {getFieldDecorator('title', {
              initialValue: this.state.title,
              rules: nameLengthLimit('接口')
            })(
              <Input id="title" placeholder="接口名称" />
              )}
          </FormItem>

          <FormItem
            className="interface-edit-item"
            {...formItemLayout}
            label="选择分类"
          >
            {getFieldDecorator('catid', {
              initialValue: this.state.catid + "",
              rules: [
                { required: true, message: '请选择一个分类' }
              ]
            })(
              <Select placeholder="请选择一个分类">
                {this.props.cat.map(item => {
                  return <Option key={item._id} value={item._id + ""} >{item.name}</Option>
                })}
              </Select>
              )}
          </FormItem>

          <FormItem
            className="interface-edit-item"
            {...formItemLayout}
            label={(
              <span>
                接口路径&nbsp;
                <Tooltip title={<div>
                  <p>1. 支持动态路由,例如:{DEMOPATH}</p>
                  <p>2. 支持 ?controller=xxx 的QueryRouter,非router的Query参数请定义到 Request设置-&#62;Query</p>
                </div>}>
                  <Icon type="question-circle-o" style={{ width: "10px" }} />
                </Tooltip>

              </span>
            )}
          >
            <InputGroup compact>
              <Select value={this.state.method} onChange={this.onChangeMethod} style={{ width: "15%" }}>
                {HTTP_METHOD_KEYS.map(item => {
                  return <Option key={item} value={item}>{item}</Option>
                })}
              </Select>

              <Tooltip title="接口基本路径，可在 项目设置 里修改" style={{ display: this.props.basepath == '' ? 'block' : 'none' }}>
                <Input disabled value={this.props.basepath} readOnly onChange={() => { }} style={{ width: '25%' }} />
              </Tooltip>
              {getFieldDecorator('path', {
                initialValue: this.state.path,
                rules: [{
                  required: true, message: '请输入接口路径!'
                }]
              })(
                <Input onChange={this.handlePath} placeholder="/path" style={{ width: '60%' }} />
                )}

            </InputGroup>
            <Row className="interface-edit-item">
              <Col span={24} offset={0}>
                {paramsList}
              </Col>

            </Row>


          </FormItem>

          <FormItem
            className="interface-edit-item"
            {...formItemLayout}
            label="状态"
          >
            {getFieldDecorator('status', { initialValue: this.state.status })(
              <Select>
                <Option value="done">已完成</Option>
                <Option value="undone">未完成</Option>
              </Select>
            )}
          </FormItem>
        </div>


        <h2 className="interface-title">Request 设置</h2>

        <div className="container-radiogroup">
          <RadioGroup value={this.state.req_radio_type} size="large" className="radioGroup" onChange={this.changeRadioGroup}>
            {HTTP_METHOD[this.state.method].request_body ? <RadioButton value="req-body">Body</RadioButton> : null}
            <RadioButton value="req-query">Query</RadioButton>
            <RadioButton value="req-headers">Headers</RadioButton>
          </RadioGroup>
        </div>

        <div className="panel-sub">
          <FormItem
            className={'interface-edit-item ' + this.state.hideTabs.req.query}
          >
            <Button size="small" type="primary" onClick={() => this.addParams('req_query')}>添加Query参数</Button>
          </FormItem>

          <Row className={'interface-edit-item ' + this.state.hideTabs.req.query}>
            <Col>
              <EasyDragSort data={()=>this.props.form.getFieldValue('req_query')} onChange={this.handleDragMove('req_query')} >
                {QueryList}
              </EasyDragSort>
            </Col>
          </Row>


          <FormItem
            className={'interface-edit-item ' + this.state.hideTabs.req.headers}
          >
            <Button size="small" type="primary" onClick={() => this.addParams('req_headers')}>添加Header</Button>
          </FormItem>

          <Row className={'interface-edit-item ' + this.state.hideTabs.req.headers}>
            <Col>
              <EasyDragSort data={()=>this.props.form.getFieldValue('req_headers')} onChange={this.handleDragMove('req_headers')} >
                {headerList}
              </EasyDragSort>
            </Col>

          </Row>
          {HTTP_METHOD[this.state.method].request_body ? <div >
            <FormItem
              className={'interface-edit-item ' + this.state.hideTabs.req.body}
            >
              {getFieldDecorator('req_body_type', {
                initialValue: this.state.req_body_type
              })(
                <RadioGroup>
                  <Radio value="form">form</Radio>
                  <Radio value="json">json</Radio>
                  <Radio value="file">file</Radio>
                  <Radio value="raw">raw</Radio>
                </RadioGroup>
                )}

            </FormItem>

            <Row className={'interface-edit-item ' + (this.props.form.getFieldValue('req_body_type') === 'form' ? this.state.hideTabs.req.body : 'hide')} >
              <Col style={{ minHeight: "50px" }}>
                <Row>
                  <Col span="24" className="interface-edit-item">

                    <Button size="small" type="primary" onClick={() => this.addParams('req_body_form')}>添加form参数</Button>

                  </Col>

                </Row>
                <EasyDragSort data={() => this.props.form.getFieldValue('req_body_form')} onChange={this.handleDragMove('req_body_form')} >
                  {requestBodyList}
                </EasyDragSort>

              </Col>
            </Row>


          </div>
            : null}


          <Row className={'interface-edit-item ' + (this.props.form.getFieldValue('req_body_type') === 'json' ? this.state.hideTabs.req.body : 'hide')}>
            <Col className="interface-edit-json-info">
              基于 Json5, 参数描述信息用注释的方式实现 <Tooltip title={<pre>
                {Json5Example}
              </pre>}>
                <Icon type="question-circle-o" style={{ color: "#086dbf" }} />
              </Tooltip>
              ，“全局编辑” 或 “退出全屏” 请按 F9
            </Col>
            <Col id="req_body_json" style={{ minHeight: "300px" }}>
            </Col>
          </Row>

          {this.props.form.getFieldValue('req_body_type') === 'file' && this.state.hideTabs.req.body !== 'hide' ?
            <Row className="interface-edit-item" >
              <Col className="interface-edit-item-other-body">
                {getFieldDecorator('req_body_other', { initialValue: this.state.req_body_other })(
                  <TextArea placeholder="" autosize={true} />
                )}
              </Col>


            </Row>
            :
            null
          }
          {this.props.form.getFieldValue('req_body_type') === 'raw'  && this.state.hideTabs.req.body !== 'hide'?
            <Row>
              <Col>
                {getFieldDecorator('req_body_other', { initialValue: this.state.req_body_other })(
                  <TextArea placeholder="" autosize={{ minRows: 8 }} />
                )}
              </Col>
            </Row>
            : null
          }
        </div>

        {/* ----------- Response ------------- */}

        <h2 className="interface-title">Response 设置</h2>
        <div className="container-radiogroup">
          {getFieldDecorator('res_body_type', {
            initialValue: this.state.res_body_type
          })(
            <RadioGroup size="large" className="radioGroup">
              <RadioButton value="json">JSON</RadioButton>
              <RadioButton value="raw">RAW</RadioButton>
            </RadioGroup>
            )}
        </div>
        <div className="panel-sub">
          <Row className="interface-edit-item" style={{ display: this.props.form.getFieldValue('res_body_type') === 'json' ? 'block' : 'none' }}>
            <Col>
              <Tabs defaultActiveKey="tpl" onChange={this.handleJsonType} >
                <TabPane tab="模板" key="tpl">

                </TabPane>
                <TabPane tab="预览" key="preview">

                </TabPane>

              </Tabs>
              <div>
                <h3 style={{ padding: '10px 0' }}>基于 mockjs 和 json5,使用注释方式写参数说明 <Tooltip title={<pre>
                  {Json5Example}
                </pre>}>
                  <Icon type="question-circle-o" style={{ color: "#086dbf" }} />
                </Tooltip> ,具体使用方法请 <span className="href" onClick={() => window.open('http://yapi.qunar.com/mock.html', '_blank')}>查看文档</span>
                ，“全局编辑” 或 “退出全屏” 请按 F9
                </h3>
                <div id="res_body_json" style={{ minHeight: "300px", display: this.state.jsonType === 'tpl' ? 'block' : 'none' }}  ></div>
                <div id="mock-preview" style={{ backgroundColor: "#eee", lineHeight: "20px", minHeight: "300px", display: this.state.jsonType === 'preview' ? 'block' : 'none' }}></div>
              </div>

            </Col>
          </Row>

          <Row className="interface-edit-item" style={{ display: this.props.form.getFieldValue('res_body_type') === 'raw' ? 'block' : 'none' }}>
            <Col>
              {getFieldDecorator('res_body', { initialValue: this.state.res_body })(
                <TextArea style={{ minHeight: "150px" }} placeholder="" />
              )}
            </Col>
          </Row>
        </div>


        {/* ----------- other ------------- */}

        <h2 className="interface-title">其 他</h2>
        <div className="container-radiogroup">
          <RadioGroup defaultValue="other-remark" size="large" className="radioGroup" onChange={this.changeRadioGroup}>
            <RadioButton value="other-remark">备 注</RadioButton>
            <RadioButton value="other-mail">邮 件</RadioButton>
          </RadioGroup>
        </div>
        <div className="panel-sub">
          <FormItem
            className={'interface-edit-item ' + this.state.hideTabs.other.remark}
          >
            <div >
              <div id="desc" className="remark-editor"></div>
            </div>
          </FormItem>
          <FormItem
            className={'interface-edit-item ' + this.state.hideTabs.other.mail}
            {...formItemLayout}
            label="是否开启邮件通知"
          >
            {getFieldDecorator('switch_notice', { valuePropName: 'checked', initialValue: false })(
              <Switch checkedChildren="开" unCheckedChildren="关" />
            )}
          </FormItem>
          <FormItem
            className={'interface-edit-item ' + (this.state.hideTabs.other.mail)}
            {...formItemLayout}
            label="改动日志"
          >
            {getFieldDecorator('message', { initialValue: "" })(
              <TextArea style={{ minHeight: "300px" }} placeholder="改动日志会通过邮件发送给关注此项目的用户" />
            )}
          </FormItem>
        </div>

        <FormItem
          className="interface-edit-item"
          style={{ textAlign: 'center', marginTop: '16px' }}
        >
          {/* <Button type="primary" htmlType="submit">保存1</Button> */}
          <Affix offsetBottom={0}>
            <Button className="interface-edit-submit-button" size="large" htmlType="submit">保存</Button>
          </Affix>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({
  onValuesChange() {
    EditFormContext.props.changeEditStatus(true);
  }
})(InterfaceEditForm);
