import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ProjectToken.scss';
import { getToken, updateToken } from '../../../../reducer/modules/project';
import { connect } from 'react-redux';
import { Icon, Tooltip, message, Modal } from 'antd';
import copy from 'copy-to-clipboard';
const confirm = Modal.confirm;

@connect(
  state => {
    return {
      token: state.project.token
    };
  },
  {
    getToken,
    updateToken
  }
)
class ProjectToken extends Component {
  static propTypes = {
    projectId: PropTypes.number,
    getToken: PropTypes.func,
    token: PropTypes.string,
    updateToken: PropTypes.func,
    curProjectRole: PropTypes.string
  };

  async componentDidMount() {
    await this.props.getToken(this.props.projectId);
  }

  copyToken = () => {
    copy(this.props.token);
    message.success('已经成功复制到剪切板');
  };

  updateToken = () => {
    let that = this;
    confirm({
      title: '重新生成key',
      content: '重新生成之后，之前的key将无法使用，确认重新生成吗？',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await that.props.updateToken(that.props.projectId);
        message.success('更新成功');
      },
      onCancel() {}
    });
  };

  render() {
    return (
      <div className="project-token">
        <h2 className="token-title">工具标识</h2>
        <div className="message">
          每个项目都有唯一的标识token，用户可以使用这个token值来请求项目的所有资源数据。
        </div>
        <div className="token">
          <span>
            token: <span className="token-message">{this.props.token}</span>
          </span>
          <Tooltip title="复制">
            <Icon className="token-btn" type="copy" onClick={this.copyToken} />
          </Tooltip>
          {this.props.curProjectRole === 'admin' || this.props.curProjectRole === 'owner' ? (
            <Tooltip title="刷新">
              <Icon className="token-btn" type="reload" onClick={this.updateToken} />
            </Tooltip>
          ) : null}
        </div>
        <div className="blockquote">
          为确保项目内数据的安全性和私密性，请勿轻易将该token暴露给项目组外用户。
        </div>
      </div>
    );
  }
}

export default ProjectToken;
