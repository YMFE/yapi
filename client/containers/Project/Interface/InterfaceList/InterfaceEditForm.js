import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'underscore'
import constants from '../../../../constants/variable.js'
import { handlePath } from '../../../../common.js'

import {
  Form, Select, Input, Tooltip,
  Button, Row, Col, Radio, Icon, AutoComplete
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const dataTpl = {
  req_query: { name: "", required: "1", desc: "" },
  req_headers: { name: "", required: "1", desc: "" },
  req_params: { name: "", desc: "" },
  req_body_form: { name: "", type: "text", required: "1", desc: "" }
}

const mockEditor = require('./mockEditor.js');
const HTTP_METHOD = constants.HTTP_METHOD;
const HTTP_METHOD_KEYS = Object.keys(HTTP_METHOD);
const HTTP_REQUEST_HEADER = constants.HTTP_REQUEST_HEADER;

class InterfaceEditForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    curdata: PropTypes.object,
    mockUrl: PropTypes.string,
    onSubmit: PropTypes.func,
    basepath: PropTypes.string,
    cat: PropTypes.array
  }

  constructor(props) {
    super(props)
    const { curdata } = this.props;
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
    this.state = Object.assign({
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
      mockUrl: this.props.mockUrl
    }, curdata)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.res_body_type === 'json') values.res_body = this.state.res_body;
        values.method = this.state.method;
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
          values.req_headers.map((item) => {
            if (item.name === 'Content-Type') {
              item.value = 'application/json'
              isHavaContentType = true;
            }
          })
          if (isHavaContentType === false) {
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
      }
    });
  }

  componentDidMount() {
    let that = this, mockPreview, resBodyEditor;
    mockEditor({
      container: 'req_body_json',
      data: that.state.req_body_other,
      onChange: function (d) {
        if (d.format !== true) return false;
        that.setState({
          req_body_other: d.text
        })
      }
    })

    resBodyEditor = mockEditor({
      container: 'res_body_json',
      data: that.state.res_body,
      onChange: function (d) {
        if (d.format !== true) return false;
        mockPreview.editor.setValue(d.mockText)
        that.setState({
          res_body: d.text,
          res_body_mock: d.mockText
        })
      }
    })

    mockPreview = mockEditor({
      container: 'mock-preview',
      data: resBodyEditor.curData.mockText,
      readOnly: true
    })
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

  handlePath = (e) => {
    let val = e.target.value;
    val = handlePath(val)
    this.props.form.setFieldsValue({
      path: val
    })
    if (val && val.indexOf(":") !== -1) {
      let paths = val.split("/"), name, i;
      for (i = 1; i < paths.length; i++) {
        if (paths[i][0] === ':') {
          name = paths[i].substr(1);
          if (!_.find(this.state.req_params, { name: name })) {
            this.addParams('req_params', { name: name })
          }
        }
      }

    }
  }

  onSelect = (name) => {
    console.log(name);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    };

    const queryTpl = (data, index) => {
      return <Row key={index} className="interface-edit-item-content">
        <Col span="4">
          {getFieldDecorator('req_query[' + index + '].name', {
            initialValue: data.name
          })(
            <Input placeholder="参数名称" />
            )}
        </Col>
        <Col span="4" >
          {getFieldDecorator('req_query[' + index + '].required', {
            initialValue: data.required
          })(
            <Select>
              <Option value="1">必需</Option>
              <Option value="0">非必需</Option>
            </Select>
            )}
        </Col>
        <Col span="8" >
          {getFieldDecorator('req_query[' + index + '].desc', {
            initialValue: data.desc
          })(
            <Input placeholder="备注" />
            )}
        </Col>
        <Col span="2" >
          <Icon type="delete" className="interface-edit-del-icon" onClick={() => this.delParams(index, 'req_query')} />
        </Col>

      </Row>
    }

    const headerTpl = (data, index) => {
      return <Row key={index} className="interface-edit-item-content">
        <Col span="6">
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
        <Col span="6" >
          {getFieldDecorator('req_headers[' + index + '].value', {
            initialValue: data.value
          })(
            <Input placeholder="参数值" />
            )}
        </Col>
        <Col span="8" >
          {getFieldDecorator('req_headers[' + index + '].desc', {
            initialValue: data.desc
          })(
            <Input placeholder="备注" />
            )}
        </Col>
        <Col span="2" >
          <Icon type="delete" className="interface-edit-del-icon" onClick={() => this.delParams(index, 'req_headers')} />
        </Col>

      </Row>
    }

    const requestBodyTpl = (data, index) => {
      return <Row key={index} className="interface-edit-item-content">
        <Col span="8">
          {getFieldDecorator('req_body_form[' + index + '].name', {
            initialValue: data.name
          })(
            <Input placeholder="name" />
            )}
        </Col>
        <Col span="4" >
          {getFieldDecorator('req_body_form[' + index + '].type', {
            initialValue: data.type
          })(
            <Select>
              <Option value="text">文本</Option>
              <Option value="file">文件</Option>
            </Select>
            )}
        </Col>
        <Col span="8">
          {getFieldDecorator('req_body_form[' + index + '].desc', {
            initialValue: data.desc
          })(
            <Input placeholder="备注" />
            )}
        </Col>
        <Col span="2" >
          <Icon type="delete" className="interface-edit-del-icon" onClick={() => this.delParams(index, 'req_body_form')} />
        </Col>
      </Row>
    }

    const paramsTpl = (data, index) => {
      return <Row key={index} className="interface-edit-item-content">
        <Col span="6">
          {getFieldDecorator('req_params[' + index + '].name', {
            initialValue: data.name
          })(
            <Input disabled placeholder="参数名称" />
            )}
        </Col>
        <Col span="8" >
          {getFieldDecorator('req_params[' + index + '].desc', {
            initialValue: data.desc
          })(
            <Input placeholder="备注" />
            )}
        </Col>
        <Col span="2" >
          <Icon type="delete" className="interface-edit-del-icon" onClick={() => this.delParams(index, 'req_params')} />
        </Col>

      </Row>
    }

    const paramsList = this.state.req_params.map((item, index) => {
      return paramsTpl(item, index)
    })

    const QueryList = this.state.req_query.map((item, index) => {
      return queryTpl(item, index)
    })

    const headerList = this.state.req_headers.map((item, index) => {
      return headerTpl(item, index)
    })

    const requestBodyList = this.state.req_body_form.map((item, index) => {
      return requestBodyTpl(item, index)
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          className="interface-edit-item"
          {...formItemLayout}
          label="接口名称"
        >
          {getFieldDecorator('title', {
            initialValue: this.state.title,
            rules: [{
              required: true, message: '请输入接口名称!'
            }]
          })(
            <Input placeholder="接口名称" />
            )}
        </FormItem>

        <FormItem
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
              <Tooltip title="接口路径，支持动态路由,例如:'/api/user/:id'">
                <Icon type="question-circle-o" style={{ width: "10px" }} />
              </Tooltip>

            </span>
          )}
        >
          <InputGroup compact>
            <Select value={this.state.method} onChange={val => this.setState({ method: val })} style={{ width: "15%" }}>
              {HTTP_METHOD_KEYS.map(item => {
                return <Option key={item} value={item}>{item}</Option>
              })}
            </Select>

            <Tooltip title="接口基本路径，可在项目配置里修改" style={{ display: this.props.basepath == '' ? 'block' : 'none' }}>
              <Input disabled value={this.props.basepath} readOnly onChange={() => { }} style={{ width: '25%' }} />
            </Tooltip>
            {getFieldDecorator('path', {
              initialValue: this.state.path,
              rules: [{
                required: true, message: '请输入接口路径!'
              }]
            })(
              <Input onBlur={this.handlePath} placeholder="/path" style={{ width: '60%' }} />
              )}
          </InputGroup>
          <Row className="interface-edit-item">
            <Col span={18} offset={0}>
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

        <FormItem
          className="interface-edit-item"
          {...formItemLayout}
          label="接口描述"
        >
          {getFieldDecorator('desc', { initialValue: this.state.desc })(
            <Input.TextArea placeholder="接口描述" />
          )}
        </FormItem>

        <FormItem
          className="interface-edit-item"
          {...formItemLayout}
          label="Query"
        >
          <Button size="small" type="primary" onClick={() => this.addParams('req_query')}>添加Query参数</Button>
        </FormItem>

        <Row className="interface-edit-item">
          <Col span={18} offset={4}>
            {QueryList}
          </Col>

        </Row>


        <FormItem
          className="interface-edit-item"
          {...formItemLayout}
          label="请求Headers"
        >
          <Button size="small" type="primary" onClick={() => this.addParams('req_headers')}>添加Header</Button>
        </FormItem>

        <Row className="interface-edit-item">
          <Col span={18} offset={4}>
            {headerList}
          </Col>

        </Row>
        {HTTP_METHOD[this.state.method].request_body ? <div >
          <FormItem
            className="interface-edit-item"
            {...formItemLayout}
            label="请求Body"
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
          {this.props.form.getFieldValue('req_body_type') === 'form' ?
            <Row className="interface-edit-item">
              <Col span={18} offset={4} style={{ minHeight: "50px" }}>
                <Row>
                  <Col span="24" className="interface-edit-item">

                    <Button size="small" type="primary" onClick={() => this.addParams('req_body_form')}>添加form参数</Button>

                  </Col>

                </Row>
                {requestBodyList}
              </Col>

            </Row>
            :
            null
          }
        </div>
          : null}


        <Row className="interface-edit-item" style={{ display: this.props.form.getFieldValue('req_body_type') === 'json' ? 'block' : 'none' }}>
          <Col span={18} offset={4} id="req_body_json" style={{ minHeight: "300px" }}>
          </Col>
        </Row>

        {this.props.form.getFieldValue('req_body_type') === 'file' ?
          <Row className="interface-edit-item" >
            <Col span={18} offset={4}>
              {getFieldDecorator('req_body_other', { initialValue: this.state.req_body_other })(
                <Input.TextArea placeholder="备注信息" />
              )}
            </Col>


          </Row>
          :
          null
        }
        {this.props.form.getFieldValue('req_body_type') === 'raw' ?
          <Row>
            <Col span={18} offset={4} >
              {getFieldDecorator('req_body_other', { initialValue: this.state.req_body_other })(
                <Input.TextArea placeholder="备注信息" />
              )}
            </Col>
          </Row>
          : null
        }

        <FormItem
          className="interface-edit-item"
          {...formItemLayout}
          label="响应Body"
        >
          {getFieldDecorator('res_body_type', {
            initialValue: this.state.res_body_type
          })(
            <RadioGroup>
              <Radio value="json">json</Radio>
              <Radio value="raw">raw</Radio>

            </RadioGroup>
            )}

        </FormItem>
        <Row className="interface-edit-item" style={{ display: this.props.form.getFieldValue('res_body_type') === 'json' ? 'block' : 'none' }}>

          <Col span={17} offset={4} >
            <div id="res_body_json" style={{ minHeight: "300px" }}  ></div>
          </Col>
        </Row>

        <FormItem
          style={{ display: this.props.form.getFieldValue('res_body_type') === 'json' ? 'block' : 'none' }}
          className="interface-edit-item"
          {...formItemLayout}
          label="mock地址"
        >
          <Input onChange={() => { }} value={this.state.mockUrl} />
        </FormItem>

        <FormItem
          style={{ display: this.props.form.getFieldValue('res_body_type') === 'json' ? 'block' : 'none' }}
          className="interface-edit-item"
          {...formItemLayout}
          label="预览"
        >
          <div id="mock-preview" style={{ backgroundColor: "#eee", lineHeight: "20px", minHeight: "300px" }}>

          </div>
        </FormItem>


        <Row className="interface-edit-item" style={{ display: this.props.form.getFieldValue('res_body_type') === 'raw' ? 'block' : 'none' }}>
          <Col span={18} offset={4} >
            {getFieldDecorator('res_body', { initialValue: this.state.res_body })(
              <Input.TextArea style={{ minHeight: "150px" }} placeholder="备注信息" />
            )}
          </Col>


        </Row>


        <FormItem
          className="interface-edit-item"
          wrapperCol={{ span: 14, offset: 10 }}
        >
          <Button type="primary" htmlType="submit">保存</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(InterfaceEditForm);
