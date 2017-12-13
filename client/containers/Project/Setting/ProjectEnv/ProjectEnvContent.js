import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { Icon, Row, Col, Form, Input, Select, AutoComplete, Button } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import constants from 'client/constants/variable.js'


const EmptyPrompt = () => {
  return <div className="m-empty-prompt">
    <span><Icon type="select"></Icon>请选择或创建新环境</span>
  </div>
}

class ProjectEnvContent extends Component {
  static propTypes = {
    projectMsg: PropTypes.object,
    form: PropTypes.object,
    onSubmit: PropTypes.func
  }

  initState(curdata) {
    console.log('curdata', curdata)
    let header = [{
      type: "",
      content: ""
    }];
    if (curdata && curdata.length !== 0) {
      curdata.forEach(item => {
        header.unshift(item);
      })
      return { header };
    } else {
      return { header };
    }
  }

  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      header: [{
        type: "",
        content: ""
      }]
    }
  }
  addHeader = (name) => {
    let newValue = {}
    let data = { type: "", content: "" }
    newValue[name] = [].concat(this.state[name], data)
    this.setState(newValue)
  }

  delHeader = (key, name) => {
    let curValue = this.props.form.getFieldValue(name);
    let newValue = {}
    newValue[name] = curValue.filter((val, index) => {
      return index !== key;
    })
    this.props.form.setFieldsValue(newValue)
    this.setState(newValue)
  }


  handleInit(data) {
    console.log('init')
    this.props.form.resetFields();
    let newValue = this.initState(data)
    this.setState({ ...newValue });
  }

  componentWillReceiveProps(nextProps) {
    let curEnvName = this.props.projectMsg.name;
    let nextEnvName = nextProps.projectMsg.name
    if (curEnvName !== nextEnvName) {
      this.handleInit(nextProps.projectMsg.header);
    }
  }

  handleOk = (e) => {
    e.preventDefault();
    const { form, onSubmit, projectMsg } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let header = values.header.filter(val => {
          return val.type !== ''
        })
        let assignValue = {};
        assignValue.env = Object.assign({ _id: projectMsg._id }, {
          name: values.env.name,
          domain: values.env.protocol + values.env.domain,
          header: header
        });
        onSubmit(assignValue);
      }
    });
  }


  render() {
    const { projectMsg } = this.props;
    const { getFieldDecorator } = this.props.form;
    const headerTpl = (item, index) => {
      const secondIndex = 'next' + index; // 为保证key的唯一性
      return <Row gutter={2} key={index}>
        <Col span={10}>
          <FormItem key={index}>
            {getFieldDecorator('header[' + index + '].type', {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: item.type || ''
            })(
              <AutoComplete
                style={{ width: '200px' }}
                dataSource={constants.HTTP_REQUEST_HEADER}
                placeholder="请输入header名称"
                onChange={() => this.addHeader('header')}
                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
              />
              )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key={secondIndex}>
            {getFieldDecorator('header[' + index + '].content', {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: item.content || ''
            })(
              <Input placeholder="请输入参数内容" style={{ width: '90%', marginRight: 8 }} />
              )}
          </FormItem>
        </Col>
        <Col span={2} className={index === this.state.header.length - 1 ? ' env-last-row' : null}>
          {/* 新增的项中，只有最后一项没有有删除按钮 */}
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={(e) => { e.stopPropagation(); this.delHeader(index, 'header') }}
          />
        </Col>
      </Row>
    }

    const envTpl = (data) => {
      return (
        <div>
          <h3 className="env-label">环境名称</h3>
          <FormItem
            required={false}
          >
            {getFieldDecorator('env.name', {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: data.name === '新环境' ? '' : data.name || '',
              rules: [{
                required: false,
                whitespace: true,
                validator(rule, value, callback) {
                  if (value) {
                    if (value.length === 0) {
                      callback('请输入环境名称');
                    } else if (!/\S/.test(value)) {
                      callback('请输入环境名称');
                    } else {
                      return callback();
                    }
                  } else {
                    callback('请输入环境名称');
                  }
                }
              }]
            })(
              <Input placeholder="请输入环境名称" style={{ width: '90%', marginRight: 8 }} />
              )}
          </FormItem>
          <h3 className="env-label">环境域名</h3>
          <FormItem
            required={false}
          >
            {getFieldDecorator('env.domain', {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: data.domain ? data.domain.split('\/\/')[1] : '',
              rules: [{
                required: false,
                whitespace: true,
                validator(rule, value, callback) {
                  if (value) {
                    if (value.length === 0) {
                      callback('请输入环境域名!');
                    } else if (/\s/.test(value)) {
                      callback('环境域名不允许出现空格!');
                    } else {
                      return callback();
                    }
                  } else {
                    callback('请输入环境域名!');
                  }
                }
              }]
            })(
              <Input placeholder="请输入环境域名" style={{ width: '90%', marginRight: 8 }} addonBefore={
                getFieldDecorator('env.protocol', {
                  initialValue: data.domain ? data.domain.split('\/\/')[0] + '\/\/' : 'http\:\/\/',
                  rules: [{
                    required: true
                  }]
                })(
                  <Select>
                    <Option value="http://">{'http:\/\/'}</Option>
                    <Option value="https://">{'https:\/\/'}</Option>
                  </Select>
                  )} />
              )}
          </FormItem>
          <h3 className="env-label">请求Header头部</h3>
          {this.state.header.map((item, index) => {
            return headerTpl(item, index)
          })}
        </div>
      );
    }
    const envSettingItems = () => {
      return envTpl(projectMsg)
    }
    return (
      <div>
        {projectMsg.name ?
          <div>
            {envSettingItems()}
            <div className="btnwrap-changeproject">
              <Button className="m-btn btn-save" icon="save" type="primary" size="large" onClick={this.handleOk} >保 存</Button>
            </div>
          </div>
          : <EmptyPrompt />}
      </div>
    )
  }

}
export default Form.create()(ProjectEnvContent);