import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, Switch, Select, Icon,message, Modal, Col, Row, InputNumber, AutoComplete } from 'antd';
import { safeAssign } from 'client/common.js';
import mockEditor from 'client/components/AceEditor/mockEditor';
import constants from 'client/constants/variable.js'
import { httpCodes } from '../index.js'
import { connect } from 'react-redux'

import './CaseDesModal.scss'
require('brace/mode/text');
const json5 = require('json5');

const Option = Select.Option;
const FormItem = Form.Item;
// const RadioButton = Radio.Button;
// const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 12 }
};
const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 12, offset: 5 }
};

@connect(
  state => {
    return {
      currInterface: state.inter.curdata
    }
  }
)
@Form.create()
export default class CaseDesModal extends Component {
  static propTypes = {
    form: PropTypes.object,
    caseData: PropTypes.object,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    isAdd: PropTypes.bool,
    visible: PropTypes.bool,
    currInterface: PropTypes.object
  }

  state = {
    headers: [],
    paramsArr: [],
    paramsForm: 'form' 
  }
  
  constructor(props) {
    super(props);
  }

  preProcess = caseData => {
    try {
      caseData = JSON.parse(JSON.stringify(caseData))
    } catch (error) {
      console.log(error)
    }
    // caseModel
    // const a = {
    //   interface_id: { type: Number, required: true },
    //   project_id: {type: Number, required: true},
    //   ip: {type: String},
    //   ip_enable: {type: Boolean,  default: false},
    //   name: {type: String, required: true},
    //   code: {type: Number, default: 200},
    //   delay: {type: Number,  default: 0},
    //   headers: [{
    //     name: {type: String, required: true},
    //     value: {type: String}
    //   }],
    //   params: mongoose.Schema.Types.Mixed,
    //   uid: String,
    //   up_time: Number,
    //   res_body: {type: String, required: true}
    // }
    const initCaseData = {
      ip: '',
      ip_enable: false,
      name: '',
      code: '200',
      delay: 0,
      headers: [{name: '', value: ''}],
      paramsArr: [{name: '', value: ''}],
      params: {},
      res_body: ''
    }
    caseData.params = caseData.params || {};
    const paramsArr = Object.keys(caseData.params).length ? Object.keys(caseData.params).map(key => {
      return { name: key, value: caseData.params[key] }
    }).filter(item => {
      if (typeof item.value === 'object') {
        this.setState({ paramsForm: 'json' })
      }
      return typeof item.value !== 'object'
    }) : [{name: '', value: ''}];
    const headers = caseData.headers && caseData.headers.length ? caseData.headers : [{name: '', value: ''}];
    caseData.code = ''+caseData.code;
    caseData.params = JSON.stringify(caseData.params, null, 2);
    this.setState({
      headers,
      paramsArr
    })
    caseData = safeAssign(initCaseData, { ...caseData, headers, paramsArr });
    return caseData;
  }

  endProcess = caseData => {
    const headers = [];
    const params = {};
    const { paramsForm } = this.state;
    caseData.headers && Array.isArray(caseData.headers) &&caseData.headers.forEach(item => {
      if (item.name) {
        headers.push({
          name: item.name,
          value: item.value
        })
      }
    });
    caseData.paramsArr && Array.isArray(caseData.paramsArr) &&caseData.paramsArr.forEach(item => {
      if (item.name) {
        params[item.name] = item.value
      }
    })
    caseData.headers = headers;
    if (paramsForm === 'form') {
      caseData.params = params;
    } else {
      try {
        caseData.params = json5.parse(caseData.params)
      } catch (error) {
        console.log(error)
        message.error('请求参数 json 格式有误，请修改')
        return false;           
      }
    }
    delete caseData.paramsArr;
    return caseData;
  }

  componentDidMount() {
    this.props.form.setFieldsValue(this.preProcess(this.props.caseData))
    this.shouldLoadEditor = true
  }

  componentDidUpdate() {
    if (this.shouldLoadEditor) {
      this.loadBodyEditor()
      this.loadParamsEditor()
    } else if (this.shouldLoadParamsEditor) {
      this.loadParamsEditor()
    }
    this.shouldLoadEditor = false
    this.shouldLoadParamsEditor = false
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.caseData !== nextProps.caseData ||
      this.props.visible !== nextProps.visible
    ) {
      this.props.form.setFieldsValue(this.preProcess(nextProps.caseData))
      this.shouldLoadEditor = true
    }
  }

  handleOk = () => {
    const form = this.props.form;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onOk(this.endProcess(values));
      }
    })
  }

  addValues = (key) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    let values = getFieldValue(key);
    values = values.concat({ name: '', value: ''});
    this.setState({ [key]: values })
    setFieldsValue({ [key]: values })
  }
  removeValues = (key, index) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    let values = getFieldValue(key);
    values = values.filter((item, index2) => index !== index2);
    this.setState({ [key]: values })
    setFieldsValue({ [key]: values })
  }

  getParamsKey = () => {
    let { req_query, req_body_form, req_body_type, method, req_body_other } = this.props.currInterface;
    let keys = [];

    req_query && Array.isArray(req_query) && req_query.forEach(item => {
      keys.push(item.name)
    })
    if (constants.HTTP_METHOD[method.toUpperCase()].request_body && req_body_type === 'form') {
      req_body_form && Array.isArray(req_body_form) && req_body_form.forEach(item => {
        keys.push(item.name)
      })
    } else if (constants.HTTP_METHOD[method.toUpperCase()].request_body && req_body_type === 'json') {
      try {
        const bodyObj = json5.parse(req_body_other)
        keys = keys.concat(Object.keys(bodyObj))
      } catch (error) {
        console.log(error)
      }
    }
    return keys
  }

  loadBodyEditor = () => {
    const that = this;
    const { setFieldsValue } = this.props.form;
    let editor;
    if(this.props.visible){
      editor = mockEditor({
        container: 'res_body_json',
        data: that.props.caseData.res_body,
        onChange: function (d) {
          // if (d.format !== true) return false;
          setFieldsValue({ res_body: d.text })
        }
      })
      if(this.props.currInterface.res_body_type !== 'json'){
        editor.editor.getSession().setMode('ace/mode/text');
      }
      
    }
    
    
  }
  loadParamsEditor = () => {
    const that = this;
    const { setFieldsValue } = this.props.form;
    this.props.visible && mockEditor({
      container: 'case_modal_params',
      data: that.props.caseData.params || {},
      onChange: function (d) {
        // if (d.format !== true) return false;
        setFieldsValue({ params: d.text })
      }
    });
  }

  // jsonValidator = (rule, value, callback) => {
  //   try {
  //     JSON.parse(value)
  //     callback()
  //   } catch (error) {
  //     callback(new Error())
  //   }
  // }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { isAdd, visible, onCancel } = this.props;
    const { headers, paramsArr, paramsForm } = this.state;

    const valuesTpl = (name, values, title) => {
      getFieldDecorator(name)
      const dataSource = name === 'headers' ? constants.HTTP_REQUEST_HEADER : this.getParamsKey();
      const display = (name === 'paramsArr' && paramsForm === 'json') ? 'none': ''
      return values.map((item, index) => (
        <div key={index} className={name} style={{ display }}>
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            wrapperCol={index === 0 ? { span: 19 } : { span: 19, offset: 5 }}
            label={index ? '' : title}
          >
            <Row gutter={8}>
              <Col span={10}>
                <FormItem>
                  {getFieldDecorator(`${name}[${index}].name`, { initialValue: item.name })(
                    <AutoComplete
                      dataSource={dataSource}
                      placeholder="参数名称"
                      filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem>
                  {getFieldDecorator(`${name}[${index}].value`, { initialValue: item.value })(
                    <Input placeholder="参数值" />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                {values.length > 1 ? (
                  <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => this.removeValues(name, index)}
                  />
                ) : null}
              </Col>
            </Row>
          </FormItem>
        </div>
      ))
    }
    getFieldDecorator('params')
    // if (paramsForm === 'json') {
    //   this.loadParamsEditor()
    // }

    return (
      <Modal
        title={isAdd ? '添加期望' : '编辑期望'}
        visible={visible}
        maskClosable={false}
        onOk={this.handleOk}
        width={780}
        onCancel={() => onCancel()}
        afterClose={() => this.setState({paramsForm: 'form'})}
        className="case-des-modal"
      >
        <Form>
          <h2 className="sub-title" style={{ marginTop: 0 }}>基本信息</h2>
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
          <FormItem {...formItemLayout} label="IP 过滤" className="ip-filter">
            <Col span={6} className="ip-switch">
              <FormItem>
                {getFieldDecorator('ip_enable', {
                  valuePropName: 'checked',
                  rules: [{ type: 'boolean' }]
                })(
                  <Switch />
                )}
              </FormItem>
            </Col>
            <Col span={18}>
              <div style={{display: getFieldValue('ip_enable') ? '' : 'none'}} className="ip">
                <FormItem>
                  {getFieldDecorator('ip', getFieldValue('ip_enable') ? {
                    rules: [{ pattern: constants.IP_REGEXP, message: '请填写正确的 IP 地址', required: true }]
                  } : {})(
                    <Input placeholder="请输入过滤的 IP 地址" />
                  )}
                </FormItem>
              </div>
            </Col>
          </FormItem>
          <Row className="params-form" style={{marginBottom: 8}}>
            <Col {...{ span: 12, offset: 5 }}>
              <Switch
                size="small"
                checkedChildren="JSON"
                unCheckedChildren="JSON"
                checked={paramsForm === 'json'}
                onChange={bool => { 
                  if (bool) {
                    this.shouldLoadParamsEditor = true
                  }
                  this.setState({ paramsForm: bool ? 'json' : 'form' })
                }}
              />
            </Col>
          </Row>
          {
            valuesTpl('paramsArr', paramsArr, '参数过滤')
          }
          <FormItem wrapperCol={{ span: 6, offset: 5 }} style={{display: paramsForm === 'form' ? '': 'none'}}>
            <Button size="default" type="primary" onClick={() => this.addValues('paramsArr')} style={{ width: '100%' }}>
              <Icon type="plus" /> 添加参数
            </Button>
          </FormItem>
          <FormItem {...formItemLayout} wrapperCol={{ span: 17 }} label="参数过滤" style={{display: paramsForm === 'form' ? 'none': ''}}>
            <div id="case_modal_params" style={{
              minHeight: "300px",
              border: "1px solid #d9d9d9",
              borderRadius: 4
            }} ></div>
            <FormItem
              {...formItemLayoutWithOutLabel}
            >
              {getFieldDecorator('params', paramsForm === 'json' ? {
                rules: [{ validator: this.jsonValidator, message: '请输入正确的 JSON 字符串！' }]
              } : {})(
                <Input style={{display: 'none'}} />
              )}
            </FormItem>
          </FormItem>
          <h2 className="sub-title">响应</h2>
          <FormItem
            {...formItemLayout}
            required
            label="HTTP Code"
          >
            {getFieldDecorator('code')(
              <Select showSearch>
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
            {getFieldDecorator('delay', {
              initialValue: 0,
              rules: [{ required: true, message: '请输入延时时间！', type: 'integer' }]
            })(
              <InputNumber placeholder="请输入延时时间" min={0}/>
            )}
            <span>ms</span>
          </FormItem>
          {
            valuesTpl('headers', headers, 'HTTP 头')
          }
          <FormItem wrapperCol={{ span: 6, offset: 5 }}>
            <Button size="default" type="primary" onClick={() => this.addValues('headers')} style={{ width: '100%' }}>
              <Icon type="plus" /> 添加 HTTP 头
            </Button>
          </FormItem>
          <FormItem {...formItemLayout} wrapperCol={{ span: 17 }} label="Body" required>
            <div id="res_body_json" style={{
              minHeight: "300px",
              border: "1px solid #d9d9d9",
              borderRadius: 4
            }} ></div>
            <FormItem
              {...formItemLayoutWithOutLabel}
            >
              {getFieldDecorator('res_body')(
                <Input style={{display: 'none'}} />
              )}
            </FormItem>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
