import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import InterfaceEditForm from './InterfaceEditForm.js'
import { updateInterfaceData, fetchInterfaceListMenu, fetchInterfaceData } from '../../../../reducer/modules/interface.js';
import axios from 'axios'
import { message } from 'antd'
import './Edit.scss'
import { withRouter, Link } from 'react-router-dom';

@connect(
  state => {
    return {
      curdata: state.inter.curdata,
      currProject: state.project.currProject
    }
  }, {
    updateInterfaceData,
    fetchInterfaceListMenu,
    fetchInterfaceData
  }
)

class InterfaceEdit extends Component {
  static propTypes = {
    curdata: PropTypes.object,
    currProject: PropTypes.object,
    updateInterfaceData: PropTypes.func,
    fetchInterfaceListMenu: PropTypes.func,
    fetchInterfaceData: PropTypes.func,
    match: PropTypes.object,
    switchToView: PropTypes.func
  }

  constructor(props) {
    super(props)
    const { curdata, currProject } = this.props;
    this.state = {
      mockUrl: location.protocol + '//' + location.hostname + (location.port !== "" ? ":" + location.port : "") + `/mock/${currProject._id}${currProject.basepath}${curdata.path}`,
      curdata: {},
      status: 0
    }
  }

  onSubmit = async (params) => {
    params.id = this.props.match.params.actionId;
    let result = await axios.post('/api/interface/up', params);
    this.props.fetchInterfaceListMenu(this.props.currProject._id).then();
    this.props.fetchInterfaceData(params.id).then()
    if (result.data.errcode === 0) {

      this.props.updateInterfaceData(params);
      message.success('保存成功');
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
    let domain = location.hostname + (location.port !== "" ? ":" + location.port : "");
    let s, initData = false;
    //因后端 node 仅支持 ws， 暂不支持 wss
    let wsProtocol = location.protocol === 'https' ? 'ws' : 'ws';

    setTimeout(()=>{
      if(initData === false){
        this.setState({
          curdata: this.props.curdata,
          status: 1
        })
        initData = true;
      }
    }, 3000)

    try {
      s = new WebSocket(wsProtocol + '://' + domain + '/api/interface/solve_conflict?id=' + this.props.match.params.actionId);
      s.onopen = () => {
        this.WebSocket = s;
      }

      s.onmessage = (e) => {
        initData = true;
        let result = JSON.parse(e.data);
        if (result.errno === 0) {
          this.setState({
            curdata: result.data,
            status: 1
          })
        } else {
          this.setState({
            curdata: result.data,
            status: 2
          })
        }

      }

      s.onerror = () => {
        this.setState({
          curdata: this.props.curdata,
          status: 1
        })
        console.warn('websocket 连接失败，将导致多人编辑同一个接口冲突。')
      }
    } catch (e) {

      this.setState({
        curdata: this.props.curdata,
        status: 1
      })
      console.error('websocket 连接失败，将导致多人编辑同一个接口冲突。');
    }

  }

  render() {
    return <div className="interface-edit">
      {this.state.status === 1 ?
        <InterfaceEditForm
          cat={this.props.currProject.cat}
          mockUrl={this.state.mockUrl}
          basepath={this.props.currProject.basepath}
          noticed={this.props.currProject.switch_notice}
          onSubmit={this.onSubmit}
          curdata={this.state.curdata} />
        :
        null}
      {
        this.state.status === 2 ?
          <div style={{ textAlign: 'center', fontSize: '14px', paddingTop: '10px' }}>
            <Link to={'/user/profile/' + this.state.curdata.uid}><b>{this.state.curdata.username}</b></Link>
            <span>正在编辑该接口，请稍后再试...</span>
          </div>
          :
          null}
      {
        this.state.status === 0 && '正在加载，请耐心等待...'
      }

    </div>
  }
}

export default withRouter(InterfaceEdit);
