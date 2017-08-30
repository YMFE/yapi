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
      username: '',
      changeName: ''
    }
  }

  static propTypes = {
    callbackState: PropTypes.func
  }

  changeState = (uid, username) => {
    // 设置本组件 state
    this.setState({ uid, username });
    // 回调 将当前选中的uid和username回调给父组件
    this.props.callbackState({ uid, username });
  }

  onChange = (userName) => {
    this.setState({
      changeName: userName
    });
  }

  onSelect = (userName) => {
    this.state.dataSource.forEach((item) => {
      if (item.username === userName) {
        this.changeState(item.id, item.username);
      }
    });
  }

  handleSearch = (value) => {
    const params = { q: value}
    axios.get('/api/user/search', { params })
      .then(data => {
        const userList = [];
        data = data.data.data;

        if (data) {
          data.forEach( v => userList.push({
            username: v.username,
            id: v.uid
          }));
          // 取回搜索值后，设置 dataSource
          this.setState({
            dataSource: userList
          });
          if (userList.length) {
            userList.forEach((item) => {
              if (item.username === this.state.changeName) {
                // 每次取回搜索值后，没选择时默认选择第一位
                this.changeState(userList[0].id, userList[0].username);
              } else {
                // 有候选词但没有对应输入框中的字符串，此时应清空候选 uid 和 username
                this.changeState(-1, '');
              }
            });
          } else {
            // 如果没有搜索结果，则清空候选 uid 和 username
            this.changeState(-1, '');
          }
        }
      });
  }

  render () {
    return (
      <AutoComplete
        dataSource={this.state.dataSource.map(i => i.username)}
        style={{ width: '100%' }}
        onChange={this.onChange}
        onSelect={this.onSelect}
        onSearch={this.handleSearch}
        placeholder="请输入用户名"
        size="large"
      />
    )
  }
}

export default UsernameAutoComplete;
