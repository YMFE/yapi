import React, { Component } from 'react'
import { Modal, Button, AutoComplete } from 'antd'
import PropTypes from 'prop-types'
import axios from 'axios'
import { autobind } from 'core-decorators'
import ModeTag from './ModeTags'

class InterfaceMode extends Component {
  static propTypes = {
    modalVisible: PropTypes.bool,
    closeProjectMember: PropTypes.func,
    memberList: PropTypes.array,
    dataSource: PropTypes.array,
    inputValue: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      memberList: [],
      userName: ''
    }
  }

  componentDidMount () {
    this.getMemberList()
  }

  @autobind
  getMemberList () {
    const params = {
      id: this.getInterfaceId()
    }
    axios.get('/project/get_member_list', { params })
      .then(data => {
        this.setState({
          'memberList': data.data.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  @autobind
  onSelect (userName) {
    console.log(userName)
    this.setState({
      userName
    })
  }

  @autobind
  closeMember (id) {
    const params = {
      member_uid: id,
      id: this.getInterfaceId()
    }

    axios.post('/project/del_member', params)
      .then(() => {
        this.getMemberList()
      })
      .catch(err => {
        console.log(err)
      })
  }

  @autobind
  addNewUser () {
    const { userName } = this.state
    const params = { q: userName}
    axios.get('/user/search', { params })
      .then(data => {
        const member_uid = data.data.data[0].uid
        const params = {id: this.getInterfaceId(), member_uid}
        axios.post('/project/add_member', params)
          .then( () => {
            this.getMemberList()
          })
          .catch (err => {
            console.log(err)
          })
      })
      .catch (err => {
        console.log(err)
      })
  }

  @autobind
  handleSearch (value) {
    this.setState({
      userName: value
    })
    const params = { q: value}

    axios.get('/user/search', { params })
      .then(data => {
        const userList = []
        data = data.data.data
        if (data) {
          data.forEach( v => userList.push(v.username) )
          this.setState({
            dataSource: userList
          })
        }
      })
      .catch (err => {
        console.log(err)
      })
  }

  handleOk (closeProjectMember) {
    closeProjectMember()
  }

  handleCancel (closeProjectMember) {
    closeProjectMember()
  }

  getInterfaceId () {
    const reg = /project\/(\d+)/g
    const url = location.href
    url.match(reg)
    return RegExp.$1
  }

  render() {
    const { modalVisible, closeProjectMember } = this.props
    const handleOk = this.handleOk.bind(this, closeProjectMember)
    const handleCancel = this.handleCancel.bind(this, closeProjectMember)
    const { memberList, dataSource } = this.state

    return (
      <Modal
        title="项目成员管理"
        onOk={ handleOk }
        visible={ modalVisible }
        onCancel={ handleCancel }
        className="interface-mode-box"
      >
        <div className="add-user">
          <AutoComplete
            dataSource={dataSource}
            style={{ width: 350 }}
            onSelect={this.onSelect}
            onSearch={this.handleSearch}
            placeholder="input here"
          />
          <Button onClick={this.addNewUser}>添 加</Button>
        </div>
        <article className="users">
          <p>项目成员</p>
          <div className="tags">
            {
              memberList.map((value, key) => {
                return <ModeTag key={key} value={value} closeMember={this.closeMember} getMemberList={this.getMemberList} />
              })
            }
          </div>
        </article>
      </Modal>
    )
  }
}

export default InterfaceMode
