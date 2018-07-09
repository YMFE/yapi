import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import { Icon, Row, Col, Form, Input, Select, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import constants from 'client/constants/variable.js';

class ProjectEnvContent extends Component {
  static propTypes = {
    projectMsg: PropTypes.object,
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    handleEnvInput: PropTypes.func
  };

  initState(curdata) {
    let header = [
      {
        name: '',
        value: ''
      }
    ];
    let cookie = [
      {
        name: '',
        value: ''
      }
    ];
    if (curdata && curdata.length !== 0) {
      curdata.forEach(item => {
        if (item.name === 'Cookie') {
          let cookieStr = item.value;
          if (cookieStr) {
            cookieStr = cookieStr.split(';').forEach(c => {
              if (c) {
                c = c.split('=');
                cookie.unshift({
                  name: c[0] ? c[0].trim() : '',
                  value: c[1] ? c[1].trim() : ''
                });
              }
            });
          }
        } else {
          header.unshift(item);
        }
      });
      return { header, cookie };
    } else {
      return { header, cookie };
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      header: [
        {
          name: '',
          value: ''
        }
      ],
      cookie: [
        {
          name: '',
          value: ''
        }
      ]
    };
  }
  addHeader = (value, index, name) => {
    let nextHeader = this.state[name][index + 1];
    if (nextHeader && typeof nextHeader === 'object') {
      return;
    }
    let newValue = {};
    let data = { name: '', value: '' };
    newValue[name] = [].concat(this.state[name], data);
    this.setState(newValue);
  };

  delHeader = (key, name) => {
    let curValue = this.props.form.getFieldValue(name);
    let newValue = {};
    newValue[name] = curValue.filter((val, index) => {
      return index !== key;
    });
    this.props.form.setFieldsValue(newValue);
    this.setState(newValue);
  };

  handleInit(data) {
    this.props.form.resetFields();
    let newValue = this.initState(data);
    this.setState({ ...newValue });
  }

  componentWillReceiveProps(nextProps) {
    let curEnvName = this.props.projectMsg.name;
    let nextEnvName = nextProps.projectMsg.name;
    if (curEnvName !== nextEnvName) {
      this.handleInit(nextProps.projectMsg.header);
    }
  }

  handleOk = e => {
    e.preventDefault();
    const { form, onSubmit, projectMsg } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let header = values.header.filter(val => {
          return val.name !== '';
        });
        let cookie = values.cookie.filter(val => {
          return val.name !== '';
        });
        if (cookie.length > 0) {
          header.push({
            name: 'Cookie',
            value: cookie.map(item => item.name + '=' + item.value).join(';')
          });
        }
        let assignValue = {};
        assignValue.env = Object.assign(
          { _id: projectMsg._id },
          {
            name: values.env.name,
            domain: values.env.protocol + values.env.domain,
            header: header
          }
        );
        onSubmit(assignValue);
      }
    });
  };

  render() {
    const { projectMsg } = this.props;
    const { getFieldDecorator } = this.props.form;
    const headerTpl = (item, index) => {
      const headerLength = this.state.header.length - 1;
      return (
        <Row gutter={2} key={index}>
          <Col span={10}>
            <FormItem>
              {getFieldDecorator('header[' + index + '].name', {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: item.name || ''
              })(
                <AutoComplete
                  style={{ width: '200px' }}
                  allowClear={true}
                  dataSource={constants.HTTP_REQUEST_HEADER}
                  placeholder="请输入header名称"
                  onChange={() => this.addHeader(item, index, 'header')}
                  filterOption={(inputValue, option) =>
                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem>
              {getFieldDecorator('header[' + index + '].value', {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: item.value || ''
              })(<Input placeholder="请输入参数内容" style={{ width: '90%', marginRight: 8 }} />)}
            </FormItem>
          </Col>
          <Col span={2} className={index === headerLength ? ' env-last-row' : null}>
            {/* 新增的项中，只有最后一项没有有删除按钮 */}
            <Icon
              className="dynamic-delete-button delete"
              type="delete"
              onClick={e => {
                e.stopPropagation();
                this.delHeader(index, 'header');
              }}
            />
          </Col>
        </Row>
      );
    };

    const cookieTpl = (item, index) => {
      const cookieLength = this.state.cookie.length - 1;
      return (
        <Row gutter={2} key={index}>
          <Col span={10}>
            <FormItem>
              {getFieldDecorator('cookie[' + index + '].name', {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: item.name || ''
              })(
                <Input
                  placeholder="请输入 Cookie Name"
                  style={{ width: '200px' }}
                  onChange={() => this.addHeader(item, index, 'cookie')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem>
              {getFieldDecorator('cookie[' + index + '].value', {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: item.value || ''
              })(<Input placeholder="请输入参数内容" style={{ width: '90%', marginRight: 8 }} />)}
            </FormItem>
          </Col>
          <Col span={2} className={index === cookieLength ? ' env-last-row' : null}>
            {/* 新增的项中，只有最后一项没有有删除按钮 */}
            <Icon
              className="dynamic-delete-button delete"
              type="delete"
              onClick={e => {
                e.stopPropagation();
                this.delHeader(index, 'cookie');
              }}
            />
          </Col>
        </Row>
      );
    };

    const envTpl = data => {
      return (
        <div>
          <h3 className="env-label">环境名称</h3>
          <FormItem required={false}>
            {getFieldDecorator('env.name', {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: data.name === '新环境' ? '' : data.name || '',
              rules: [
                {
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
                }
              ]
            })(
              <Input
                onChange={e => this.props.handleEnvInput(e.target.value)}
                placeholder="请输入环境名称"
                style={{ width: '90%', marginRight: 8 }}
              />
            )}
          </FormItem>
          <h3 className="env-label">环境域名</h3>
          <FormItem required={false}>
            {getFieldDecorator('env.domain', {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: data.domain ? data.domain.split('//')[1] : '',
              rules: [
                {
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
                }
              ]
            })(
              <Input
                placeholder="请输入环境域名"
                style={{ width: '90%', marginRight: 8 }}
                addonBefore={getFieldDecorator('env.protocol', {
                  initialValue: data.domain ? data.domain.split('//')[0] + '//' : 'http://',
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(
                  <Select>
                    <Option value="http://">{'http://'}</Option>
                    <Option value="https://">{'https://'}</Option>
                  </Select>
                )}
              />
            )}
          </FormItem>
          <h3 className="env-label">Header</h3>
          {this.state.header.map((item, index) => {
            return headerTpl(item, index);
          })}

          <h3 className="env-label">Cookie</h3>
          {this.state.cookie.map((item, index) => {
            return cookieTpl(item, index);
          })}
        </div>
      );
    };

    return (
      <div>
        {envTpl(projectMsg)}
        <div className="btnwrap-changeproject">
          <Button
            className="m-btn btn-save"
            icon="save"
            type="primary"
            size="large"
            onClick={this.handleOk}
          >
            保 存
          </Button>
        </div>
      </div>
    );
  }
}
export default Form.create()(ProjectEnvContent);
