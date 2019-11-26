import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Modal, Button } from 'antd';
import Edit from './Edit.js';
import View from './View.js';
import { Prompt } from 'react-router';
import { fetchInterfaceData } from '../../../../reducer/modules/interface.js';
import { withRouter } from 'react-router-dom';
import Run from './Run/Run.js';
import {getToken} from "client/reducer/modules/project";
import axios from "axios";
import Activity from "./Activity";
const plugin = require('client/plugin.js');

const TabPane = Tabs.TabPane;
@connect(
  state => {
    return {
      curdata: state.inter.curdata,
      list: state.inter.list,
      editStatus: state.inter.editStatus
    };
  },
  {
    fetchInterfaceData,
    getToken
  }
)
class Content extends Component {
  static propTypes = {
    match: PropTypes.object,
    list: PropTypes.array,
    curdata: PropTypes.object,
    fetchInterfaceData: PropTypes.func,
    getToken: PropTypes.func,
    history: PropTypes.object,
    editStatus: PropTypes.bool
  };
  constructor(props) {
    super(props);
    this.title = 'YApi-高效、易用、功能强大的可视化接口管理平台';
    this.state = {
      curtab: 'view',
      visible: false,
      nextTab: ''
    };
    this.cancelSourceSet = new Set();
  }

  componentWillMount() {
    const params = this.props.match.params;
    this.actionId = params.actionId;
    this.handleRequest(this.props);
  }

  componentWillUnmount() {
    this.cancelRequestBefore();
    document.getElementsByTagName('title')[0].innerText = this.title;
  }

  componentWillReceiveProps(nextProps) {
    const params = nextProps.match.params;
    if (params.actionId !== this.actionId) {
      this.actionId = params.actionId;
      this.handleRequest(nextProps);
    }
  }

  /**
   * 取消上一次的请求
   */
  cancelRequestBefore = () => {
    this.cancelSourceSet.forEach(v => {
      v.cancel();
    });
    this.cancelSourceSet.clear();
  }

  handleRequest(nextProps) {
    const params = nextProps.match.params;
    this.cancelRequestBefore();
    let cancelSource = axios.CancelToken.source();
    this.cancelSourceSet.add(cancelSource);
    Promise.all([
      this.props.fetchInterfaceData(params.actionId, {
        cancelToken: cancelSource.token
      }),
      this.props.getToken(params.id, {
        cancelToken: cancelSource.token
      })
    ]).then(() => {
      this.cancelSourceSet.delete(cancelSource);
    });

    this.setState({
      curtab: 'view'
    });
  }

  switchToView = () => {
    this.setState({
      curtab: 'view'
    });
  };

  onChange = key => {
    if (this.state.curtab === 'edit' && this.props.editStatus) {
      this.showModal();
    } else {
      this.setState({
        curtab: key
      });
    }
    this.setState({
      nextTab: key
    });
  };
  // 确定离开页面
  handleOk = () => {
    this.setState({
      visible: false,
      curtab: this.state.nextTab
    });
  };
  // 离开编辑页面的提示
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  // 取消离开编辑页面
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  render() {
    if (this.props.curdata.title) {
      document.getElementsByTagName('title')[0].innerText =
        this.props.curdata.title + '-' + this.title;
    }

    let InterfaceTabs = {
      view: {
        component: View,
        name: '预览'
      },
      edit: {
        component: Edit,
        name: '编辑'
      },
      run: {
        component: Run,
        name: '运行'
      },
      activity: {
        component: Activity,
        name: '动态'
      }
    };

    plugin.emitHook('interface_tab', InterfaceTabs);

    const tabs = (
      <Tabs
        className="tabs-large"
        onChange={this.onChange}
        activeKey={this.state.curtab}
        defaultActiveKey="view"
      >
        {Object.keys(InterfaceTabs).map(key => {
          let item = InterfaceTabs[key];
          return <TabPane tab={item.name} key={key} />;
        })}
      </Tabs>
    );
    let tabContent = null;
    if (this.state.curtab) {
      let C = InterfaceTabs[this.state.curtab].component;
      tabContent = <C switchToView={this.switchToView} />;
    }

    return (
      <div className="interface-content">
        <Prompt
          when={this.state.curtab === 'edit' && this.props.editStatus ? true : false}
          message={() => {
            // this.showModal();
            return '离开页面会丢失当前编辑的内容，确定要离开吗？';
          }}
        />
        {tabs}
        {tabContent}
        {this.state.visible && (
          <Modal
            title="你即将离开编辑页面"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                取 消
              </Button>,
              <Button key="submit" onClick={this.handleOk}>
                确 定
              </Button>
            ]}
          >
            <p>离开页面会丢失当前编辑的内容，确定要离开吗？</p>
          </Modal>
        )}
      </div>
    );
  }
}

export default withRouter(Content);
