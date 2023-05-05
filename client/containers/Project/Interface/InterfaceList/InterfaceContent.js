import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs, Modal, Button } from 'antd'
import Edit from './Edit.js'
import View from './View.js'
import Script from './Script.js'
import { Prompt } from 'react-router'
import { fetchInterfaceData } from '../../../../reducer/modules/interface.js'
import { withRouter } from 'react-router-dom'
import Run from './Run/Run.js'
import qs from 'qs'
const plugin = require('client/plugin.js')

const TabPane = Tabs.TabPane
@connect(
  state => {
    return {
      curdata: state.inter.curdata,
      list: state.inter.list,
      editStatus: state.inter.editStatus,
    }
  },
  {
    fetchInterfaceData,
  },
)
class Content extends Component {
  static propTypes = {
    match: PropTypes.object,
    list: PropTypes.array,
    curdata: PropTypes.object,
    fetchInterfaceData: PropTypes.func,
    history: PropTypes.object,
    editStatus: PropTypes.bool,
  }
  constructor(props) {
    super(props)
    const queryStr = window.location.search
    const queryObj = qs.parse(queryStr, { ignoreQueryPrefix: true })
    let curtab = 'view'
    if (
      queryObj['tab'] &&
      ['view', 'run', 'edit'].indexOf(queryObj['tab']) !== -1
    ) {
      curtab = queryObj['tab']
    }
    this.state = {
      curtab,
      visible: false,
      nextTab: '',
      actionId: props.match.params.actionId,
    }
  }

  componentDidMount() {
    this.handleRequest(this.props)
  }

  componentDidUpdate(prevProps, prevState) {
    const params = this.props.match.params
    if (params.actionId !== this.state.actionId) {
      this.setState({
        curtab: 'view',
        actionId: params.actionId,
      })

      this.handleRequest(this.props)
    }
    document.title = this.props.curdata.title
      ? `接口 · ${this.props.curdata.title}`
      : '接口'
  }

  componentWillUnmount() {
    document.title = `落兵台 · 接口文档管理平台`
  }

  handleRequest(nextProps) {
    const params = nextProps.match.params
    this.props.fetchInterfaceData(params.actionId)
    // this.setState({
    //   curtab: 'view',
    // })
  }

  switchToView = () => {
    this.setState({
      curtab: 'view',
    })
  }

  onChange = key => {
    if (this.state.curtab === 'edit' && this.props.editStatus) {
      this.showModal()
    } else {
      this.setState({
        curtab: key,
      })
    }
    this.setState({
      nextTab: key,
    })
  }
  // 确定离开页面
  handleOk = () => {
    this.setState({
      visible: false,
      curtab: this.state.nextTab,
    })
  }
  // 离开编辑页面的提示
  showModal = () => {
    this.setState({
      visible: true,
    })
  }
  // 取消离开编辑页面
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }
  render() {
    const { curtab } = this.state
    let InterfaceTabs = {
      view: {
        component: View,
        name: '查看',
      },
      edit: {
        component: Edit,
        name: '修改',
      },
      script: {
        component: Script,
        name: '预执行脚本',
      },
    }
    if (this.props.curdata.record_type === 0) {
      InterfaceTabs['run'] = {
        component: Run,
        name: '运行',
      }
    }

    if (
      this.props.curdata.record_type === 0 &&
      this.props.curdata.interface_type === 'http'
    ) {
      plugin.emitHook('interface_tab', InterfaceTabs)
    }
    const tabs = (
      <Tabs
        className="tabs-large"
        onChange={this.onChange}
        activeKey={curtab}
        defaultActiveKey="view"
      >
        {Object.keys(InterfaceTabs).map(key => {
          let item = InterfaceTabs[key]
          return <TabPane tab={item.name} key={key} />
        })}
      </Tabs>
    )
    let tabContent = null
    if (curtab && InterfaceTabs[curtab]) {
      let C = InterfaceTabs[curtab].component
      tabContent = <C switchToView={this.switchToView} />
    }

    return (
      <div className="interface-content">
        <Prompt
          when={curtab === 'edit' && this.props.editStatus}
          message={() => {
            return '离开页面会丢失当前编辑的内容，确定要离开吗？'
          }}
        />
        {tabs}
        {tabContent}
        {this.state.visible && (
          <Modal
            title="你即将离开编辑页面"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                取 消
              </Button>,
              <Button key="submit" onClick={this.handleOk}>
                确 定
              </Button>,
            ]}
          >
            <p>离开页面会丢失当前编辑的内容，确定要离开吗？</p>
          </Modal>
        )}
      </div>
    )
  }
}

export default withRouter(Content)
