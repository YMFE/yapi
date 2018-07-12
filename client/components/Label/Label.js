import React, { Component } from 'react';
import { Icon, Input, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import './Label.scss';

export default class Label extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputShow: false,
      inputValue: ''
    };
  }
  static propTypes = {
    onChange: PropTypes.func,
    desc: PropTypes.string,
    cat_name: PropTypes.string
  };
  toggle = () => {
    this.setState({ inputShow: !this.state.inputShow });
  };
  handleChange = (event) => {
    this.setState({inputValue: event.target.value})
  }
  render() {
    return (
      this.props.desc && (
        <div className="label">
          {!this.state.inputShow && (
            <div>
              <p>
                {this.props.desc} &nbsp;&nbsp;
                <Tooltip title="编辑简介">
                  <Icon onClick={this.toggle} className="interface-delete-icon" type="edit" />
                </Tooltip>
              </p>
            </div>
          )}
          {this.state.inputShow && (
            <div className="input_wrapper">
              <Input
                onChange={this.handleChange}
                defaultValue={this.props.desc}
                size="small"
              />
              <Icon
                className="interface-delete-icon"
                onClick={() => {
                  this.props.onChange(this.state.inputValue, this.props.cat_name);
                  this.toggle();
                }}
                type="check"
              />
              <Icon
                className="interface-delete-icon"
                onClick={this.toggle}
                type="close"
              />
            </div>
          )}
        </div>
      )
    );
  }
}
