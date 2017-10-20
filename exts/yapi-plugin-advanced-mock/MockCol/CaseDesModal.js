import React, { Component } from 'react'
// import axios from 'axios'
import PropTypes from 'prop-types'
import { Button, Form, Input, Switch, Select, Icon, Modal } from 'antd';
import { safeAssign } from '../../../client/common.js';
import { httpCodes } from '../index.js';

const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

@Form.create()
export default class CaseDesModal extends Component {
  static propTypes = {
    form: PropTypes.object,
    caseData: PropTypes.object,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    isAdd: PropTypes.bool,
    visible: PropTypes.bool
  }
  
  constructor(props) {
    super(props);
  }

  preProcess = caseData => {
    // const a = {
    //   interface_id: { type: Number, required: true },
    //   project_id: {type: Number, required: true},
    //   ip: {type: String},
    //   ip_enable: {type: Boolean,  default: false},
    //   name: {type: String, required: true},
    //   code: {type: Number, default: 200},
    //   deplay: {type: Number,  default: 0},
    //   headers: [{
    //     name: {type: String, required: true},
    //     value: {type: String}
    //   }],
    //   params: mongoose.Schema.Types.Mixed,
    //   uid: String,
    //   up_time: Number,
    //   res_body: {type: String, required: true}
    // }
    const initCaseData =  {
      ip: '',
      ip_enable: false,
      name: '',
      code: '200',
      deplay: 0,
      headers: [{name: '', value: ''}],
      paramsArr: [{name: '', value: ''}],
      res_body: ''
    }
    caseData.paramsArr = caseData.params && caseData.params.length ? Object.keys(caseData.params).map(key => {
      return { name: key, value: caseData.params[key] }
    }) : [{name: '', value: ''}];
    caseData.headers = caseData.headers && caseData.headers.length ? caseData.headers : [{name: '', value: ''}];
    caseData = safeAssign(initCaseData, caseData);
    return caseData;
  }

  endProcess = caseData => {
    const headers = [];
    const params = {};
    caseData.headers.forEach(item => {
      if (item.name) {
        headers.push({
          name: item.name,
          value: item.value
        })
      }
    });
    caseData.paramsArr.forEach(item => {
      if (item.name) {
        params[item.name] = item.value
      }
    })
    caseData.headers = headers;
    caseData.params = params;
    delete caseData.paramsArr;
    return caseData;
  }

  componentDidMount() {
    this.props.form.setFieldsValue(this.preProcess(this.props.caseData))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.caseData !== nextProps.caseData) {
      this.props.form.setFieldsValue(this.preProcess(this.props.caseData))
    }
  }

  handleOk = () => {
    const form = this.props.form;
    this.props.onOk(this.endProcess(form.getFieldsValue()));
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { isAdd, visible, onCancel } = this.props;
    // const { caseData } = this.props;
    // const headers = caseData.headers || [{name: '', value: ''}];
    // const params = caseData.params || {'': ''};
    // const paramsArr = Object.keys(params).map(key => {
    //   return { name: key, value: params[key] }
    // })

    return (
      <Modal
        title={isAdd ? '添加期望' : '编辑期望'}
        visible={visible}
        maskClosable={false}
        onOk={this.handleOk}
        onCancel={() => onCancel()}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="期望名称"
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入期望名称！' }]
            })(
              <Input placeholder="请输入期望名称" />
            )}
          </FormItem>
          <FormItem label="IP 过滤">
            {getFieldDecorator('ip_enable', {
              valuePropName: 'checked',
              rules: [{ type: 'boolean' }]
            })(
              <Switch />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('ip')(
              <Input placeholder="请输入过滤的 IP 地址" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="HTTP CODE"
          >
            {getFieldDecorator('code')(
              <Select search>
                {
                  httpCodes.map(code => <Option key={''+code} value={''+code}>{''+code}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="延时"
          >
            {getFieldDecorator('deplay', {
              initialValue: 0,
              rules: [{ required: true, message: '请输入延时时间！', type: 'integer' }]
            })(
              <Input placeholder="请输入延时时间" />
            )}
          </FormItem>
          {
            getFieldDecorator('headers', { initialValue: [] }) &&
            getFieldValue('headers').map((item, index) => (
              <div key={index}>
                <FormItem
                  {...formItemLayout}
                  label={index ? '' : 'HTTP 头'}
                >
                  {getFieldDecorator(`headers[${index}].name`)(
                    <Input />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator(`headers[${index}].value`)(
                    <Input />
                  )}
                </FormItem>
              </div>
            ))
          }
          <FormItem>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> 添加 HTTP 头
            </Button>
          </FormItem>

          {
            getFieldDecorator('paramsArr', { initialValue: [] }) &&
            getFieldValue('paramsArr').map((item, index) => (
              <div  key={index}>
                <FormItem
                  label={index ? '' : '参数'}
                >
                  {getFieldDecorator(`paramsArr[${index}].name`)(
                    <Input />
                  )}
                  {getFieldValue('paramsArr').length > 1 ? (
                    <Icon
                      className="dynamic-delete-button"
                      type="minus-circle-o"
                      onClick={() => this.remove(index)}
                    />
                  ) : null}
                </FormItem>
                <FormItem
                >
                  {getFieldDecorator(`paramsArr[${index}].value`)(
                    <Input />
                  )}
                  {getFieldValue('paramsArr').length > 1 ? (
                    <Icon
                      className="dynamic-delete-button"
                      type="minus-circle-o"
                      onClick={() => this.remove(index)}
                    />
                  ) : null}
                </FormItem>
              </div>
            ))
          }
          <FormItem>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> 添加参数
            </Button>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="返回 JSON"
          >
            {getFieldDecorator('res_body', {
              rules: [{ required: true, message: '请输入期望名称！' }]
            })(
              <Input placeholder="返回 JSON" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
