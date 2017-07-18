import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Icon, Modal, Input, message, Menu } from 'antd'
import { autobind } from 'core-decorators';
import axios from 'axios';

const Search = Input.Search;

import {
  fetchGroupList,
  setCurrGroup,
  addGroup
} from '../../../actions/group.js'

import './GroupList.scss'

@connect(
  state => ({
    groupList: state.group.groupList,
    currGroup: state.group.currGroup
  }),
  {
    fetchGroupList,
    setCurrGroup,
    addGroup
  }
)
export default class GroupList extends Component {

  static propTypes = {
    groupList: PropTypes.array,
    currGroup: PropTypes.object,
    fetchGroupList: PropTypes.func,
    setCurrGroup: PropTypes.func
  }

  state = {
    addGroupModalVisible: false,
    newGroupName: '',
    newGroupDesc: ''
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchGroupList().then(() => {
      const currGroup = this.props.groupList[0] || { group_name: '', group_desc: '' };
      this.props.setCurrGroup(currGroup)
    });
  }

  @autobind
  showModal() {
    this.setState({
      addGroupModalVisible: true
    });
  }
  @autobind
  addGroup() {
    const { newGroupName: group_name, newGroupDesc: group_desc } = this.state;
    axios.post('/group/add', { group_name, group_desc }).then(res => {
      if (res.data.errcode) {
        message.error(res.data.errmsg);
      } else {
        this.setState({
          addGroupModalVisible: false
        });
        this.props.fetchGroupList()
      }
    });
  }
  @autobind
  handleCancel(e) {
    console.log(e);
    this.setState({
      addGroupModalVisible: false
    });
  }
  @autobind
  inputNewGroupName(e) {
    this.setState({newGroupName: e.target.value});
  }
  @autobind
  inputNewGroupDesc(e) {
    this.setState({newGroupDesc: e.target.value});
  }

  render () {
    const { groupList, currGroup } = this.props;

    return (
      <div>
        <div className="group-bar">
          <div className="curr-group">
            <div className="curr-group-name">{currGroup.group_name}<Icon className="edit-group" type="edit"/></div>
            <div className="curr-group-desc">简介：{currGroup.group_desc}</div>
          </div>
          <div className="group-operate">
            <div className="search">
              <Search
                placeholder="input search text"
                onSearch={value => console.log(value)}
              />
            </div>
            <Button type="primary" onClick={this.showModal}>添加分组</Button>
          </div>
          <Menu className="group-list" mode="inline">
            {
              groupList.map((group, index) => (
                <Menu.Item key={index} className="group-item">
                  <Icon type="folder-open" />{group.group_name}
                </Menu.Item>
              ))
            }
          </Menu>
        </div>
        <Modal
          title="添加分组"
          visible={this.state.addGroupModalVisible}
          onOk={this.addGroup}
          onCancel={this.handleCancel}
        >
          <div className="modal-input">
            分组名：<Input placeholder="请输入分组名称" onChange={this.inputNewGroupName} style={{display: 'inline-block'}}></Input>
          </div>
          <div className="modal-input">
            简介：<Input placeholder="请输入分组描述" onChange={this.inputNewGroupDesc} style={{display: 'inline-block'}}></Input>
          </div>
        </Modal>
      </div>
    )
  }
}
