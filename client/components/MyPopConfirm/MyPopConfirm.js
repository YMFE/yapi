import React, { PureComponent as Component } from 'react';
import { Modal, Button } from 'antd';
import PropTypes from 'prop-types';

// 嵌入到 BrowserRouter 内部，覆盖掉默认的 window.confirm
// http://reacttraining.cn/web/api/BrowserRouter/getUserConfirmation-func
class MyPopConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }
  static propTypes = {
    msg: PropTypes.string,
    callback: PropTypes.func
  };

  yes = () => {
    this.props.callback(true);
    this.setState({ visible: false });
  }

  no = () => {
    this.props.callback(false);
    this.setState({ visible: false });
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({ visible: true });
  }

  render() {
    if (!this.state.visible) {
      return null;
    }
    return (<Modal
      title="你即将离开编辑页面"
      visible={this.state.visible}
      onCancel={this.no}
      footer={[
        <Button key="back" onClick={this.no}>取 消</Button>,
        <Button key="submit" onClick={this.yes}>确 定</Button>
      ]}
    >
      <p>{this.props.msg}</p>
    </Modal>);
  }
}

export default MyPopConfirm;
