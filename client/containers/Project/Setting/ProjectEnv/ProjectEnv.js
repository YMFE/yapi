import React, { PureComponent as Component } from 'react'
import { Form, Input, Icon, Select, Button, Row, Col, message } from 'antd';
import PropTypes from 'prop-types';
import { updateEnv, delProject, getProjectMsg, upsetProject } from '../../../../reducer/modules/project';
import { fetchGroupMsg } from '../../../../reducer/modules/group';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;
import EasyDragSort from '../../../../components/EasyDragSort/EasyDragSort.js';
import '../Setting.scss';
// layout
const formItemLayout = {
  wrapperCol: {
    sm: { span: 24 }
  },
  className: 'form-item project-env'
};
// let uuid = 0; // 环境配置的计数

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

  initState(curdata) {
    if (curdata.env && curdata.env.length === 0) delete curdata.env;
    console.log('curdata', curdata);
    return Object.assign({
      protocol: 'http:\/\/',
      envProtocolChange: 'http:\/\/',
      env: {
        name: '',
        domain: ''
      }
    }, curdata)
  }

  constructor(props) {
    super(props);
    const { projectMsg } = this.props;
    this.state = this.initState(projectMsg);
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

  delParams = (key, name) => {

    let curValue = this.props.form.getFieldValue(name);
    let newValue = {}
    newValue[name] = curValue.filter((val, index) => {
      return index !== key;
    })
    console.log('newValue',newValue);
    this.props.form.setFieldsValue(newValue)
    setTimeout(()=>{
      console.log('curValue',this.props.form.getFieldValue(name));
    },5000);
    // console.log('curValue',this.props.form.getFieldValue(name));
    this.setState(newValue)
  }

  addParams = (name, data) => {
    let newValue = {}
    data = { name: "", domain: "" }
    newValue[name] = [].concat(this.state[name], data)
    this.setState(newValue)
  }

  handleDragMove = (name) => {
    return (data) => {
      let newValue = {
        [name]: data
      }
      this.props.form.setFieldsValue(newValue);
      this.setState(newValue)
    }
  }

  // 确认修改
  handleOk = (e) => {
    e.preventDefault();
    const { form, updateEnv, projectMsg } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let assignValue = Object.assign(projectMsg, values);
        values.protocol = this.state.protocol.split(':')[0];
        assignValue.env = values.env.map((item) => {
          return {
            name: item.name,
            domain: item.protocol + item.domain
          }
        });
        updateEnv(assignValue).then((res) => {
          if (res.payload.data.errcode == 0) {
            this.props.getProjectMsg(this.props.projectId);
            message.success('修改成功! ');
          }
        }).catch(() => {
          message.error('环境设置不成功 ');
        });
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
    const envs = this.state.env;
    const envTpl = (item, index) => {
      const secondIndex = 'next' + index; // 为保证key的唯一性
      return (
        <Row key={index} type="flex" justify="space-between" className={index === 0 ? ' env-first-row' : null} align={'top'}>
          <Col span={11}>
            <FormItem
              required={false}
              key={index}
            >
              {getFieldDecorator('env[' + index + '].name', {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: envMessage.length !== 0 ? item.name : '',
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
              {getFieldDecorator('env[' + index + '].domain', {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: envMessage.length !== 0 && item.domain ? item.domain.split('\/\/')[1] : '',
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
                  getFieldDecorator('env[' + index + '].protocol', {
                    initialValue: envMessage.length !== 0 && item.domain ? item.domain.split('\/\/')[0] + '\/\/' : 'http\:\/\/',
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
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.delParams(index, 'env')}
            />
          </Col>
        </Row>
      );
    }
    const envSettingItems = envs.map((item, index) => {
      return envTpl(item, index)
    })
    console.log('env',getFieldValue('env'));
    return (
      <div className="m-panel env">
        <div className="panel-title">
          <h2 className="title">在这里添加项目的环境配置</h2>
          <p className="desc">你可以添加多个环境，用于区分不同的使用场景。</p>
        </div>
        <FormItem {...formItemLayout}>
          <EasyDragSort data={getFieldValue('env')} onChange={this.handleDragMove('env')} >
            {envSettingItems}
          </EasyDragSort>

          <Button type="default" onClick={() => this.addParams('env')} >
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
