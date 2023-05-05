import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Icon,
  Modal,
  Input,
  message,
  Row,
  Menu,
  Col,
  Popover,
  Button,
  Tooltip,
} from 'antd'
import { autobind } from 'core-decorators'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import UsernameAutoComplete from '../../../components/UsernameAutoComplete/UsernameAutoComplete.js'
import GuideBtns from '../../../components/GuideBtns/GuideBtns.js'
import {
  fetchGroupList,
  setCurrGroup,
  fetchGroupMsg,
  changeGroupFilter,
} from '../../../reducer/modules/group.js'
import _ from 'underscore'
import lodash from 'lodash'

import './GroupList.scss'
const { TextArea } = Input
const Search = Input.Search
const authList = ['owner', 'dev', 'guest']
const tip = (
  <div className="title-container">
    <h3 className="title">欢迎使用 落兵台 ~</h3>
    <p>
      这里的 <b>“我的空间”</b>
      是你自己才能看到的分组，你拥有这个分组的全部权限，可以在这个分组里探索
      落兵台 的功能。
    </p>
  </div>
)

@connect(
  state => ({
    groupList: state.group.groupList,
    currGroup: state.group.currGroup,
    curUserRole: state.user.role,
    curUserRoleInGroup: lodash.get(
      state.group,
      ['currGroup', 'role'],
      state.group.role,
    ),
    studyTip: state.user.studyTip,
    study: state.user.study,
    groupFilter: state.group.groupFilter,
  }),
  {
    fetchGroupList,
    setCurrGroup,
    fetchGroupMsg,
    changeGroupFilter,
  },
)
@withRouter
export default class GroupList extends Component {
  static propTypes = {
    groupList: PropTypes.array,
    currGroup: PropTypes.object,
    fetchGroupList: PropTypes.func,
    setCurrGroup: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
    curUserRole: PropTypes.string,
    curUserRoleInGroup: PropTypes.string,
    studyTip: PropTypes.number,
    study: PropTypes.bool,
    fetchGroupMsg: PropTypes.func,
    changeGroupFilter: PropTypes.func,
    groupFilter: PropTypes.string,
  }

  state = {
    addGroupModalVisible: false,
    newGroupName: '',
    newGroupDesc: '',
    currGroupName: '',
    currGroupDesc: '',
    groupList: [],
    owner_uids: [],
    groupType: 'mine',
  }

  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    let groupId = this.props.match.params.groupId
    groupId = !isNaN(groupId) ? parseInt(groupId, 10) : 0
    await this.props.fetchGroupList()
    let currGroup = false
    if (this.props.groupList.length && groupId) {
      for (let i = 0; i < this.props.groupList.length; i++) {
        if (this.props.groupList[i]._id === groupId) {
          currGroup = this.props.groupList[i]
          break
        }
      }
    } else if (!groupId && this.props.groupList.length) {
      this.props.history.replace(`/group/${this.props.groupList[0]._id}`)
    }
    if (!currGroup) {
      currGroup = this.props.groupList[0] || { group_name: '', group_desc: '' }
      this.props.history.replace(`${currGroup._id}`)
    }
    this.props.setCurrGroup(currGroup)
    if (currGroup.role === 'member') {
      this.props.changeGroupFilter('all')
    }
  }

  @autobind
  showModal() {
    this.setState({
      addGroupModalVisible: true,
    })
  }
  @autobind
  hideModal() {
    this.setState({
      newGroupName: '',
      group_name: '',
      owner_uids: [],
      addGroupModalVisible: false,
    })
  }
  @autobind
  async addGroup() {
    const {
      newGroupName: group_name,
      newGroupDesc: group_desc,
      owner_uids,
    } = this.state
    const res = await axios.post('/api/group/add', {
      group_name,
      group_desc,
      owner_uids,
    })
    if (!res.data.errcode) {
      this.setState({
        newGroupName: '',
        group_name: '',
        owner_uids: [],
        addGroupModalVisible: false,
      })
      await this.props.fetchGroupList()
      const id = res.data.data._id
      const currGroup = _.find(this.props.groupList, group => {
        return +group._id === +id
      })
      this.props.setCurrGroup(currGroup)
      this.props.fetchGroupMsg(this.props.currGroup._id)
    } else {
      message.error(res.data.errmsg)
    }
  }
  @autobind
  async editGroup() {
    const { currGroupName: group_name, currGroupDesc: group_desc } = this.state
    const id = this.props.currGroup._id
    const res = await axios.post('/api/group/up', {
      group_name,
      group_desc,
      id,
    })
    if (res.data.errcode) {
      message.error(res.data.errmsg)
    } else {
      await this.props.fetchGroupList()
      const currGroup = _.find(this.props.groupList, group => {
        return +group._id === +id
      })

      this.props.setCurrGroup(currGroup)
      this.props.fetchGroupMsg(this.props.currGroup._id)
    }
  }
  @autobind
  inputNewGroupName(e) {
    this.setState({ newGroupName: e.target.value })
  }
  @autobind
  inputNewGroupDesc(e) {
    this.setState({ newGroupDesc: e.target.value })
  }

  @autobind
  selectGroup(e) {
    const groupId = e.key
    const currGroup = _.find(this.props.groupList, group => {
      return +group._id === +groupId
    })
    this.props.setCurrGroup(currGroup)
    this.props.history.replace(`${currGroup._id}`)
  }

  @autobind
  onUserSelect(uids) {
    this.setState({
      owner_uids: uids,
    })
  }

  searchGroup = (e, value) => {
    if (e === null && !value) {
      return
    }
    const v = value || e.target.value
    const { groupList } = this.props
    this.setState({
      groupList: groupList.filter(
        group => group.group_name.toLowerCase().indexOf(v.toLowerCase()) !== -1,
      ),
    })
  }

  changeGroupFilter = e => {
    this.props.changeGroupFilter(e.key)
    const { currGroup, groupList } = this.props
    if (e.key === 'auth' && authList.indexOf(currGroup.role) === -1) {
      this.props.setCurrGroup(groupList[0])
    } else if (e.key === 'all' && currGroup.type === 'private') {
      this.props.setCurrGroup(groupList[1])
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.groupList !== nextProps.groupList) {
      this.setState({
        groupList: nextProps.groupList,
      })
    }
  }

  render() {
    const { currGroup, groupFilter } = this.props
    const { groupList } = this.state
    const renderGroupList = groupList.filter(item => {
      if (groupFilter === 'auth') {
        return authList.indexOf(item.role) !== -1
      } else {
        return item.type !== 'private'
      }
    })

    return (
      <div className="m-group">
        {!this.props.study ? <div className="study-mask" /> : null}
        <div className="group-bar">
          <div className="group-operate">
            <div className="search">
              <Popover
                overlayClassName="popover-index"
                content={<GuideBtns />}
                title={'在这里可以创建分组'}
                placement="bottomRight"
                arrowPointAtCenter
                visible={this.props.studyTip === 1 && !this.props.study}
              >
                <Tooltip title="创建分组">
                  <Button
                    type="primary"
                    icon="usergroup-add"
                    onClick={this.showModal}
                    className="add-group-btn"
                  ></Button>
                </Tooltip>
              </Popover>

              <Search
                placeholder="搜索分组"
                onChange={e => this.searchGroup(e)}
                onSearch={v => this.searchGroup(null, v)}
              />
            </div>
            <Menu
              mode="horizontal"
              onClick={this.changeGroupFilter}
              selectedKeys={[groupFilter]}
            >
              <Menu.Item key="auth">
                <Icon type="user" />
                我的分组
              </Menu.Item>
              <Menu.Item key="all">
                <Icon type="team" />
                全部分组
              </Menu.Item>
            </Menu>
          </div>
          <Menu
            className="group-list"
            mode="inline"
            onClick={this.selectGroup}
            selectedKeys={[`${currGroup._id}`]}
          >
            {renderGroupList.map(group => {
              if (group.type === 'private') {
                return (
                  <Menu.Item
                    key={`${group._id}`}
                    className="group-item"
                    style={{ zIndex: this.props.studyTip === 0 ? 3 : 1 }}
                  >
                    <Icon type="home" />
                    <Popover
                      overlayClassName="popover-index"
                      content={<GuideBtns />}
                      title={tip}
                      placement="right"
                      visible={this.props.studyTip === 0 && !this.props.study}
                    >
                      {group.group_name}
                    </Popover>
                  </Menu.Item>
                )
              } else {
                return (
                  <Menu.Item key={`${group._id}`} className="group-item">
                    <Icon type="folder" />
                    {group.group_name}
                  </Menu.Item>
                )
              }
            })}
          </Menu>
        </div>
        {this.state.addGroupModalVisible ? (
          <Modal
            title="创建分组"
            visible={this.state.addGroupModalVisible}
            onOk={this.addGroup}
            onCancel={this.hideModal}
            className="add-group-modal"
          >
            <Row gutter={6} className="modal-input">
              <Col span={5}>
                <div className="label">分组名：</div>
              </Col>
              <Col span={15}>
                <Input
                  placeholder="请输入分组名称"
                  onChange={this.inputNewGroupName}
                />
              </Col>
            </Row>
            <Row gutter={6} className="modal-input">
              <Col span={5}>
                <div className="label">简介：</div>
              </Col>
              <Col span={15}>
                <TextArea
                  rows={3}
                  placeholder="请输入分组描述"
                  onChange={this.inputNewGroupDesc}
                />
              </Col>
            </Row>
            <Row gutter={6} className="modal-input">
              <Col span={5}>
                <div className="label">组长：</div>
              </Col>
              <Col span={15}>
                <UsernameAutoComplete callbackState={this.onUserSelect} />
              </Col>
            </Row>
          </Modal>
        ) : (
          ''
        )}
      </div>
    )
  }
}
