import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Input, Icon, Tooltip, Select, message, Row, Col, Radio } from 'antd';
import { addProject, fetchProjectList, delProject, changeUpdateModal, changeTableLoading } from  '../../../reducer/modules/project';
// import { Link } from 'react-router-dom'
// import variable from '../../../constants/variable';
// import common from '../../../common';
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
      projectList: state.project.projectList,
      userInfo: state.project.userInfo,
      tableLoading: state.project.tableLoading,
      currGroup: state.group.currGroup,
      total: state.project.total,
      currPage: state.project.currPage
    }
  },
  {
    fetchProjectList,
    addProject,
    delProject,
    changeUpdateModal,
    changeTableLoading
  }
)
class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      protocol: 'http:\/\/',
      projectData: []
    }
  }
  static propTypes = {
    form: PropTypes.object,
    fetchProjectList: PropTypes.func,
    addProject: PropTypes.func,
    delProject: PropTypes.func,
    changeUpdateModal: PropTypes.func,
    changeTableLoading: PropTypes.func,
    projectList: PropTypes.array,
    userInfo: PropTypes.object,
    tableLoading: PropTypes.bool,
    currGroup: PropTypes.object,
    total: PropTypes.number,
    currPage: PropTypes.number
  }

  // 确认添加项目
  @autobind
  handleOk(e) {
    const { form, currGroup, changeTableLoading, addProject, fetchProjectList } = this.props;
    const that = this;
    e.preventDefault();
    form.validateFields((err, values) => {
      // console.log(values);
      if (!err) {
        values.protocol = this.state.protocol.split(':')[0];
        // 获取当前分组id传入values
        values.group_id = currGroup._id;

        changeTableLoading(true);
        addProject(values).then((res) => {
          // 添加项目成功后再次请求列表
          if (res.payload.data.errcode == 0) {
            that.setState({
              visible: false
            });
            form.resetFields();
            message.success('创建成功! ');
            fetchProjectList(currGroup._id, this.props.currPage).then(() => {
              changeTableLoading(false);
            });
          } else {
            changeTableLoading(false);
            message.error(res.payload.data.errmsg);
          }
        }).catch(() => {
          changeTableLoading(false);
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

  componentWillReceiveProps(nextProps) {
    // 切换项目列表
    if (this.props.projectList !== nextProps.projectList) {
      // console.log(nextProps.projectList);
      const data = nextProps.projectList.map((item, index) => {
        item.key = index;
        return item;
      });
      this.setState({
        projectData: data
      });
    }
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
                <Option value="china">China</Option>
                <Option value="use">U.S.A</Option>
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
            {getFieldDecorator('radio-group', {
              rules: [{
                required: true
              }],
              initialValue: 1
            })(
              <RadioGroup>
                <Radio value={1} className="radio">
                  <Icon type="lock" />私有<br /><span className="radio-desc">只有组长和项目开发者可以索引并查看项目信息</span>
                </Radio>
                <br />
                <Radio value={2} className="radio">
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
