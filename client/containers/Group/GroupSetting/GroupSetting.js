import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Button, message, Icon, Card, Alert, Modal } from 'antd';
import { fetchNewsData } from '../../../reducer/modules/news.js';
import { changeGroupMsg, fetchGroupList, setCurrGroup, fetchGroupMsg, updateGroupList, deleteGroup } from '../../../reducer/modules/group.js';
const { TextArea } = Input;
import _ from 'underscore';
import './GroupSetting.scss';
const confirm = Modal.confirm;

@connect(
  state => {
    return {
      groupList: state.group.groupList,
      currGroup: state.group.currGroup,
      curUserRole: state.user.role
    }
  },
  {
    changeGroupMsg,
    fetchGroupList,
    setCurrGroup,
    fetchGroupMsg,
    fetchNewsData,
    updateGroupList,
    deleteGroup
  }
)
class GroupLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currGroupDesc: '',
      currGroupName: '',
      showDangerOptions: false
    }
  }

  static propTypes = {
    currGroup: PropTypes.object,
    curUserRole: PropTypes.string,
    changeGroupMsg: PropTypes.func,
    fetchGroupList: PropTypes.func,
    setCurrGroup: PropTypes.func,
    fetchGroupMsg: PropTypes.func,
    fetchNewsData: PropTypes.func,
    updateGroupList: PropTypes.func,
    deleteGroup: PropTypes.func,
    groupList: PropTypes.array
  }

  // 修改分组名称
  changeName = (e) => {
    this.setState({
      currGroupName: e.target.value
    })
  }
  // 修改分组描述
  changeDesc = (e) => {
    this.setState({
      currGroupDesc: e.target.value
    })
  }

  componentDidMount() {
    this.setState({
      currGroupName: this.props.currGroup.group_name,
      currGroupDesc: this.props.currGroup.group_desc
    })
  }

  // 点击“查看危险操作”按钮
  toggleDangerOptions = () => {
    // console.log(this.state.showDangerOptions);
    this.setState({
      showDangerOptions: !this.state.showDangerOptions
    });
  }

  // 编辑分组信息
  @autobind
  async editGroup() {
    const id = this.props.currGroup._id;
    const res = await this.props.changeGroupMsg({
      group_name: this.state.currGroupName,
      group_desc: this.state.currGroupDesc,
      id: this.props.currGroup._id
    });
    if (!res.payload.data.errcode) {
      message.success('修改成功！');
      await this.props.fetchGroupList(this.props.groupList);
      this.props.updateGroupList(this.props.groupList)
      const currGroup = _.find(this.props.groupList, (group) => { return + group._id === + id });

      this.props.setCurrGroup(currGroup);
      this.props.fetchGroupMsg(this.props.currGroup._id);
      this.props.fetchNewsData(this.props.currGroup._id, "group", 1, 10)
    }
  }

  // 删除分组
  @autobind
  async deleteGroup() {
    const that = this;
    const { currGroup } = that.props;
    const res = await this.props.deleteGroup({ id: currGroup._id });
    if (!res.payload.data.errcode) {
      message.success('删除成功')
      await that.props.fetchGroupList();
      const currGroup = that.props.groupList[0] || { group_name: '', group_desc: '' };
      that.setState({ groupList: that.props.groupList });
      that.props.setCurrGroup(currGroup)
    }
  }

  // 删除分组的二次确认
  showConfirm = () => {
    const that = this;
    confirm({
      title: "确认删除 " + that.props.currGroup.group_name + " 分组吗？",
      content: <div style={{ marginTop: '10px', fontSize: '13px', lineHeight: '25px' }}>
        <Alert message="警告：此操作非常危险,会删除该分组下面所有项目和接口，并且无法恢复!" type="warning" />
        <div style={{ marginTop: '16px' }}>
          <p><b>请输入分组名称确认此操作:</b></p>
          <Input id="group_name" />
        </div>
      </div>,
      onOk() {
        const groupName = document.getElementById('group_name').value;
        if (that.props.currGroup.group_name !== groupName) {
          message.error('分组名称有误')
          return new Promise((resolve, reject) => {
            reject('error')
          })
        } else {
          that.deleteGroup()
        }

      },
      iconType: 'delete',
      onCancel() { }
    });
  }

  componentWillReceiveProps(nextProps) {
    // 切换分组时，更新分组信息并关闭删除分组操作
    if (this.props.currGroup._id !== nextProps.currGroup._id) {
      this.setState({
        showDangerOptions: false,
        currGroupName: nextProps.currGroup.group_name,
        currGroupDesc: nextProps.currGroup.group_desc
      })
    }
  }

  render () {
    return (
      <div className="m-panel card-panel card-panel-s panel-group">
        <div>
          <div className="row">
            <div className="left"><div className="label">分组名：</div></div>
            <div className="right">
              <Input size="large" placeholder="请输入分组名称" value={this.state.currGroupName} onChange={this.changeName}></Input>
            </div>
          </div>
          <div className="row">
            <div className="left"><div className="label">简介：</div></div>
            <div className="right">
              <TextArea size="large" rows={3} placeholder="请输入分组描述" value={this.state.currGroupDesc} onChange={this.changeDesc}></TextArea>
            </div>
          </div>
          <div className="row">
            <div className="left"></div>
            <div className="right"><Button type="primary" onClick={this.editGroup}>保存</Button></div>
          </div>
        </div>
        {/* 只有超级管理员能删除分组 */}
        {this.props.curUserRole === "admin" ?
          <div className="danger-container">
            <div className="title">
              <h2 className="content"><Icon type="exclamation-circle-o" /> 危险操作</h2>
              <Button onClick={this.toggleDangerOptions}>查 看<Icon type={this.state.showDangerOptions ? 'up' : 'down'} /></Button>
            </div>
            {this.state.showDangerOptions ? <Card noHovering={true} className="card-danger">
              <div className="card-danger-content">
                <h3>删除分组</h3>
                <p>分组一旦删除，将无法恢复数据，请慎重操作！</p>
                <p>只有超级管理员有权限删除分组。</p>
              </div>
              <Button type="danger" ghost className="card-danger-btn" onClick={this.showConfirm}>删除</Button>
            </Card> : null}
          </div> : null}
      </div>
    )
  }
}

export default GroupLog;
