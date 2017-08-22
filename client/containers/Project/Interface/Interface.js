import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tabs } from 'antd';
import { Route, Switch, matchPath } from 'react-router-dom';
import { connect } from 'react-redux';

import './interface.scss'

import InterfaceMenu from './InterfaceList/InterfaceMenu.js'
import InterfaceList from './InterfaceList/InterfaceList.js'
import InterfaceContent from './InterfaceList/InterfaceContent.js'

import InterfaceColMenu from './InterfaceCol/InterfaceColMenu.js'
import InterfaceColContent from './InterfaceCol/InterfaceColContent.js'
import InterfaceCaseContent from './InterfaceCol/InterfaceCaseContent.js'

const contentRouter = {
  path: '/project/:id/interface/:action/:actionId',
  exact: true
}

const InterfaceRoute = (props) => {
  let C;
  if (props.match.params.action === 'api') {
    if (!props.match.params.actionId) {
      C = InterfaceList
    } else if (!isNaN(props.match.params.actionId)) {
      C = InterfaceContent;
    } else if (props.match.params.actionId.indexOf('cat_') === 0) {
      C = InterfaceList
    }
  } else if (props.match.params.action === 'col') {
    C = InterfaceColContent;
  } else if (props.match.params.action === 'case') {
    C = InterfaceCaseContent;
  }
  return <C {...props} />
}

InterfaceRoute.propTypes = {
  match: PropTypes.object
}

@connect(
  state => {
    return {
      isShowCol: state.interfaceCol.isShowCol
    }
  }
)
class Interface extends Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    isShowCol: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      curkey: this.props.match.params.action
    }
  }

  onChange = (action) => {
    let params = this.props.match.params;
    if(action === 'colOrCase') {
      action = this.props.isShowCol ? 'col' : 'case';
    }
    this.props.history.push('/project/' + params.id + '/interface/' + action)
  }

  render() {
    const { action } = this.props.match.params;
    const activeKey = action === 'api' ? 'api' : 'colOrCase';
    return <div className="web-content g-row" style={{ marginBottom: "15px" }}>
      <Row gutter={16} >
        <Col span={6}>
          <div className="left-menu">
            <Tabs type="card" activeKey={activeKey} onChange={this.onChange}>
              <Tabs.TabPane tab="接口列表" key="api">
                <InterfaceMenu router={matchPath(this.props.location.pathname, contentRouter)} projectId={this.props.match.params.id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="测试集合" key="colOrCase" >
                <InterfaceColMenu />
              </Tabs.TabPane>
            </Tabs>
          </div>


        </Col>
        <Col span={18} >
          <div className="right-content">
            <Switch>
              <Route exact path="/project/:id/interface/:action" component={InterfaceRoute} />
              <Route {...contentRouter} component={InterfaceRoute} />
            </Switch>
          </div>
        </Col>
      </Row>
    </div>
  }
}



export default Interface
