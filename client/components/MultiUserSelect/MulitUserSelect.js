import React, {Component} from 'react';
import axios from 'axios';
import _ from 'underscore';
import { Select } from 'antd';
import PropTypes from "prop-types";

const Option = Select.Option;

class MultiUserSelect extends Component {
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    value: PropTypes.array,
    onChange: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      users: []
    }
  }

  async componentDidMount() {
    const { value }  = this.props;
    console.log("componentDidMount", value);
    if (value && Array.isArray(value)) {
      const users = await Promise.all(value.map(id => axios.get('/api/user/find', { params: {id}}).then(res => res.data.data)));
      this.setState({
        users,
        value
      })
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { value: nextValue } = nextProps;
    const { value } = this.props;
    if(!_.isEqual(value, nextValue)) {
      this.setState({
        value: nextValue
      });
    }
  }

  handleChange = (v) => {
    this.setState({
      value: v
    });
    const { onChange } = this.props;
    onChange && onChange(v);
  };

  handleSearch = async (v) => {
    const params = { q: v };
    const res = await axios.get('/api/user/search', { params });
    const users = res.data.data || [];
    this.setState({
      users
    })
  };

  filterOption = (inputValue, option) => {
    return option.props.children && option.props.children.indexOf(inputValue) !== -1;
  };


  render() {
    const { style, className } = this.props;
    const { value } = this.state;
    return (
      <Select
        mode="multiple"
        style={style}
        className={className}
        value={value}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
        filterOption={this.filterOption}
      >
        {this.state.users.map(user => <Option key={user.uid} value={user.uid}>{user.username}</Option>)}
      </Select>
    );
  }
}

export default MultiUserSelect;
