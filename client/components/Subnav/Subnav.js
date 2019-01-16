import './Subnav.scss';
import React, { PureComponent as Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Menu } from 'antd';

class Subnav extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data: PropTypes.array,
    default: PropTypes.string
  };

  render() {
    return (
      <div className="m-subnav">
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.props.default]}
          mode="horizontal"
          className="g-row m-subnav-menu"
        >
          {this.props.data.map((item, index) => {
            // 若导航标题为两个字，则自动在中间加个空格
            if (item.name.length === 2) {
              item.name = item.name[0] + ' ' + item.name[1];
            }
            return (
              <Menu.Item className="item" key={item.name.replace(' ', '')}>
                <Link to={item.path}>{this.props.data[index].name}</Link>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
    );
  }
}

export default Subnav;
