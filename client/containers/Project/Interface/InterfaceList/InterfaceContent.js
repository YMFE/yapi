import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { Tabs } from 'antd';
import Edit from './Edit.js'
import View from './View.js'
import Run from './Run.js'
import { fetchInterfaceData } from '../../../../reducer/modules/interface.js';
import { withRouter } from 'react-router-dom';

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
    fetchInterfaceData: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = {
      curtab: 'view'
    }
    this._actionId = 0;
  }

  componentWillReceiveProps(nextProps){
    this.handleRequest(nextProps)
  }

  handleRequest(nextProps){
    let matchParams = nextProps.match.params;
    let _actionId;
    _actionId = matchParams.actionId;    
    _actionId = parseInt(matchParams.actionId, 10);
    if(!nextProps.curdata)return;
    if(this._actionId !== _actionId){
      this._actionId = _actionId;
      this.props.fetchInterfaceData(_actionId)
    }
    this.setState({
      curtab: 'view'
    })
  }

  onChange = (key)=>{
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