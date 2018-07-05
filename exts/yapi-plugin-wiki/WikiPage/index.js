import React, { Component } from 'react';
import { message } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import './index.scss';
import { timeago } from '../util.js';
import { Link } from 'react-router-dom';
import WikiView from './View.js';
import WikiEditor from './Editor.js';

@connect(
  state => {
    return {
      projectMsg: state.project.currProject
    };
  },
  {}
)
class WikiPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditor: false,
      isUpload: true,
      desc: '',
      markdown: '',
      notice: props.projectMsg.switch_notice,
      status: 'INIT',
      editUid: '',
      editName: '',
      curdata: null
    };
  }

  static propTypes = {
    match: PropTypes.object,
    projectMsg: PropTypes.object
  };

  async componentDidMount() {
    const currProjectId = this.props.match.params.id;
    await this.handleData({ project_id: currProjectId });
  }

  componentWillUnmount() {
    // willUnmount
    this.closeWebSocket();
  }

  // 关闭websocket
  closeWebSocket = () => {
    try {
      if (this.state.status === 'CLOSE') {
        this.WebSocket.close();
      }
    } catch (e) {
      return null;
    }
  };

  // 处理多人编辑冲突问题
  handleConflict = () => {
    let self = this;
    return new Promise((resolve, reject) => {
      let domain = location.hostname + (location.port !== '' ? ':' + location.port : '');
      let s,
        initData = false;
      //因后端 node 仅支持 ws， 暂不支持 wss
      let wsProtocol = location.protocol === 'https' ? 'ws' : 'ws';

      setTimeout(() => {
        if (initData === false) {
          self.setState({
            status: 'CLOSE'
          });
          initData = true;
        }
      }, 3000);

      s = new WebSocket(
        wsProtocol +
          '://' +
          domain +
          '/api/ws_plugin/wiki_desc/solve_conflict?id=' +
          this.props.match.params.id
      );
      s.onopen = () => {
        self.WebSocket = s;
      };

      s.onmessage = e => {
        initData = true;
        let result = JSON.parse(e.data);
        if (result.errno === 0) {
          self.setState({
            curdata: result.data,
            status: 'CLOSE'
          });
        } else {
          self.setState({
            editUid: result.data.uid,
            editName: result.data.username,
            status: 'EDITOR'
          });
        }

        resolve();
      };

      s.onerror = () => {
        self.setState({
          // curdata: this.props.curdata,
          status: 'CLOSE'
        });
        console.warn('websocket 连接失败，将导致多人编辑同一个接口冲突。');
        reject('websocket 连接失败，将导致多人编辑同一个接口冲突。');
      };
    });
  };

  // 点击编辑按钮
  onEditor = async () => {
    this.setState({isEditor: !this.state.isEditor})
    // 多人冲突编辑判断
    await this.handleConflict();
    // 获取最新的编辑数据
    // let curDesc = this.state.curdata ? this.state.curdata.desc : this.state.desc;
    if(this.state.curdata) {
      this.setState({
        desc: this.state.curdata.desc,
        username: this.state.curdata.username,
        uid: this.state.curdata.uid,
        editorTime: timeago(this.state.curdata.up_time)
      });
    } 
    
  };

  //  获取数据
  handleData = async params => {
    let result = await axios.get('/api/plugin/wiki_desc/get', { params });
    if (result.data.errcode === 0) {
      const data = result.data.data;
      if (data) {
        this.setState({
          desc: data.desc,
          markdown: data.markdown,
          username: data.username,
          uid: data.uid,
          editorTime: timeago(data.up_time)
        });
      }
    } else {
      message.error(`请求数据失败： ${result.data.errmsg}`);
    }
  };

  onUpload = async (desc, markdown) => {
    
    const currProjectId = this.props.match.params.id;
    let option = {
      project_id: currProjectId,
      desc,
      markdown,
      email_notice: this.state.notice
    };
    let result = await axios.post('/api/plugin/wiki_desc/up', option);
    if (result.data.errcode === 0) {
      await this.handleData({ project_id: currProjectId });
      this.setState({ isEditor: false });
    } else {
      message.error(`更新失败： ${result.data.errmsg}`);
    }
    this.closeWebSocket();
  };
  // 取消编辑
  onCancel = () => {
    this.setState({ isEditor: false, status: 'CLOSE' });
    this.closeWebSocket();
  };

  // 邮件通知
  onEmailNotice = e => {
    this.setState({
      notice: e.target.checked
    });
  };

  render() {
    const { isEditor, username, editorTime, notice, uid, status, editUid, editName } = this.state;
    const editorEable =
      this.props.projectMsg.role === 'admin' ||
      this.props.projectMsg.role === 'owner' ||
      this.props.projectMsg.role === 'dev';
    const isConflict = status === 'EDITOR';

    return (
      <div className="g-row">
        <div className="m-panel wiki-content">
          {!isEditor ? (
            <WikiView
              editorEable={editorEable}
              onEditor={this.onEditor}
              uid={uid}
              username={username}
              editorTime={editorTime}
              desc={this.state.desc}
            />
          ) : (
            <WikiEditor
              isConflict={isConflict}
              onUpload={this.onUpload}
              onCancel={this.onCancel}
              notice={notice}
              onEmailNotice={this.onEmailNotice}
              desc={this.state.desc}
            />
          )}

          <div className="wiki-content">
            {isConflict && (
              <div className="wiki-conflict">
                <Link to={`/user/profile/${editUid || uid}`}>
                  <b>{editName || username}</b>
                </Link>
                <span>正在编辑该wiki，请稍后再试...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default WikiPage;
