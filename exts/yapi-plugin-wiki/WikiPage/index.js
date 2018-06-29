import React, { Component } from 'react';
import { Button, message } from 'antd';
// import { connect } from 'react-redux'
import axios from 'axios';
import PropTypes from 'prop-types';
import './index.scss';
// deps for editor
require('codemirror/lib/codemirror.css'); // codemirror
require('tui-editor/dist/tui-editor.css'); // editor ui
require('tui-editor/dist/tui-editor-contents.css'); // editor content
require('highlight.js/styles/github.css'); // code block highlight
// require('./editor.css');
var Editor = require('tui-editor');
import { formatDate } from '../util.js';

class WikiPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditor: false,
      isUpload: true,
      desc: '',
      markdown: ''
    };
  }

  static propTypes = {
    match: PropTypes.object
  };

  async componentDidMount() {
    const currProjectId = this.props.match.params.id;
    await this.handleData({ project_id: currProjectId });

    this.editor = new Editor({
      el: document.querySelector('#desc'),
      initialEditType: 'wysiwyg',
      height: '500px',
      initialValue: this.state.markdown || this.state.desc
    });
  }

  // 点击编辑按钮
  onEditor = () => {
    this.setState({
      isEditor: !this.state.isEditor
    });

    this.editor.setHtml(this.state.desc);
  };

  //  获取数据
  handleData = async params => {
    let result = await axios.get('/api/plugin/wiki_desc/get', { params });
    if (result.data.errcode === 0) {
      const data = result.data.data;
      if(data) {
        this.setState({
          desc: data.desc,
          markdown: data.markdown,
          username: data.username,
          editorTime: formatDate(data.up_time * 1000)
        });
      }
      
    } else {
      message.error(`请求数据失败： ${result.data.errmsg}`);
    }
  };

  onUpload = async () => {
    let desc = this.editor.getHtml();
    let markdown = this.editor.getMarkdown();
    const currProjectId = this.props.match.params.id;
    let option = {
      project_id: currProjectId,
      desc,
      markdown
    };
    let result = await axios.post('/api/plugin/wiki_desc/up', option);
    if (result.data.errcode === 0) {
      await this.handleData({ project_id: currProjectId });
      this.setState({ isEditor: false });
    } else {
      message.error(`更新失败： ${result.data.errmsg}`);
    }
  };

  onCancel = () => {
    this.setState({ isEditor: false });
  }

  render() {
    const { isEditor, username, editorTime } = this.state;
    return (
      <div className="g-row">
        <div className="m-panel wiki-content">
          <div className="wiki-title">
          {!isEditor ? (
            <Button icon="edit" onClick={this.onEditor}>
              编辑
            </Button>
          ) : (
            <div>
              <Button icon="upload" type="primary" className="upload-btn" onClick={this.onUpload}>
                更新
              </Button>
              <Button onClick={this.onCancel}>
                取消
              </Button>
            </div>
          )}
          </div>
          {!isEditor && username && (
            <div className="wiki-user">
              由{username}修改于{editorTime}
            </div>
          )}
          <div id="desc" className="wiki-editor" style={{ display: isEditor ? 'block' : 'none' }} />
          <div
            className="tui-editor-contents"
            style={{ display: isEditor ? 'none' : 'block' }}
            dangerouslySetInnerHTML={{ __html: this.state.desc }}
          />
        </div>
      </div>
    );
  }
}

export default WikiPage;
