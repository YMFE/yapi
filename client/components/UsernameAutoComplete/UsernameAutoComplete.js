import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';
import axios from 'axios';

/**
 * 用户名输入框自动完成组件
 *
 * @component UsernameAutoComplete
 * @examplelanguage js
 *
 * * 用户名输入框自动完成组件
 * * 用户名输入框自动完成组件
 *
 *
 */

 /**
 * 获取自动输入的用户信息
 *
 * 获取子组件state
 * @property callbackState
 * @type function
 * @description 类型提示：支持数组传值；也支持用函数格式化字符串：函数有两个参数(scale, index)；
 * 受控属性：滑块滑到某一刻度时所展示的刻度文本信息。如果不需要标签，请将该属性设置为 [] 空列表来覆盖默认转换函数。
 * @returns {object} {uid: xxx, username: xxx}
 * @examplelanguage js
 * @example
 * onUserSelect(childState) {
 *   this.setState({
 *     uid: childState.uid,
 *     username: childState.username
 *   })
 * }
 *
 */
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
