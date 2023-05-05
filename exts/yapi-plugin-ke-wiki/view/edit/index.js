import React, { Component } from 'react'
import { message, Button, Input, Modal, Upload, Icon, Alert } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import $ from 'jquery'
import _ from 'lodash'
import Editor from 'client/components/Editor/Editor'
import './index.scss'
@connect(state => {
  return {
    projectMsg: state.project.currProject,
  }
}, {})
@withRouter
class WikiPage extends Component {
  static propTypes = {
    match: PropTypes.object,
    projectMsg: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      notice: this.props.projectMsg.switch_notice,
      desc: '',
      markdown: '',
      //保存状态 0：已保存，1：保存中，2：自动保存失败，请手动保存,
      saveStat: 0,
      editWikiId: props.match.params.wiki_id,
      isCreate: props.match.params.action === 'create' ? true : false,
      editable: props.match.params.action === 'create' ? true : false,
      editingInfo: {},
    }
    this.editorRef = React.createRef()
  }

  componentDidMount() {
    this.editor = this.editorRef.current.getInstance()
    document.addEventListener('keydown', this.onCommandShort)

    this.initSocket()
    if (!this.state.isCreate) {
      this.getWikiDetail()
    }
  }

  onEditorChange = _.debounce(() => {
    if (!this.state.isCreate) {
      this.setState(
        {
          saveStat: 1,
        },
        () => {
          this.onDocUpdate({ isAuto: true })
        },
      )
    }
  }, 30000)

  initSocket = () => {
    let { editWikiId } = this.state
    let s
    const location = window.location
    let domain =
      location.hostname + (location.port !== '' ? ':' + location.port : '')

    let wsProtocol = location.protocol === 'https:' ? 'wss' : 'ws'
    try {
      s = new WebSocket(
        `${wsProtocol}://${domain}/api/ws_plugin/wiki/solve_conflict?id=${editWikiId}`,
      )
      s.onopen = () => {
        this.WebSocket = s
      }

      s.onmessage = res => {
        let result = JSON.parse(res.data)
        if (result.errno === 0) {
          this.setState({
            editable: true,
            editingInfo: result.data,
          })
        } else {
          this.setState({
            editable: false,
            editingInfo: result.data,
          })
        }
      }

      s.onerror = () => {
        this.setState({
          curdata: this.props.curdata,
          editable: false,
          editingInfo: {
            error: 'websocket 连接失败，将导致多人编辑同一个接口冲突',
          },
        })
        console.warn('websocket 连接失败，将导致多人编辑同一个接口冲突。')
      }
    } catch (e) {
      this.setState({
        curdata: this.props.curdata,
        editable: false,
        editingInfo: {
          error: 'websocket 连接失败，将导致多人编辑同一个接口冲突',
        },
      })
      console.error('websocket 连接失败，将导致多人编辑同一个接口冲突。')
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onCommandShort)
    try {
      if (this.state.editable && !this.state.isCreate) {
        this.WebSocket.close()
      }
    } catch (e) {
      return null
    }

    document.title = `落兵台 · 接口文档管理平台`
  }

  componentDidUpdate(prevProps, prevState) {
    document.title = this.state.title
      ? `编辑文档 · ${this.state.title}`
      : '编辑文档'
  }

  handleTitleInputChange = content => {
    this.setState({
      ...this.state,
      title: content,
    })
  }

  onCommandShort = e => {
    const isMac = window.navigator.platform.match('Mac') ? true : false
    const { isCreate } = this.state
    if ((isMac ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
      e.preventDefault()
      if (!isCreate) {
        this.manualSave()
      }
    }
  }

  manualSave = _.debounce(() => {
    this.setState(
      {
        saveStat: 1,
      },
      () => {
        this.onDocUpdate({ isAuto: true })
      },
    )
  }, 500)

  //  获取页面数据
  getWikiDetail = async () => {
    let res = await axios.get('/api/plugin/wiki_action/get_detail', {
      params: { id: this.props.match.params.wiki_id },
    })
    if (res.data && res.data.data) {
      let dataDetail = res.data.data
      this.setState({
        title: dataDetail.title,
        desc: dataDetail.desc,
        markdown: dataDetail.markdown,
        id: dataDetail._id,
      })

      this.editor.setMarkdown(dataDetail.markdown)
    }
  }

  redirectTo = {
    page: (title = '') => {
      this.props.history.push(this.pathTo.page(title))
    },
  }

  pathTo = {
    page: (title = '') => {
      return `/project/${this.props.match.params.id}/wiki/page/${title}`
    },
  }

  onDocAdd = async () => {
    let desc = this.editor.getHtml()
    let markdown = this.editor.getMarkdown()
    let title = this.state.title
    const currProjectId = this.props.match.params.id
    const id = this.props.match.params.wiki_id
    if (!title) {
      message.error(`请输入文档标题`)
      return
    }

    let addOption = {
      project_id: currProjectId,
      title,
      desc,
      markdown,
      email_notice: false,
      parent_id: id,
    }
    let result = await axios.post('/api/plugin/wiki_action/add', addOption)

    if (result.data.errcode === 0) {
      this.redirectTo.page(result.data.data._id)
    } else {
      message.error(`失败： ${result.data.errmsg}`)
    }
  }

  onDocUpdate = async ({ isAuto }) => {
    let desc = this.editor.getHtml()
    let markdown = this.editor.getMarkdown()
    let title = this.state.title
    const currProjectId = this.props.match.params.id
    const id = this.props.match.params.wiki_id
    if (!title) {
      message.error(`保存失败，请输入文档标题`)
      this.setState({
        saveStat: 2,
      })
      return
    }
    if (isAuto && this.state.markdown === markdown) {
      this.setState({
        saveStat: 0,
      })
      return
    }
    let editotOption = {
      project_id: currProjectId,
      query_title: this.props.match.params.title,
      title,
      desc,
      markdown,
      email_notice: false,
      id: id,
    }

    let result = await axios.post(
      '/api/plugin/wiki_action/update',
      editotOption,
    )

    if (result.data.errcode === 0) {
      isAuto
        ? this.setState({
            saveStat: 0,
          })
        : this.redirectTo.page(id)
    } else {
      isAuto &&
        this.setState({
          saveStat: 2,
        })
      message.error(`失败： ${result.data.errmsg}`)
    }
  }

  // 取消编辑
  onCancel = () => {
    const id = this.props.match.params.wiki_id
    this.redirectTo.page(id)
  }

  // 邮件通知
  onEmailNotice = e => {
    this.setState({
      ...this.state,
      notice: e.target.checked,
    })
  }

  render() {
    const { saveStat, title, editable, editingInfo, isCreate } = this.state
    const isEditable =
      this.props.projectMsg.role === 'admin' ||
      this.props.projectMsg.role === 'owner' ||
      this.props.projectMsg.role === 'dev'

    return (
      <div className="ke-wiki-edit">
        {!editable && (
          <Alert
            message="当前无法编辑"
            description={
              editingInfo.username
                ? `${editingInfo.username} 同学正在编辑该内容，休息一下，稍后再来`
                : editingInfo.error
            }
            type="warning"
            showIcon
          />
        )}

        <div className="header">
          <div className="title">
            <Input
              placeholder="文档标题"
              value={title}
              onChange={event => {
                this.handleTitleInputChange(event.target.value)
              }}
            />
          </div>
          {!isCreate && (
            <div className="editor-status">
              {saveStat === 0
                ? `${new Date().toLocaleTimeString('en-GB')} 内容已保存云端`
                : saveStat === 1
                ? '保存中……'
                : '保存失败，请手动保存'}
            </div>
          )}
          <div className="action-btn-group">
            {isCreate && <Button onClick={this.onCancel}>取消</Button>}
            <Button
              type="primary"
              disabled={isEditable === false || !editable}
              onClick={isCreate ? this.onDocAdd : this.onDocUpdate}
            >
              {isEditable === false ? '无权限' : isCreate ? '创建' : '完成'}
            </Button>
          </div>
        </div>

        <div
          id="desc"
          className="wiki-editor"
          style={{
            height: '100%',
          }}
        >
          <Editor
            height="100%"
            initialValue={this.state.markdown}
            ref={this.editorRef}
            events={{
              change: val => {
                this.onEditorChange()
              },
            }}
          />
        </div>
      </div>
    )
  }
}

export default WikiPage
