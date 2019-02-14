import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox } from 'antd';
import Editor from 'common/tui-editor/dist/tui-editor-Editor-all.min.js';
require('common/tui-editor/dist/tui-editor.min.css'); // editor ui
require('common/tui-editor/dist/tui-editor-contents.min.css'); // editor content
class WikiEditor extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    isConflict: PropTypes.bool,
    onUpload: PropTypes.func,
    onCancel: PropTypes.func,
    notice: PropTypes.bool,
    onEmailNotice: PropTypes.func,
    desc: PropTypes.string
  };

  componentDidMount() {
    this.editor = new Editor({
      el: document.querySelector('#desc'),
      initialEditType: 'wysiwyg',
      height: '500px',
      initialValue: this.props.desc
    });
  }

  onUpload = () => {
    let desc = this.editor.getHtml();
    let markdown = this.editor.getMarkdown();
    this.props.onUpload(desc, markdown);
  };

  render() {
    const { isConflict, onCancel, notice, onEmailNotice } = this.props;
    return (
      <div>
        <div
          id="desc"
          className="wiki-editor"
          style={{ display: !isConflict ? 'block' : 'none' }}
        />
        <div className="wiki-title wiki-up">
          <Button
            icon="upload"
            type="primary"
            className="upload-btn"
            disabled={isConflict}
            onClick={this.onUpload}
          >
            更新
          </Button>
          <Button onClick={onCancel} className="upload-btn">
            取消
          </Button>
          <Checkbox checked={notice} onChange={onEmailNotice}>
            通知相关人员
          </Checkbox>
        </div>
      </div>
    );
  }
}

export default WikiEditor;
