import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tabs } from 'antd';
import './interface.scss'

import InterfaceMenu from './InterfaceList/InterfaceMenu.js'
import InterfaceContent from './InterfaceList/InterfaceContent.js'

import InterfaceColMenu from './InterfaceCol/InterfaceColMenu.js'
import InterfaceColContent from './InterfaceCol/InterfaceColContent.js'

class Interface extends Component {
  static propTypes = {
    match: PropTypes.object
  }

  constructor(props) {
    super(props)    
    this.state = {
      contentView: 'list'
    }
  }

  handleTab = (key) => {
    this.setState({
      contentView: key
    })
  }

  render() {
    const {contentView} = this.state;
    let content;
    content = contentView === 'list' ? 
      <InterfaceContent />
      :
      <InterfaceColContent />
    return <div className="web-content g-row" style={{ marginBottom: "15px" }}>
      <Row gutter={16} >
        <Col span={6}>
          <div className="left-menu">
            <Tabs defaultActiveKey="list" type="card" onChange={this.handleTab}>
              <Tabs.TabPane tab="接口列表" key="list">
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
            {content}
          </div>
        </Col>
      </Row>
    </div>
  }
}

export default Interface