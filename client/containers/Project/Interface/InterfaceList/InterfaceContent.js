import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { Tabs } from 'antd';
import Edit from './Edit.js'
import View from './View.js'

import { fetchInterfaceData } from '../../../../reducer/modules/interface.js';
import { withRouter } from 'react-router-dom';
import Run from './Run/Run.js'
const plugin = require('client/plugin.js');

const TabPane = Tabs.TabPane;
@connect(
  state => {
    return {
      curdata: state.inter.curdata,
      list: state.inter.list
    }
  },
  {
    fetchInterfaceData
  }
)
class Content extends Component {
  static propTypes = {
    match: PropTypes.object,
    list: PropTypes.array,
    curdata: PropTypes.object,
    fetchInterfaceData: PropTypes.func,
    history: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {
      curtab: 'view'
    }
  }

  componentWillMount() {
    const params = this.props.match.params;
    this.actionId = params.actionId;
    this.handleRequest(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const params = nextProps.match.params;
    if(params.actionId !== this.actionId){
      this.actionId = params.actionId;
      this.handleRequest(nextProps)
    }
  }

  handleRequest(nextProps) {
    const params = nextProps.match.params;
    this.props.fetchInterfaceData(params.actionId)
    this.setState({
      curtab: 'view'
    })
  }

  switchToView = ()=>{
    this.setState({
      curtab: 'view'
    })
  }

  onChange = (key) => {
    this.setState({
      curtab: key
    })
  }

  render() {
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
      }
    }

    plugin.emitHook('interface_tab', InterfaceTabs);

    const tabs = <Tabs onChange={this.onChange} activeKey={this.state.curtab} defaultActiveKey="view"   >
      {Object.keys(InterfaceTabs).map(key=>{
        let item = InterfaceTabs[key];
        return <TabPane tab={item.name} key={key}></TabPane>
      })}
    </Tabs>;
    let tabContent = null;
    if (this.state.curtab) {
      let C = InterfaceTabs[this.state.curtab].component;
      tabContent = <C switchToView={this.switchToView} />;
    }

    return <div className="interface-content">
      {tabs}
      {tabContent}
    </div>
  }
}

export default withRouter(Content)
