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
  query: { name: "", required: "1", desc: "" },
  req_headers: { name: "", required: "1", desc: "" }
}

const mockEditor = require('./mockEditor.js');


class InterfaceEditForm extends Component {
  static propTypes = {
    form: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      title: 'title',
      path: 'path',
      method: 'get',
      query: [{
        name: 'name',
        desc: 'desc',
        required: "1"
      }],
      req_body_type: 'form',
      req_headers: [{
        name: 'Content-Type',
        value: 'application/x-www-form-urlencoded', required: "1"
      }],
      req_body_form: [{
        name: 'id',
        type: 'text',
        required: '1'
      }],
      res_body_type: 'json',
      res_body: ''
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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
          res_body: d.text
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
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
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
          {getFieldDecorator('query[' + index + '].name', {
            initialValue: data.name
          })(
            <Input placeholder="参数名称" />
            )}
        </Col>
        <Col span="4" >
          {getFieldDecorator('query[' + index + '].required', {
            initialValue: data.required
          })(
            <Select>
              <Option value="1">必需</Option>
              <Option value="0">非必需</Option>
            </Select>
            )}
        </Col>
        <Col span="8" >
          {getFieldDecorator('query[' + index + '].desc', {
            initialValue: data.desc
          })(
            <Input placeholder="备注" />
            )}
        </Col>
        <Col span="2" >
          <Icon type="delete" onClick={() => this.delParams(index, 'query')} />
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
          {getFieldDecorator('req_body_form[' + index + '].name')(
            <Input placeholder="name" />
          )}
        </Col>
        <Col span="4" >
          {getFieldDecorator('req_body_form[' + index + '].type', {
            initialValue: 'text'
          })(
            <Select>
              <Option value="text">文本</Option>
              <Option value="file">文件</Option>
            </Select>
            )}
        </Col>
        <Col span="8">
          {getFieldDecorator('req_body_form[' + index + '].desc')(
            <Input placeholder="备注" />
          )}
        </Col>
        <Col span="2" >
          <Icon type="delete" onClick={() => this.delParams(index, 'req_body_form')} />
        </Col>
      </Row>
    }

    const QueryList = this.state.query.map((item, index) => {
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
          {...formItemLayout}
          label="接口名称"
        >
          {getFieldDecorator('title', {
            rules: [{
              required: true, message: '清输入接口名称!'
            }]
          })(
            <Input placeholder="接口名称" />
            )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="接口路径"
        >
          {getFieldDecorator('path', {
            rules: [{
              required: true, message: '清输入接口路径!'
            }]
          })(
            <Input addonBefore={prefixSelector} placeholder="/path" />
            )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="状态"
        >
          {getFieldDecorator('status', { initialValue: 'undone' })(
            <Select>
              <Option value="done">已完成</Option>
              <Option value="undone">未完成</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="接口描述"
        >
          {getFieldDecorator('desc')(
            <Input.TextArea placeholder="接口描述" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Query"
        >
          <Button onClick={() => this.addParams('query')}>添加Query参数</Button>
        </FormItem>

        <Row>
          <Col span={18} offset={6}>
            {QueryList}
          </Col>

        </Row>


        <FormItem
          {...formItemLayout}
          label="请求Headers"
        >
          <Button onClick={() => this.addParams('req_headers')}>添加Header</Button>
        </FormItem>

        <Row>
          <Col span={18} offset={6}>
            {headerList}
          </Col>

        </Row>

        <FormItem style={{ marginBottom: "5px" }}
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
          <Row >
            <Col span={14} offset={6} style={{ minHeight: "50px", padding: "15px" }}>
              <Row>
                <Col span="24">

                  <Button onClick={() => this.addParams('req_body_form')}>添加form参数</Button>

                </Col>

              </Row>
              {requestBodyList}
            </Col>

          </Row>
          :
          null
        }


        <Row style={{ display: this.props.form.getFieldValue('req_body_type') === 'json' ? 'block' : 'none' }}>
          <Col span={14} offset={6} id="req_body_json" style={{ minHeight: "300px", padding: "15px" }}>
          </Col>
        </Row>

        {this.props.form.getFieldValue('req_body_type') === 'file' ?
          <Row >
            <Col span={14} offset={6} style={{ padding: "15px" }}>
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
            <Col span={14} offset={6} style={{ padding: "15px" }}>
              {getFieldDecorator('req_body_other', { initialValue: this.state.req_body_other })(
                <Input.TextArea placeholder="备注信息" />
              )}
            </Col>
          </Row>
          : null
        }

        <FormItem style={{ marginBottom: "5px" }}
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
        <Row style={{ display: this.props.form.getFieldValue('res_body_type') === 'json' ? 'block' : 'none' }}>
          <Col span={14} offset={6} id="res_body_json" style={{ minHeight: "300px", padding: "15px" }}>

          </Col>


        </Row>

        <Row style={{ display: this.props.form.getFieldValue('res_body_type') === 'raw' ? 'block' : 'none' }}>
          <Col span={14} offset={6} style={{ padding: "15px" }}>
            {getFieldDecorator('req_body_other', { initialValue: this.state.res_body })(
              <Input.TextArea placeholder="备注信息" />
            )}
          </Col>


        </Row>


        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(InterfaceEditForm);