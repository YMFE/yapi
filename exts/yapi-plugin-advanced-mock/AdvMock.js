import React, { Component } from 'react'
// import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { Form, Switch, Button, message, Icon, Tooltip } from 'antd';
import mockEditor from 'client/containers/Project/Interface/InterfaceList/mockEditor';
const FormItem = Form.Item;


class AdvMock extends Component {
  static propTypes = {
    form: PropTypes.object,
    match: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      enable: false,
      mock_script: ''
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let projectId = this.props.match.params.id;
    let interfaceId = this.props.match.params.actionId;
    let params = {
      project_id: projectId,
      interface_id: interfaceId,
      mock_script: this.state.mock_script,
      enable: this.state.enable
    }
    axios.post('/api/plugin/advmock/save', params).then(res => {
      if (res.data.errcode === 0) {
        message.success('保存成功');
      } else {
        message.error(res.data.errmsg);
      }
    })
  }

  componentWillMount() {
    this.getAdvMockData();
  }

  async getAdvMockData() {
    let interfaceId = this.props.match.params.actionId;
    let result = await axios.get('/api/plugin/advmock/get?interface_id=' + interfaceId);
    if (result.data.errcode === 0) {
      let mockData = result.data.data;
      this.setState({
        enable: mockData.enable,
        mock_script: mockData.mock_script
      })
    }

    let that = this;
    mockEditor({
      container: 'mock-script',
      data: that.state.mock_script,
      onChange: function (d) {
        that.setState({
          mock_script: d.text
        })
      }
    })
  }

  onChange = (v) => {
    this.setState({
      enable: v
    })
  }

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
    return <div style={{ padding: '20px 10px' }}>
      
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label={<span>是否开启&nbsp;<a target="_blank" rel="noopener noreferrer"   href="https://yapi.ymfe.org/mock.html#高级Mock" ><Tooltip title="点击查看文档"><Icon type="question-circle-o" /></Tooltip></a></span>}
          {...formItemLayout}
        >
          <Switch checked={this.state.enable} onChange={this.onChange} checkedChildren="开" unCheckedChildren="关" />
        </FormItem>

        <FormItem
          label="Mock脚本"
          {...formItemLayout}
        >
          <div id="mock-script" style={{ minHeight: '500px' }} ></div>
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">保存</Button>
        </FormItem>

      </Form>
    </div>
  }
}

module.exports = Form.create()(withRouter(AdvMock));