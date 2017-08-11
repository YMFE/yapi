import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Input, Icon, Tooltip, Select, message, Row, Col, Radio } from 'antd';
import { addProject } from  '../../reducer/modules/project.js';
import { fetchGroupList } from '../../reducer/modules/group.js'
import { autobind } from 'core-decorators';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import './Addproject.scss'

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

@connect(
  state => {
    return {
      groupList: state.group.groupList
    }
  },
  {
    fetchGroupList,
    addProject
  }
)

class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      protocol: 'http:\/\/',
      groupList: []
    }
  }
  static propTypes = {
    groupList: PropTypes.array,
    form: PropTypes.object,
    addProject: PropTypes.func,
    fetchGroupList: PropTypes.func
  }

  // 确认添加项目
  @autobind
  handleOk(e) {
    const { form, addProject } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      console.log(values);
      if (!err) {
        values.protocol = this.state.protocol.split(':')[0];

        addProject(values).then((res) => {
          if (res.payload.data.errcode == 0) {
            form.resetFields();
            message.success('创建成功! ');
          }
        }).catch(() => {
        });
      }
    });
  }

  // 修改线上域名的协议类型 (http/https)
  @autobind
  protocolChange(value) {
    this.setState({
      protocol: value
    })
  }

  async componentWillMount() {
    await this.props.fetchGroupList();
    this.setState({groupList: this.props.groupList});
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="g-row m-container">
        <Form>

          <FormItem
            {...formItemLayout}
            label="项目名称"
          >
            {getFieldDecorator('name', {
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
            {getFieldDecorator('group_id', {
              rules: [{
                required: true, message: '请选择项目所属的分组!'
              }]
            })(
              <Select>
                {this.state.groupList.map((item, index) => <Option value={item._id.toString()} key={index}>{item.group_name}</Option>)}
              </Select>
            )}
          </FormItem>

          <hr className="breakline" />

          <FormItem
            {...formItemLayout}
            label={(
              <span>
                线上域名&nbsp;
                <Tooltip title="将根据配置的线上域名访问mock数据">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('prd_host', {
              rules: [{
                required: true,
                message: '请输入项目线上域名!'
              }]
            })(
              <Input addonBefore={(
                <Select defaultValue="http://" onChange={this.protocolChange}>
                  <Option value="http://">{'http:\/\/'}</Option>
                  <Option value="https://">{'https:\/\/'}</Option>
                </Select>)} />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={(
              <span>
                基本路径&nbsp;
                <Tooltip title="基本路径为空是根路径">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('basepath', {
              rules: [{
                required: false, message: '请输入项目基本路径'
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
              rules: [{
                required: false, message: '请输入描述!'
              }]
            })(
              <TextArea rows={4} />
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
              initialValue: 'private'
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
              >创建项目</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(ProjectList);
