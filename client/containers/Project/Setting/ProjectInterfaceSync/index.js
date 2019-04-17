import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Switch, Button, Icon, Tooltip, message, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { getProject, updateProjectSync } from '../../../../reducer/modules/project';

// layout
const formItemLayout = {
  labelCol: {
    lg: { span: 5 },
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    lg: { span: 16 },
    xs: { span: 24 },
    sm: { span: 12 }
  },
  className: 'form-item'
};
const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      span: 16,
      offset: 11
    }
  }
};

@connect(
  state => {
    return {
      projectMsg: state.project.currProject
    };
  },
  {
    getProject,
    updateProjectSync
  }
)
@Form.create()
export default class ProjectInterfaceSync extends Component {
  static propTypes = {
    form: PropTypes.object,
    match: PropTypes.object,
    projectId: PropTypes.number,
    projectMsg: PropTypes.object,
    getProject: PropTypes.func,
    updateProjectSync: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      is_sync_open: false
    };
  }

  handleSubmit = async () => {
    const { form, projectId, updateProjectSync, getProject } = this.props;
    let params = {
      id: this.props.projectId,
      is_sync_open: this.state.is_sync_open
    };

    form.validateFields((err, values) => {
      if (!err) {
        let assignValue = Object.assign(params, values);
        updateProjectSync(assignValue)
          .then(res => {
            if (res.payload.data.errcode == 0) {
              message.success('保存成功');
              getProject(projectId);
            } else {
              message.error('保存失败, ' + res.payload.data.errmsg);
            }
          })
          .catch(() => { });
      }
    });

  };

  componentWillMount() {
    this.setState({
      is_sync_open: this.props.projectMsg.is_sync_open,
      sync_cron: this.props.projectMsg.sync_cron,
      sync_json_url: this.props.projectMsg.sync_json_url
    });
  }

  // 是否开启
  onChange = v => {
    this.setState({
      is_sync_open: v
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { projectMsg } = this.props;
    let initFormValues = {};
    const {
      name,
      basepath,
      desc,
      project_type,
      group_id,
      switch_notice,
      strice,
      is_json5,
      tag,
      sync_cron,
      sync_json_url,
      sync_mode
    } = projectMsg;
    initFormValues = {
      name,
      basepath,
      desc,
      project_type,
      group_id,
      switch_notice,
      strice,
      is_json5,
      tag,
      sync_cron,
      sync_json_url,
      sync_mode
    };
    return (
      <div className="m-panel">
        <Form>
          <FormItem
            label="是否开启自动同步"
            {...formItemLayout}
          >
            <Switch
              checked={this.state.is_sync_open}
              onChange={this.onChange}
              checkedChildren="开"
              unCheckedChildren="关"
            />
          </FormItem>

          {this.state.is_sync_open ? (
            <div>
              <FormItem {...formItemLayout} label={
                <span className="label">
                  数据同步&nbsp;
                  <Tooltip
                    title={
                      <div>
                        <h3 style={{ color: 'white' }}>普通模式</h3>
                        <p>不导入已存在的接口</p>
                        <br />
                        <h3 style={{ color: 'white' }}>智能合并</h3>
                        <p>
                          已存在的接口，将合并返回数据的 response，适用于导入了 swagger
                          数据，保留对数据结构的改动
                        </p>
                        <br />
                        <h3 style={{ color: 'white' }}>完全覆盖</h3>
                        <p>不保留旧数据，完全使用新数据，适用于接口定义完全交给后端定义</p>
                      </div>
                    }
                  >
                    <Icon type="question-circle-o" />
                  </Tooltip>{' '}
                </span>
              }>
                {getFieldDecorator('sync_mode', {
                  initialValue: initFormValues.sync_mode,
                  rules: [
                    {
                      required: true,
                      message: '请选择同步方式!'
                    }
                  ]
                })(

                  <Select>
                    <Option value="normal">普通模式</Option>
                    <Option value="good">智能合并</Option>
                    <Option value="merge">完全覆盖</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="项目的swagger地址(xxx/api/docs)">
                {getFieldDecorator('sync_json_url', {
                  rules: [
                    {
                      required: true,
                      message: '输入swagger地址'
                    }
                  ],
                  initialValue: initFormValues.sync_json_url
                })(<Input />)}
              </FormItem>

              <FormItem {...formItemLayout} label="定时cron表达式(默认每分钟更新一次)">
                {getFieldDecorator('sync_cron', {
                  rules: [
                    {
                      required: true,
                      message: '输入正确的cron表达式!'
                    }
                  ],
                  initialValue: initFormValues.sync_cron? initFormValues.sync_cron : '30 * * * * *'
                })(<Input />)}
              </FormItem>
            </div>
          ) : null}
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" icon="save" size="large" onClick={this.handleSubmit}>
              保存
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
