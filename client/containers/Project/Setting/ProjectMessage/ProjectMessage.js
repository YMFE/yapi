import React, { Component } from 'react'
import { Form, Input, Icon, Tooltip, Select, Button, Row, Col, message, Card, Radio } from 'antd';
import PropTypes from 'prop-types';
import { updateProject, delProject, getProjectMsg } from '../../../../reducer/modules/project';
import { fetchGroupMsg } from '../../../../reducer/modules/group';
import { connect } from 'react-redux';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import '../Setting.scss';

// layout
const formItemLayout = {
  labelCol: {
    lg: { span: 3 },
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    lg: { span: 21 },
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
    fetchGroupMsg
  }
)
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
    fetchGroupMsg: PropTypes.func,
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
            message.success('修改成功! ');
          } else {
            message.error(res.payload.data.errmsg);
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

  handleDelete = () => {
    console.log(this.props); // 出问题了
    this.props.delProject(this.props.projectId).then((res) => {
      if (res.payload.data.errcode == 0) {
        message.success('删除成功!');
      }
    });
  }

  async componentWillMount() {
    await this.props.getProjectMsg(this.props.projectId);
    const groupMsg = await this.props.fetchGroupMsg(this.props.projectMsg.group_id);
    this.setState({
      currGroup: groupMsg.payload.data.data.group_name
    })
  }

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { projectMsg } = this.props;
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
          <Col span={10} offset={2}>
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
                        callback('请输入环境域名');
                      } else if (!/\S/.test(value)) {
                        callback('请输入环境域名');
                      } else if (/prd/.test(value)) {
                        callback('环境域名不能是"prd"');
                      } else {
                        return callback();
                      }
                    } else {
                      callback('请输入环境域名');
                    }
                  }
                }]
              })(
                <Input placeholder="请输入环境名称" style={{ width: '90%', marginRight: 8 }} />
                )}
            </FormItem>
          </Col>
          <Col span={10}>
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
                  message: "请输入环境域名",
                  validator(rule, value, callback) {
                    if (value) {
                      if (value.length === 0) {
                        callback('请输入环境域名');
                      } else if (!/\S/.test(value)) {
                        callback('请输入环境域名');
                      } else {
                        return callback();
                      }
                    } else {
                      callback('请输入环境域名');
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
    return (
      <div className="m-panel">
        <Form>
          <FormItem
            {...formItemLayout}
            label="项目名称"
          >
            {getFieldDecorator('name', {
              initialValue: initFormValues.name,
              rules: [{
                required: true, message: '请输入项目名称!'
              }]
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
                基本路径&nbsp;
                <Tooltip title="基本路径为空表示根路径">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('basepath', {
              initialValue: initFormValues.basepath,
              rules: [{
                required: false, message: '请输入项目基本路径! '
              }]
            })(
              <Input />
              )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="描述"
          >
            {getFieldDecorator('desc', {
              initialValue: initFormValues.desc,
              rules: [{
                required: false, message: '请输入描述!'
              }]
            })(
              <TextArea rows={4} />
              )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="所属分组"
          >
            {envSettingItems}
          </FormItem>

          <FormItem {...formItemLayout}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> 添加环境配置
            </Button>
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
        <Row>
          <Col sm={{ offset: 6 }} lg={{ offset: 3 }}>
            <Button className="m-btn" icon="plus" type="primary"
              onClick={this.handleOk}
              >修改项目</Button>
          </Col>
        </Row>

        <hr className="breakline" />

        <FormItem
          {...formItemLayout}
          label="危险操作"
        >
          <Card noHovering={true} className="card-danger">
            <div className="card-danger-content">
              <h3>删除项目</h3>
              <p>项目一旦删除，将无法恢复数据，请慎重操作！</p>
            </div>
            <Button type="danger" ghost className="card-danger-btn" onClick={this.handleDelete}>删除</Button>
          </Card>
        </FormItem>
      </div>
    )
  }
}

export default Form.create()(ProjectMessage);
