import { Modal } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { joinAllPublicGroup } from '../../../reducer/modules/group';

@connect(
  state => {
    return {
      uid: state.user.uid,
      login: state.user.isLogin,
      study: state.user.study
    };
  },
  {
    joinAllPublicGroup
  }
)
class JoinGroup extends React.Component {
  state = { visible: true };
  static propTypes = {
    joinAllPublicGroup: PropTypes.func,
    uid: PropTypes.number,
    login: PropTypes.bool,
    study: PropTypes.bool
  };
  handleOk = () => {
    this.setState({
      visible: false
    });
    this.props.joinAllPublicGroup();
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const center = { textAlign: 'center' };
    const { login, study } = this.props;
    return (
      <Modal
        closable={false}
        keyboard={false}
        maskClosable={false}
        title="是否加入公开分组？"
        visible={login && !study && this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="加入"
        cancelText="不加入"
      >
        <p style={center}>加入后可编辑公开小组API</p>
      </Modal>
    );
  }
}

export default JoinGroup;
