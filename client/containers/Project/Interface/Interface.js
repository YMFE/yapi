import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tabs } from 'antd';
import { Route, Switch } from 'react-router-dom';

import './interface.scss'

import InterfaceMenu from './InterfaceList/InterfaceMenu.js'
import InterfaceContent from './InterfaceList/InterfaceContent.js'

import InterfaceColMenu from './InterfaceCol/InterfaceColMenu.js'
import InterfaceColContent from './InterfaceCol/InterfaceColContent.js'
import InterfaceCaseContent from './InterfaceCol/InterfaceCaseContent.js'

const InterfaceRoute = (props) => {
  let C;
  if (props.match.params.action === 'api') {
    C = InterfaceContent;
  } else if (props.match.params.action === 'col') {
    C = InterfaceColContent;
  } else if (props.match.params.action === 'case') {
    C = InterfaceCaseContent;
  }
  return <C />
}

InterfaceRoute.propTypes = {
  match: PropTypes.object
}


class Interface extends Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      curkey: this.props.match.params.action
    }
    console.log(this.props)
  }

  onChange = (action) => {
    let params = this.props.match.params;

    this.props.history.push('/project/'+params.id + '/interface/' + action)
  }

  render() {
    const { action } = this.props.match.params;
    const activeKey = action === 'api' ? 'api' : 'colOrCase';
    return <div className="web-content g-row" style={{ marginBottom: "15px" }}>
      <Row gutter={16} >
        <Col span={6}>
          <div className="left-menu">
            <Tabs type="card" activeKey={activeKey} onChange={() => this.onChange(action)}>
              <Tabs.TabPane tab="接口列表" key="api">
                <InterfaceMenu projectId={this.props.match.params.id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="接口集合" key="colOrCase" >
                <InterfaceColMenu />
              </Tabs.TabPane>
            </Tabs>
          </div>


        </Col>
        <Col span={18} >
          <div className="right-content">
            <Switch>
              <Route exact path="/project/:id/interface/:action" component={InterfaceRoute} />
              <Route exact path="/project/:id/interface/:action/:actionId" component={InterfaceRoute} />
            </Switch>
          </div>
        </Col>
      </Row>
    </div>
  }
}



export default Interface
