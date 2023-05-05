import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import InterfaceEditForm from './InterfaceEditForm.js'
import DocEditForm from './DocEditForm.js'
import {
  updateInterfaceData,
  fetchInterfaceListMenu,
  fetchInterfaceData,
} from '../../../../reducer/modules/interface.js'
import { getProject } from '../../../../reducer/modules/project.js'
import axios from 'axios'
import { message, Modal, Spin, Alert } from 'antd'
import './Edit.scss'
import { withRouter } from 'react-router-dom'
import ProjectTag from '../../Setting/ProjectMessage/ProjectTag.js'

@connect(
  state => {
    return {
      curdata: state.inter.curdata,
      currProject: state.project.currProject,
    }
  },
  {
    updateInterfaceData,
    fetchInterfaceListMenu,
    fetchInterfaceData,
    getProject,
  },
)
class InterfaceEdit extends Component {
  static propTypes = {
    curdata: PropTypes.object,
    currProject: PropTypes.object,
    updateInterfaceData: PropTypes.func,
    fetchInterfaceListMenu: PropTypes.func,
    fetchInterfaceData: PropTypes.func,
    match: PropTypes.object,
    switchToView: PropTypes.func,
    getProject: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { curdata, currProject } = this.props
    const location = window.location

    this.state = {
      mockUrl:
        location.protocol +
        '//' +
        location.hostname +
        (location.port !== '' ? ':' + location.port : '') +
        `/mock/${currProject._id}${currProject.basepath}${curdata.path}`,
      curdata: {},
      status: 0,
      visible: false,
      // tag: []
    }
  }

  onSubmit = async params => {
    let id = this.props.match.params.actionId
    params.id = id && parseInt(id)
    let result = await axios.post('/api/interface/up', params)
    this.props.fetchInterfaceListMenu(this.props.currProject._id).then()
    this.props.fetchInterfaceData(params.id).then()
    if (result.data.errcode === 0) {
      this.props.updateInterfaceData(params)
      this.props.switchToView()
      message.success('保存成功')
    } else {
      message.error(result.data.errmsg)
    }
  }

  componentWillUnmount() {
    try {
      if (this.state.status === 1) {
        this.WebSocket.close()
      }
    } catch (e) {
      return null
    }
  }

  componentDidMount() {
    const location = window.location
    let domain =
      location.hostname + (location.port !== '' ? ':' + location.port : '')
    let s,
      initData = false
    //因后端 node 仅支持 ws， 暂不支持 wss
    let wsProtocol = location.protocol === 'https:' ? 'wss' : 'ws'

    setTimeout(() => {
      if (initData === false) {
        this.setState({
          curdata: this.props.curdata,
          status: 1,
        })
        initData = true
      }
    }, 3000)

    try {
      s = new WebSocket(
        wsProtocol +
          '://' +
          domain +
          '/api/interface/solve_conflict?id=' +
          this.props.match.params.actionId,
      )
      s.onopen = () => {
        this.WebSocket = s
      }

      s.onmessage = e => {
        initData = true
        let result = JSON.parse(e.data)
        if (result.errno === 0) {
          this.setState({
            curdata: result.data,
            status: 1,
          })
        } else {
          this.setState({
            curdata: result.data,
            status: 2,
          })
        }
      }

      s.onerror = () => {
        this.setState({
          curdata: this.props.curdata,
          status: 1,
        })
        console.warn('websocket 连接失败，将导致多人编辑同一个接口冲突。')
      }
    } catch (e) {
      this.setState({
        curdata: this.props.curdata,
        status: 1,
      })
      console.error('websocket 连接失败，将导致多人编辑同一个接口冲突。')
    }
  }

  onTagClick = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = async () => {
    let { tag } = this.tag.state
    tag = tag.filter(val => {
      return val.name !== ''
    })

    let id = this.props.currProject._id
    let params = {
      id,
      tag,
    }
    let result = await axios.post('/api/project/up_tag', params)

    if (result.data.errcode === 0) {
      await this.props.getProject(id)
      message.success('保存成功')
    } else {
      message.error(result.data.errmsg)
    }

    this.setState({
      visible: false,
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  tagSubmit = tagRef => {
    this.tag = tagRef

    // this.setState({tag})
  }

  render() {
    const projId = this.props.match.params.id
    const interId = this.props.match.params.actionId
    const { cat, basepath, switch_notice, tag } = this.props.currProject
    return (
      <div className="interface-edit">
        {this.state.status === 1 ? (
          this.state.curdata.record_type === 0 ? (
            <InterfaceEditForm
              projectId={projId}
              interId={interId}
              cat={cat}
              mockUrl={this.state.mockUrl}
              basepath={basepath}
              noticed={switch_notice}
              onSubmit={this.onSubmit}
              curdata={this.state.curdata}
              onTagClick={this.onTagClick}
            />
          ) : (
            <DocEditForm
              cat={cat}
              onSubmit={this.onSubmit}
              curdata={this.state.curdata}
              onTagClick={this.onTagClick}
            />
          )
        ) : null}
        {this.state.status === 2 ? (
          <Alert
            message="当前无法编辑"
            description={`${this.state.curdata.username} 同学正在编辑该内容，休息一下，稍后再来`}
            type="warning"
            showIcon
          />
        ) : null}
        {this.state.status === 0 && (
          <div style={{ textAlign: 'center', marginTop: '200px' }}>
            <Spin spinning={!this.state.status} />
          </div>
        )}

        <Modal
          title="Tag 设置"
          width={680}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="保存"
        >
          <div className="tag-modal-center">
            <ProjectTag tagMsg={tag} ref={this.tagSubmit} />
          </div>
        </Modal>
      </div>
    )
  }
}

export default withRouter(InterfaceEdit)
