import './Subnav.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';

class Subnav extends Component {
  constructor(props) {
    super(props)
  }
  static propTypes = {
    data: PropTypes.array
  }
  render () {
    console.log(this.props);
    return (
      <div className="m-subnav">
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.props.data[0].name]}
          defaultSelectedKeys={[this.props.data[0].name]}
          mode="horizontal"
          className="g-row m-subnav-menu"
        >
          {this.props.data.map((item, index) => {
            return (
              <Menu.Item className="item" key={item.name}>
                {this.props.data[index].name}
              </Menu.Item>
            )
          })}
        </Menu>
      </div>
    )
  }
}

export default Subnav
