import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { fetchInterfaceList } from  '../../../../reducer/modules/interface.js';
import { Menu, Button, Input, Icon, Tag } from 'antd';

@connect(
  state => {
    return {
      list: state.inter.list,
      curProject: state.project.curProject
    }
  },
  {
    fetchInterfaceList
  }
)
class InterfaceMenu extends Component {
  static propTypes = {
    projectId: PropTypes.string,
    list: PropTypes.array,
    fetchInterfaceList: PropTypes.func,
    curProject: PropTypes.object
  } 

  constructor(props) {
    super(props)
  }

  componentWillMount(){
    this.props.fetchInterfaceList(this.props.projectId)
  }

  render() {
    const items = [];
    this.props.list.forEach((item, index)=> {
      items.push(
        <Menu.Item key={index}><Button className="btn-http" type="primary">{item.method}  </Button>{item.title}</Menu.Item>
      )
    } )
    return <div>
      <div className="interface-filter">
        <Input placeholder="Filter by name" style={{ width: "70%" }} />
        <Tag color="#108ee9" style={{ marginLeft: "15px" }} ><Icon type="plus" /></Tag>
      </div>
      <Menu className="interface-list">
        {items}
      </Menu>
    </div>

  }
} 

export default InterfaceMenu