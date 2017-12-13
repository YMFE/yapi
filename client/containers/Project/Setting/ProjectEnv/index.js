import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { Icon, Layout, Menu, Tooltip, Modal, message } from 'antd'
const { Content, Sider } = Layout;
import ProjectEnvContent from './ProjectEnvContent.js'
import { connect } from 'react-redux';
import { updateEnv, delProject, getProjectMsg, upsetProject } from '../../../../reducer/modules/project';
import { fetchGroupMsg } from '../../../../reducer/modules/group';
const confirm = Modal.confirm;

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
class ProjectEnv extends Component {

  static propTypes = {
    projectId: PropTypes.number,
    updateEnv: PropTypes.func,
    delProject: PropTypes.func,
    getProjectMsg: PropTypes.func,
    fetchGroupMsg: PropTypes.func,
    upsetProject: PropTypes.func,
    projectList: PropTypes.array,
    projectMsg: PropTypes.object
  }

  initState(curdata, id) {
    let newValue = {};
    newValue['env'] = [].concat(curdata);
    newValue['_id'] = id;
    return Object.assign({
      currentEnvMsg: {},
      delIcon: null,
      currentKey: -2
    }, newValue)
  }

  constructor(props) {
    super(props);
    const { env, _id } = props.projectMsg
    this.state = this.initState(env, _id);
  }
  async componentWillMount() {
    await this.props.getProjectMsg(this.props.projectId);
  }


  handleClick = (key, data) => {
    let newValue = data.filter((val, index) => {
      return index == key - 1;
    })
    this.setState({
      currentEnvMsg: newValue[0],
      currentKey: key - 1
    })
  }


  // 增加环境变量项
  addParams = (name, data) => {
    let newValue = {}
    data = { name: "新环境", domain: "", header: [] }
    newValue[name] = [].concat(data, this.state[name])
    this.setState(newValue)
    this.handleClick(1, newValue[name]);
  }

  showConfirm = (key, name) => {
    let that = this;
    const ref = confirm({
      title: '您确认删除此环境变量',
      content: '温馨提示：环境变量删除后，无法恢复',
      async onOk() {
        let assignValue = that.delParams(key, name)
        await that.props.updateEnv(assignValue)
        ref.destroy()
      },
      onCancel() {
        ref.destroy()
      }
    });
  }

  // 删除环境变量项
  delParams = (key, name) => {
    let curValue = this.state.env;
    let newValue = {}
    newValue[name] = curValue.filter((val, index) => {
      return index !== key;
    })
    this.setState(newValue)
    this.handleClick(1, newValue[name]);
    newValue['_id'] = this.state._id;
    return newValue;
  }

  enterItem = (key) => {
    this.setState({ delIcon: key })
  }

  leaveItem = () => {
    this.setState({ delIcon: null })
  }

  onSubmit = (value) => {
    let assignValue = {};
    assignValue['env'] = [].concat(this.state.env);
    if (value.env._id) {
      let index = assignValue['env'].findIndex((item) => {
        return item._id === value.env._id
      })
      assignValue['env'].splice(index, 1, value['env'])
    } else {
      assignValue['env'].splice(0, 1, value['env'])
    }
    this.setState({ ...assignValue });
    assignValue['_id'] = this.state._id;
    this.props.updateEnv(assignValue).then((res) => {
      if (res.payload.data.errcode == 0) {
        this.props.getProjectMsg(this.props.projectId);
        message.success('修改成功! ');
      }
    }).catch(() => {
      message.error('环境设置不成功 ');
    });

  }


  render() {
    const { env } = this.state;
   
    return (
      <div className="m-env-panel">
        <Layout className="project-env">
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              onClick={(e) => this.handleClick(e.key, env)}
              selectedKeys={[this.state.currentKey + 1 + '']}
              style={{ height: '100%', borderRight: 0 }}

            >
              <Menu.Item disabled key="0" className="first-menu-item">
                <div className="env-icon-style">
                  <h3>环境变量</h3>
                  <Tooltip title="添加环境变量">
                    <Icon type="plus" onClick={() => this.addParams('env')} />
                  </Tooltip>
                </div>
              </Menu.Item>
              {
                this.state.env.map((item, index) => {
                  return (
                    <Menu.Item
                      key={index + 1}
                      onMouseEnter={() => this.enterItem(index)}
                      onMouseLeave={this.leaveItem}>
                      <span className="env-icon-style">
                        <span style={{ color: item.name === '新环境' && '#2395f1' }}>{item.name}</span>
                        <Tooltip title="删除环境变量">
                          <Icon
                            type='delete'
                            className="interface-delete-icon"
                            onClick={(e) => { e.stopPropagation(); this.showConfirm(index, 'env') }}
                            style={{ display: this.state.delIcon == index ? 'block' : 'none' }}
                          />
                        </Tooltip>
                      </span>
                    </Menu.Item>
                  )
                })
              }
            </Menu>
          </Sider>
          <Layout className="env-content">
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              <ProjectEnvContent projectMsg={this.state.currentEnvMsg} onSubmit={this.onSubmit} />
            </Content>
          </Layout>
        </Layout>
      </div>
    )
  }


}

export default ProjectEnv;

