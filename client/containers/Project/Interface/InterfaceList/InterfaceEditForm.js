import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Form, Select, Input,
  Button, Row, Col, Radio, Icon
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const dataTpl = {
  req_query: { name: "", required: "1", desc: "" },
  req_headers: { name: "", required: "1", desc: "" }
}

const mockEditor = require('./mockEditor.js');


class InterfaceEditForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    curdata: PropTypes.object,
    onSubmit: PropTypes.func
  }

  constructor(props) {
    super(props)
    const { curdata } = this.props;
    if (curdata.req_query && curdata.req_query.length === 0) delete curdata.req_query;
    if (curdata.req_headers && curdata.req_headers.length === 0) delete curdata.req_headers;
    if (curdata.req_body_form && curdata.req_body_form.length === 0) delete curdata.req_body_form;

    this.state = Object.assign({
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
      res_body: '',
      desc: '',
      res_body_mock: ''
    }, curdata)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.res_body_type === 'json') values.res_body = this.state.res_body;
        values.req_body_json = this.state.res_body;
        this.props.onSubmit(values)
      }
    });
  }

  componentDidMount() {
    let that = this;
    mockEditor({
      container: 'req_body_json',
      data: that.state.req_body_json,
      onChange: function (d) {
        that.setState({
          req_body_json: d.text
        })
      }
    })

    mockEditor({
      container: 'res_body_json',
      data: that.state.res_body,
      onChange: function (d) {
        
        that.setState({
          res_body: d.text,
          res_body_mock: d.mockText
        })
      }
    })
  }

  addParams = (name) => {
    let newValue = {}
    newValue[name] = [].concat(this.state[name], dataTpl[name])
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    };
    const prefixSelector = getFieldDecorator('method', {
      initialValue: 'GET'
    })(
      <Select style={{ width: 75 }}>
        <Option value="GET">GET</Option>
        <Option value="POST">POST</Option>
        <Option value="PUT">PUT</Option>
        <Option value="DELETE">DELETE</Option>
      </Select>
      );

    const queryTpl = (data, index) => {
      return <Row key={index}>
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
          <Icon type="delete" onClick={() => this.delParams(index, 'req_query')} />
        </Col>

      </Row>
    }

    const headerTpl = (data, index) => {
      return <Row key={index}>
        <Col span="4">
          {getFieldDecorator('req_headers[' + index + '].name', {
            initialValue: data.name
          })(
            <Input placeholder="参数名称" />
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
          <Icon type="delete" onClick={() => this.delParams(index, 'req_headers')} />
        </Col>

      </Row>
    }

    const requestBodyTpl = (data, index) => {
      return <Row key={index}>
        <Col span="8">
          {getFieldDecorator('req_body_form[' + index + '].name',{
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
          {getFieldDecorator('req_body_form[' + index + '].desc',{
            initialValue: data.desc
          })(
            <Input placeholder="备注" />
          )}
        </Col>
        <Col span="2" >
          <Icon type="delete" onClick={() => this.delParams(index, 'req_body_form')} />
        </Col>
      </Row>
    }

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
              required: true, message: '清输入接口名称!'
            }]
          })(
            <Input placeholder="接口名称" />
            )}
        </FormItem>

        <FormItem
          className="interface-edit-item"
          {...formItemLayout}
          label="接口路径"
        >
          {getFieldDecorator('path', {
            initialValue: this.state.path,
            rules: [{
              required: true, message: '清输入接口路径!'
            }]
          })(
            <Input addonBefore={prefixSelector} placeholder="/path" />
            )}
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


        <Row className="interface-edit-item" style={{ display: this.props.form.getFieldValue('req_body_type') === 'json' ? 'block' : 'none' }}>
          <Col span={18} offset={4} id="req_body_json" style={{ minHeight: "300px"}}>
          </Col>
        </Row>

        {this.props.form.getFieldValue('req_body_type') === 'file' ?
          <Row className="interface-edit-item" >
            <Col span={14} offset={6}>
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
          
          <Col span={18} offset={4}  id="res_body_json" style={{ minHeight: "300px" }}>

          </Col>
        </Row>

        <FormItem
          style={{ display: this.props.form.getFieldValue('res_body_type') === 'json' ? 'block' : 'none' }}
          className="interface-edit-item"
          {...formItemLayout}
          label="mock预览"
        >
          <pre style={{backgroundColor: "#eee", lineHeight: "20px"}}>
            {this.state.res_body_mock || " "}
          </pre>
        </FormItem>
       

        <Row className="interface-edit-item" style={{ display: this.props.form.getFieldValue('res_body_type') === 'raw' ? 'block' : 'none' }}>
          <Col span={18} offset={4} >
            {getFieldDecorator('res_body', { initialValue: this.state.res_body })(
              <Input.TextArea placeholder="备注信息" />
            )}
          </Col>


        </Row>


        <FormItem
          className="interface-edit-item"
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(InterfaceEditForm);