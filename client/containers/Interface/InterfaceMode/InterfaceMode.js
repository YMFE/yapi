import React, { Component } from 'react'
import { Modal, Input, Button } from 'antd'
import PropTypes from 'prop-types'
import axios from 'axios'
import { autobind } from 'core-decorators'
import ModeTag from './ModeTags'

class InterfaceMode extends Component {
  static propTypes = {
    modalVisible: PropTypes.bool,
    closeProjectMember: PropTypes.func,
    memberList: PropTypes.array
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
        console.log(data)
        this.setState({
          'memberList': data.data.data
        })
      })
      .catch(err => {
        console.log(err)
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
  injectValue (e) {
    this.setState({
      userName: e.target.value
    })
  }

  handleOk (closeProjectMember) {
    closeProjectMember()
  }

  handleCancel (closeProjectMember) {
    closeProjectMember()
  }

  getInterfaceId () {
    const reg = /Interface\/(\d+)/g
    const url = location.href
    url.match(reg)
    return RegExp.$1
  }

  render() {
    const { modalVisible, closeProjectMember } = this.props
    const handleOk = this.handleOk.bind(this, closeProjectMember)
    const handleCancel = this.handleCancel.bind(this, closeProjectMember)
    const { memberList } = this.state

    return (
      <Modal
        title="项目成员管理"
        onOk={ handleOk }
        visible={ modalVisible }
        onCancel={ handleCancel }
        className="interface-mode-box"
      >
        <div className="add-user">
          <Input placeholder="Basic usage" size="large" onBlur={this.injectValue} />
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
