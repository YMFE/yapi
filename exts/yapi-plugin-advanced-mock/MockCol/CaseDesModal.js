import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, Switch, Select, Icon, Modal, Col, Row, InputNumber, AutoComplete } from 'antd';
import { safeAssign } from '../../../client/common.js';
import mockEditor from '../../../client/containers/Project/Interface/InterfaceList/mockEditor';
import constants from '../../../client/constants/variable.js'
import { httpCodes } from '../index.js'
import { connect } from 'react-redux'

import './CaseDesModal.scss'

const Option = Select.Option;
const FormItem = Form.Item;
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
    paramsArr: []
    // res_body: ''
  }
  
  constructor(props) {
    super(props);
  }

  preProcess = caseData => {
    // caseModel
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
    const initCaseData = {
      ip: '',
      ip_enable: false,
      name: '',
      code: '200',
      deplay: 0,
      headers: [{name: '', value: ''}],
      paramsArr: [{name: '', value: ''}],
      res_body: ''
    }

    const paramsArr = caseData.params && Object.keys(caseData.params).length ? Object.keys(caseData.params).map(key => {
      return { name: key, value: caseData.params[key] }
    }) : [{name: '', value: ''}];
    const headers = caseData.headers && caseData.headers.length ? caseData.headers : [{name: '', value: ''}];
    caseData.code = ''+caseData.code;
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
    // const { res_body } = this.state;
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
    // caseData.res_body = res_body;
    delete caseData.paramsArr;
    return caseData;
  }

  componentDidMount() {
    this.props.form.setFieldsValue(this.preProcess(this.props.caseData))
    this.shouldLoadBodyEditor = true
  }

  componentDidUpdate() {
    if (this.shouldLoadBodyEditor) {
      this.loadBodyEditor()
      this.shouldLoadBodyEditor = false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.caseData !== nextProps.caseData ||
      this.props.visible !== nextProps.visible
    ) {
      this.props.form.setFieldsValue(this.preProcess(nextProps.caseData))
      this.shouldLoadBodyEditor = true
    }
  }

  handleOk = () => {
    const form = this.props.form;
    form.validateFields((err, values) => {
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
    const { req_query, req_body_form, req_body_type } = this.props.currInterface;
    const keys = [];
    req_query.forEach(item => {
      keys.push(item.name)
    })
    if (req_body_type === 'form') {
      req_body_form.forEach(item => {
        keys.push(item.name)
      })
    }
    return keys
  }

  loadBodyEditor = () => {
    const that = this;
    const { setFieldsValue } = this.props.form;
    this.props.visible && mockEditor({
      container: 'res_body_json',
      data: that.props.caseData.res_body,
      onChange: function (d) {
        if (d.format !== true) return false;
        // that.setState({
        //   res_body: d.text
        // })
        setFieldsValue({ res_body: d.text })
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { isAdd, visible, onCancel } = this.props;
    const { headers, paramsArr } = this.state;

    const valuesTpl = (name, values, title) => {
      getFieldDecorator(name)
      const dataSource = name === 'headers' ? constants.HTTP_REQUEST_HEADER : this.getParamsKey();
      return values.map((item, index) => (
        <div key={index} className={name}>
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
                      filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem>
                  {getFieldDecorator(`${name}[${index}].value`, { initialValue: item.value })(
                    <Input />
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

    return (
      <Modal
        title={isAdd ? '添加期望' : '编辑期望'}
        visible={visible}
        maskClosable={false}
        onOk={this.handleOk}
        width={780}
        onCancel={() => onCancel()}
        className="case-des-modal"
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
          <h2 className="sub-title">请求</h2>
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
                    rules: [{ pattern: constants.IP_REGEXP, message: '请填写正确的 IP 地址' }]
                  } : {})(
                    <Input placeholder="请输入过滤的 IP 地址" />
                  )}
                </FormItem>
              </div>
            </Col>
          </FormItem>
          {
            valuesTpl('paramsArr', paramsArr, '参数过滤')
          }
          <FormItem wrapperCol={{ span: 6, offset: 5 }}>
            <Button size="default" type="primary" onClick={() => this.addValues('paramsArr')} style={{ width: '100%' }}>
              <Icon type="plus" /> 添加参数
            </Button>
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
            {getFieldDecorator('deplay', {
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
          <FormItem {...formItemLayout} wrapperCol={{ span: 17 }} label="返回 JSON" required>
            <div id="res_body_json" style={{
              minHeight: "300px",
              border: "1px solid #d9d9d9",
              borderRadius: 4
            }} ></div>
            <FormItem
              {...formItemLayoutWithOutLabel}
            >
              {getFieldDecorator('res_body', {
                rules: [{ required: true, message: '请输入返回 JSON！' }]
              })(
                <Input placeholder="请输入期望名称" style={{display: 'none'}} />
              )}
            </FormItem>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
