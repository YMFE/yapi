import React, { PureComponent as Component } from 'react'
import { Form, Input, Icon, Select, Button, Row, Col, message } from 'antd';
import PropTypes from 'prop-types';
import { updateEnv, delProject, getProjectMsg, upsetProject } from '../../../../reducer/modules/project';
import { fetchGroupMsg } from '../../../../reducer/modules/group';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;
import '../Setting.scss';
// layout
const formItemLayout = {
  wrapperCol: {
    sm: { span: 24 }
  },
  className: 'form-item project-env'
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
    updateEnv,
    delProject,
    getProjectMsg,
    fetchGroupMsg,
    upsetProject
  }
)
@withRouter
class PrpjectEnv extends Component {
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
    updateEnv: PropTypes.func,
    delProject: PropTypes.func,
    getProjectMsg: PropTypes.func,
    history: PropTypes.object,
    fetchGroupMsg: PropTypes.func,
    upsetProject: PropTypes.func,
    projectList: PropTypes.array,
    projectMsg: PropTypes.object,
    onOk: PropTypes.func
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

  // 确认修改
  handleOk = (e) => {
    e.preventDefault();
    const { form, updateEnv, projectMsg } = this.props;
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
        console.log(assignValue);

        updateEnv(assignValue).then((res) => {
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
    this.props.onOk && this.props.onOk();
  }

  async componentWillMount() {
    await this.props.getProjectMsg(this.props.projectId);
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { projectMsg } = this.props;
    let envMessage = [];
    const { env } = projectMsg;
    if (env && env.length !== 0) {
      envMessage = env;
    }

    getFieldDecorator('envs', { initialValue: envMessage });
    const envs = getFieldValue('envs');
    const envSettingItems = envs.map((k, index) => {
      const secondIndex = 'next' + index; // 为保证key的唯一性
      return (
        <Row key={index} type="flex" justify="space-between" className={index === 0 ? ' env-first-row' : null} align={'top'}>
          <Col span={11}>
            <FormItem
              
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
    return (
      <div className="m-panel env">
        <div className="panel-title">
          <h2 className="title">在这里添加项目的环境配置</h2>
          <p className="desc">你可以添加多个环境，用于区分不同的使用场景。</p>
        </div>
        <FormItem {...formItemLayout}>
          {envSettingItems}
          <Button type="default" onClick={this.add} >
            <Icon type="plus" /> 添加环境配置
          </Button>
        </FormItem>
        <div className="btnwrap-changeproject">
          <Button className="m-btn btn-save" icon="save" type="primary" size="large" onClick={this.handleOk} >保 存</Button>
        </div>
      </div>
    )
  }
}

export default Form.create()(PrpjectEnv);
