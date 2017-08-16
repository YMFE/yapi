import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tabs } from 'antd';
import { Route } from 'react-router-dom';

import './interface.scss'

import InterfaceMenu from './InterfaceList/InterfaceMenu.js'
import InterfaceContent from './InterfaceList/InterfaceContent.js'

import InterfaceColMenu from './InterfaceCol/InterfaceColMenu.js'
import InterfaceColContent from './InterfaceCol/InterfaceColContent.js'

class InterfaceRoute extends Component {
  static propTypes = {
    match: PropTypes.object
  }
  constructor(props){
    super(props)
  }
  render() {
    let C, props = this.props;
    if (props.match.params.action === 'api') {
      C = InterfaceContent;
    } else if (props.match.params.action === 'col') {
      C = InterfaceColContent;
    }
    return <C />
  }
}


class Interface extends Component {
  static propTypes = {
    match: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      curkey: this.props.match.params.action
    }
  }

  onChange = (key)=>{
    this.setState({
      curkey: key
    })
  }

  render() {
    return <div className="web-content g-row" style={{ marginBottom: "15px" }}>
      <Row gutter={16} >
        <Col span={6}>
          <div className="left-menu">
            <Tabs type="card" activeKey={this.state.curkey} onChange={this.onChange}>
              <Tabs.TabPane tab="接口列表" key="api">
                <InterfaceMenu projectId={this.props.match.params.id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="接口集合" key="col" >
                <InterfaceColMenu />
              </Tabs.TabPane>
            </Tabs>
          </div>


        </Col>
        <Col span={18} >
          <div className="right-content">
            <Route path="/project/:id/interface/:action/:actionId" component={InterfaceRoute} />
          </div>
        </Col>
      </Row>
    </div>
  }
}



export default Interface