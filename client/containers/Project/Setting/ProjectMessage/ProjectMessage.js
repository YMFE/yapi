import React, { Component } from 'react'
import { Form, Input, Icon, Tooltip, Select, Button, Row, Col, message, Card, Radio, Alert, Modal, Popover, Tabs, Affix } from 'antd';
import PropTypes from 'prop-types';
import { updateProject, delProject, getProjectMsg, upsetProject } from '../../../../reducer/modules/project';
import { fetchGroupMsg } from '../../../../reducer/modules/group';
import { connect } from 'react-redux';
const { TextArea } = Input;
import { withRouter } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import constants from '../../../../constants/variable.js';
const confirm = Modal.confirm;
import { nameLengthLimit } from '../../../../common';
import '../Setting.scss';
const TabPane = Tabs.TabPane;
// layout
const formItemLayout = {
  labelCol: {
    lg: { offset: 1, span: 3 },
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    lg: { span: 19 },
    xs: { span: 24 },
    sm: { span: 14 }
  },
  className: 'form-item'
};
let uuid = 0; // 环境配置的计数

@connect(
  state => {
    return {
      projectList: state.project.projectList,
      projectMsg: state.project.projectMsg
    }
  },
  {
    updateProject,
    delProject,
    getProjectMsg,
    fetchGroupMsg,
    upsetProject
  }
)
@withRouter
class ProjectMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      protocol: 'http:\/\/',
      envProtocolChange: 'http:\/\/',
      projectMsg: {}
    }
  }
  static propTypes = {
    projectId: PropTypes.number,
    form: PropTypes.object,
    updateProject: PropTypes.func,
    delProject: PropTypes.func,
    getProjectMsg: PropTypes.func,
    history: PropTypes.object,
    fetchGroupMsg: PropTypes.func,
    upsetProject: PropTypes.func,
    projectList: PropTypes.array,
    projectMsg: PropTypes.object
  }

  // 修改线上域名的协议类型 (http/https)
  protocolChange = (value) => {
    this.setState({
      protocol: value,
      currGroup: ''
    })
  }

  // 确认修改
  handleOk = (e) => {
    e.preventDefault();
    const { form, updateProject, projectMsg } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let assignValue = Object.assign(projectMsg, values);
        values.protocol = this.state.protocol.split(':')[0];
        assignValue.env = assignValue.envs.map((item, index) => {
          return {
            name: values['envs-name-' + index],
            domain: values['envs-protocol-' + index] + values['envs-domain-' + index]
          }
        });

        updateProject(assignValue).then((res) => {
          if (res.payload.data.errcode == 0) {
            this.props.getProjectMsg(this.props.projectId);
            message.success('修改成功! ');
            // this.props.history.push('/group');
          }
        }).catch(() => {
        });
        form.resetFields();
      }
    });
  }

  // 项目的修改操作 - 删除一项环境配置
  remove = (id) => {
    const { form } = this.props;
    // can use data-binding to get
    const envs = form.getFieldValue('envs');
    // We need at least one passenger
    if (envs.length === 0) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      envs: envs.filter(key => {
        const realKey = key._id ? key._id : key
        return realKey !== id;
      })
    });
  }

  // 项目的修改操作 - 添加一项环境配置
  add = () => {
    uuid++;
    const { form } = this.props;
    // can use data-binding to get
    const envs = form.getFieldValue('envs');
    const nextKeys = envs.concat(uuid);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      envs: nextKeys
    });
  }

  showConfirm = () => {
    let that = this;
    confirm({
      title: "确认删除 " + that.props.projectMsg.name + " 项目吗？",
      content: <div style={{ marginTop: '10px', fontSize: '13px', lineHeight: '25px' }}>
        <Alert message="警告：此操作非常危险,会删除该项目下面所有接口，并且无法恢复!" type="warning" banner />
        <div style={{ marginTop: '16px' }}>
          <p style={{ marginBottom: '8px' }}><b>请输入项目名称确认此操作:</b></p>
          <Input id="project_name" size="large" />
        </div>
      </div>,
      onOk() {
        let groupName = document.getElementById('project_name').value;
        if (that.props.projectMsg.name !== groupName) {
          message.error('项目名称有误')
          return new Promise((resolve, reject) => {
            reject('error')
          })
        } else {
          that.props.delProject(that.props.projectId).then((res) => {
            if (res.payload.data.errcode == 0) {
              message.success('删除成功!');
              that.props.history.push('/group');
            }
          });
        }

      },
      iconType: 'delete',
      onCancel() { }
    });
  }

  // 修改项目头像的背景颜色
  changeProjectColor = (e) => {
    const { _id, color, icon } = this.props.projectMsg;
    this.props.upsetProject({ id: _id, color: e.target.value || color, icon }).then((res) => {
      if (res.payload.data.errcode === 0) {
        this.props.getProjectMsg(this.props.projectId);
      }
    });
  }
  // 修改项目头像的图标
  changeProjectIcon = (e) => {
    const { _id, color, icon } = this.props.projectMsg;
    this.props.upsetProject({ id: _id, color, icon: e.target.value || icon }).then((res) => {
      if (res.payload.data.errcode === 0) {
        this.props.getProjectMsg(this.props.projectId);
      }
    });
  }

  async componentWillMount() {
    await this.props.getProjectMsg(this.props.projectId);
    const groupMsg = await this.props.fetchGroupMsg(this.props.projectMsg.group_id);
    this.setState({
      currGroup: groupMsg.payload.data.data.group_name
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { projectMsg } = this.props;
    const mockUrl =  location.protocol + '//' + location.hostname + (location.port !== "" ? ":" + location.port : "") + `/mock/${projectMsg._id}${projectMsg.basepath}+$接口请求路径`
    let initFormValues = {};
    let envMessage = [];
    const { name, basepath, desc, env, project_type } = projectMsg;
    initFormValues = { name, basepath, desc, env, project_type };
    if (env && env.length !== 0) {
      envMessage = env;
    }

    getFieldDecorator('envs', { initialValue: envMessage });
    const envs = getFieldValue('envs');
    const envSettingItems = envs.map((k, index) => {
      const secondIndex = 'next' + index; // 为保证key的唯一性
      return (
        <Row key={index} type="flex" justify="space-between" align={index === 0 ? 'middle' : 'top'}>
          <Col span={11}>
            <FormItem
              label={index === 0 ? (
                <span>环境名称</span>) : ''}
              required={false}
              key={index}
            >
              {getFieldDecorator(`envs-name-${index}`, {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: envMessage.length !== 0 ? k.name : '',
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
          </Col>
          <Col span={11}>
            <FormItem
              label={index === 0 ? (
                <span>环境域名</span>) : ''}
              required={false}
              key={secondIndex}
            >
              {getFieldDecorator(`envs-domain-${index}`, {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: envMessage.length !== 0 && k.domain ? k.domain.split('\/\/')[1] : '',
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
                  getFieldDecorator(`envs-protocol-${index}`, {
                    initialValue: envMessage.length !== 0 && k.domain ? k.domain.split('\/\/')[0] + '\/\/' : 'http\:\/\/',
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
          </Col>
          <Col span={2}>
            {/* 新增的项中，只有最后一项有删除按钮 */}
            {(envs.length > 0 && k._id) || (envs.length == index + 1) ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => {
                  return this.remove(k._id ? k._id : k);
                }}
              />
            ) : null}
          </Col>
        </Row>
      );
    });
    const colorArr = Object.entries(constants.PROJECT_COLOR);
    const colorSelector = (<RadioGroup onChange={this.changeProjectColor} value={projectMsg.color} className="color">
      {colorArr.map((item, index) => {
        return (<RadioButton key={index} value={item[0]} style={{ backgroundColor: item[1], color: '#fff', fontWeight: 'bold' }}>{item[0] === projectMsg.color ? <Icon type="check" /> : null}</RadioButton>);
      })}
    </RadioGroup>);
    const iconSelector = (<RadioGroup onChange={this.changeProjectIcon} value={projectMsg.icon} className="icon">
      {constants.PROJECT_ICON.map((item) => {
        return (<RadioButton key={item} value={item} style={{ fontWeight: 'bold' }}><Icon type={item} /></RadioButton>);
      })}
    </RadioGroup>);
    return (
      <div>
        <Tabs type="card" className="has-affix-footer">
          <TabPane tab="项目配置" key="1">
            <div className="m-panel">
              <Row className="project-setting">
                <Col xs={6} lg={{offset: 1, span: 3}} className="setting-logo">
                  <Popover placement="bottom" title={colorSelector} content={iconSelector} trigger="click" overlayClassName="change-project-container">
                    <Icon type={projectMsg.icon || 'star-o'} className="ui-logo" style={{ backgroundColor: constants.PROJECT_COLOR[projectMsg.color] || constants.PROJECT_COLOR.blue }} />
                  </Popover>
                </Col>
                <Col xs={18} sm={15} lg={19} className="setting-intro">
                  <h2 className="ui-title">{this.state.currGroup + ' / ' + projectMsg.name}</h2>
                  {/* <p className="ui-desc">{projectMsg.desc}</p> */}
                </Col>
              </Row>
              <hr className="breakline" />
              <Form>
                <FormItem
                  {...formItemLayout}
                  label="项目ID"
                >
                  <span >{this.props.projectMsg._id}</span>

                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="项目名称"
                >
                  {getFieldDecorator('name', {
                    initialValue: initFormValues.name,
                    rules: nameLengthLimit('项目')
                  })(
                    <Input />
                    )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="所属分组"
                >
                  <Input value={this.state.currGroup} disabled={true} />
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                      接口基本路径&nbsp;
                      <Tooltip title="基本路径为空表示根路径">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  )}
                >
                  {getFieldDecorator('basepath', {
                    initialValue: initFormValues.basepath,
                    rules: [{
                      required: false, message: '请输入基本路径! '
                    }]
                  })(
                    <Input />
                    )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                      MOCK地址&nbsp;
                      <Tooltip title="具体使用方法请查看文档">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  )}
                >

                  <Input disabled value={mockUrl} onChange={()=>{}} />

                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="描述"
                >
                  {getFieldDecorator('desc', {
                    initialValue: initFormValues.desc,
                    rules: [{
                      required: false
                    }]
                  })(
                    <TextArea rows={8} />
                    )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="权限"
                >
                  {getFieldDecorator('project_type', {
                    rules: [{
                      required: true
                    }],
                    initialValue: initFormValues.project_type
                  })(
                    <RadioGroup>
                      <Radio value="private" className="radio">
                        <Icon type="lock" />私有<br /><span className="radio-desc">只有组长和项目开发者可以索引并查看项目信息</span>
                      </Radio>
                      <br />
                      <Radio value="public" className="radio">
                        <Icon type="unlock" />公开<br /><span className="radio-desc">任何人都可以索引并查看项目信息</span>
                      </Radio>
                    </RadioGroup>
                    )}
                </FormItem>
              </Form>

              <FormItem
                {...formItemLayout}
                label="危险操作"
                className="danger-container"
              >
                <Card noHovering={true} className="card-danger">
                  <div className="card-danger-content">
                    <h3>删除项目</h3>
                    <p>项目一旦删除，将无法恢复数据，请慎重操作！</p>
                  </div>
                  <Button type="danger" ghost className="card-danger-btn" onClick={this.showConfirm}>删除</Button>
                </Card>
              </FormItem>
            </div>
          </TabPane>
          <TabPane tab="环境配置" key="2">
            <div className="m-panel">
              <FormItem
                {...formItemLayout}
              >
                {envSettingItems}
                <Button type="default" onClick={this.add} style={{ width: '50%' }}>
                  <Icon type="plus" /> 添加环境配置
                </Button>
              </FormItem>
            </div>
          </TabPane>
        </Tabs>

        <Affix offsetBottom={0}>
          <div className="btnwrap-changeproject">
            <Button className="m-btn btn-save" icon="save" type="primary" size="large" onClick={this.handleOk} >保 存</Button>
          </div>
        </Affix>
      </div>
    )
  }
}

export default Form.create()(ProjectMessage);
