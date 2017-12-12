import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import './index.scss'
import { Icon, Layout, Menu, Tooltip } from 'antd'
const { Content, Sider } = Layout;
import ProjectEnvContent from './ProjectEnvContent.js'


class ProjectEnv extends Component {


  constructor(props) {
    super(props);

    this.state = {
      envMsg: [{
        name: '12',
        domain: 'http://12',
        header: [{
          type: "Accept",
          content: "weeerrrff"
        }]
      }, {
        name: '13',
        domain: 'http://13'
      }, {
        name: '14',
        domain: 'http://14'
      }, {
        name: '15',
        domain: 'http://15'
      }],
      currentEnvMsg: {},
      delIcon: -1
    };
  }

  handleClick = (e) => {
    let newValue = this.state.envMsg.filter((val, index) => {
      return index == e.key - 1;
    })
    this.setState({
      currentEnvMsg: newValue[0],
      delIcon: e.key - 1
    })
  }

  render() {
    console.log('delIcon', this.state.delIcon);
    return (
      <div className="m-panel">
        <Layout className="project-env">
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              onClick={this.handleClick}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item disabled key="0">
                <div className="env-icon-style">
                  <h3>环境变量</h3>
                  <Tooltip title="添加环境变量">
                    <Icon type="plus" />
                  </Tooltip>
                </div>
              </Menu.Item>
              {
                this.state.envMsg.map((item, index) => {
                  return (
                    <Menu.Item key={index + 1}>
                      <span className="env-icon-style">
                        <span>{item.name}</span>
                        <Tooltip title="删除环境变量">
                          <Icon 
                          type='delete' 
                          className="interface-delete-icon" 
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
              <ProjectEnvContent projectMsg={this.state.currentEnvMsg} />
            </Content>
          </Layout>
        </Layout>
      </div>
    )
  }


}

export default ProjectEnv;

