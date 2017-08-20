import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { Tabs } from 'antd';
import Edit from './Edit.js'
import View from './View.js'

import { fetchInterfaceData } from '../../../../reducer/modules/interface.js';
import { withRouter } from 'react-router-dom';
import Run from './Run/Run.js'


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

  onChange = (key) => {
    this.setState({
      curtab: key
    })
  }

  render() {
    const tabs = <Tabs onChange={this.onChange} activeKey={this.state.curtab} defaultActiveKey="view"   >
      <TabPane tab="预览" key="view">
        {/* <View /> */}
      </TabPane>
      <TabPane tab="编辑" key="edit">

      </TabPane>
      <TabPane tab="运行" key="run">
        {/* <Run /> */}
      </TabPane>
    </Tabs>;
    let tabContent;
    if (this.state.curtab === 'view') {
      tabContent = <View />;
    } else if (this.state.curtab === 'edit') {
      tabContent = <Edit />
    } else if (this.state.curtab === 'run') {
      tabContent = <Run />
    }

    return <div className="interface-content">
      {tabs}
      {tabContent}
    </div>
  }
}

export default withRouter(Content)
