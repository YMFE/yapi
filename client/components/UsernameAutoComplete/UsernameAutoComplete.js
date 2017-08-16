import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';
import axios from 'axios'

class UsernameAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      uid: 0,
      username: ''
    }
  }

  static propTypes = {
    callbackState: PropTypes.func
  }

  onSelect = (userName) => {
    this.state.dataSource.forEach((item) => {
      if (item.username === userName) {
        // 设置本组件 state
        this.setState({
          uid: item.id,
          username: item.username
        });
        // 回调 将当前选中的uid和username回调给父组件
        this.props.callbackState({
          uid: item.id,
          username: item.username
        })
      }
    });
  }

  handleSearch = (value) => {
    const params = { q: value}
    axios.get('/api/user/search', { params })
      .then(data => {
        const userList = []
        data = data.data.data
        if (data) {
          data.forEach( v => userList.push({
            username: v.username,
            id: v.uid
          }));
          this.setState({
            dataSource: userList
          })
        }
      })
  }

  render () {
    return (
      <AutoComplete
        dataSource={this.state.dataSource.map(i => i.username)}
        style={{ width: '100%' }}
        onSelect={this.onSelect}
        onSearch={this.handleSearch}
        placeholder="请输入用户名"
        size="large"
      />
    )
  }
}

export default UsernameAutoComplete;
