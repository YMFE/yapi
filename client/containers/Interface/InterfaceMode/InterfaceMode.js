import React, { Component } from 'react'
import { Modal, Input, Button } from 'antd'
import PropTypes from 'prop-types'
// import axios from 'axios'
import ModeTag from './ModeTags'

// Tags
const ModeTags = () => {
  const list = [1, 2, 3, 4]
  return (
    <article className="users">
      <p>项目成员</p>
      <div className="tags">
        {
          list.map((value, key) => {
            return <ModeTag key={key} />
          })
        }
      </div>
    </article>
  )
}

class InterfaceMode extends Component {
  static propTypes = {
    modalVisible: PropTypes.bool,
    closeProjectMember: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  componentDidMount () {
    // axios.get({
    //   url: '',
    //   params: {}
    // })
    // .then(() => {

    // })
  }

  handleOk (closeProjectMember) {
    closeProjectMember()
  }

  handleCancel (closeProjectMember) {
    closeProjectMember()
  }

  render() {
    const { modalVisible, closeProjectMember } = this.props
    const handleOk = this.handleOk.bind(this, closeProjectMember)
    const handleCancel = this.handleCancel.bind(this, closeProjectMember)

    return (
      <Modal
        title="项目成员管理"
        onOk={ handleOk }
        visible={ modalVisible }
        onCancel={ handleCancel }
        className="interface-mode-box"
      >
        <div className="add-user">
          <Input placeholder="Basic usage" size="large" />
          <Button>添加新成员</Button>          
        </div>
        
        <ModeTags />
      </Modal>
    )
  }
}

export default InterfaceMode
