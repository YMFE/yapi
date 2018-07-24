import React, { Component } from 'react';
// import { connect } from 'react-redux'
import { connect } from 'react-redux';
// import axios from 'axios'
import PropTypes from 'prop-types';
// import { withRouter } from 'react-router-dom';
import { Form, Switch, Button, Icon, Tooltip,message } from 'antd';
// import mockEditor from 'client/components/AceEditor/mockEditor';
import AceEditor from '../../../../components/AceEditor/AceEditor';
// import constants from '../../client/constants/variable.js'
const FormItem = Form.Item;
import { updateProjectMock, getProject } from '../../../../reducer/modules/project';
@connect(
  state => {
    return {
      projectMsg: state.project.currProject
    };
  },
  {
    updateProjectMock,
    getProject
  }
)
@Form.create()
export default class ProjectMock extends Component {
  static propTypes = {
    form: PropTypes.object,
    match: PropTypes.object,
    projectId: PropTypes.number,
    updateProjectMock: PropTypes.func,
    projectMsg: PropTypes.object,
    getProject: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      is_mock_open: false,
      project_mock_script: ''
    };
  }

  handleSubmit = async () => {
    let params = {
      id: this.props.projectId,
      project_mock_script: this.state.project_mock_script,
      is_mock_open: this.state.enable
    }
   
    let result = await this.props.updateProjectMock(params);
    
    if (result.payload.data.errcode === 0) {
      message.success('保存成功');
      await this.props.getProject(this.props.projectId);
    } else {
      message.success('保存失败, ' + result.payload.data.errmsg);
    }
  };

  componentWillMount() {
    // this.getAdvMockData();
    this.setState({
      is_mock_open: this.props.projectMsg.is_mock_open,
      project_mock_script: this.props.projectMsg.project_mock_script
    })
  }

  async getAdvMockData() {
    // let interfaceId = this.props.match.params.actionId;
    // let result = await axios.get('/api/plugin/advmock/get?interface_id=' + interfaceId);
    // if (result.data.errcode === 0) {
    //   let mockData = result.data.data;
    //   this.setState({
    //     enable: mockData.enable,
    //     mock_script: mockData.mock_script
    //   })
    // }
    // let that = this;
    // mockEditor({
    //   container: 'global-mock-script',
    //   data: that.state.mock_script,
    //   onChange: function(d) {
    //     that.setState({
    //       mock_script: d.text
    //     });
    //   }
    // });
  }

  // 是否开启
  onChange = v => {
    this.setState({
      is_mock_open: v
    });
  };

  handleMockJsInput = e => {
    this.setState({
      project_mock_script: e.text
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 }
      },
      wrapperCol: {
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        sm: {
          span: 16,
          offset: 11
        }
      }
    };

    return (
      <div style={{ padding: '20px 10px' }}>
        <Form>
          <FormItem
            label={
              <span>
                是否开启&nbsp;<a target="_blank" rel="noopener noreferrer" href="www.baidu.com">
                  <Tooltip title="点击查看文档">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </a>
              </span>
            }
            {...formItemLayout}
          >
            <Switch
              checked={this.state.is_mock_open}
              onChange={this.onChange}
              checkedChildren="开"
              unCheckedChildren="关"
            />
          </FormItem>
          <FormItem label="Mock脚本" {...formItemLayout}>
            <AceEditor data={this.state.project_mock_script} onChange={this.handleMockJsInput} style={{ minHeight: '500px' }} />
            
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>
              保存
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}


