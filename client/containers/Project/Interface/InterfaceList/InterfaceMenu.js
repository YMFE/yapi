import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { fetchInterfaceList, fetchInterfaceData, addInterfaceData, deleteInterfaceData } from '../../../../reducer/modules/interface.js';
import { Menu, Input, Icon, Tag, Modal, message } from 'antd';
import AddInterfaceForm from './AddInterfaceForm';
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom';

const confirm = Modal.confirm;
const SubMenu = Menu.SubMenu;


@connect(
  state => {
    return {
      list: state.inter.list,
      inter: state.inter.curdata,
      curProject: state.project.curProject
    }
  },
  {
    fetchInterfaceList,
    fetchInterfaceData,
    addInterfaceData,
    deleteInterfaceData
  }
)
class InterfaceMenu extends Component {
  static propTypes = {
    match: PropTypes.object,
    inter: PropTypes.object,
    projectId: PropTypes.string,
    list: PropTypes.array,
    fetchInterfaceList: PropTypes.func,
    curProject: PropTypes.object,
    fetchInterfaceData: PropTypes.func,
    addInterfaceData: PropTypes.func,
    deleteInterfaceData: PropTypes.func,
    history: PropTypes.object
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  }

  constructor(props) {
    super(props)
    this.state = {
      curKey: null,
      visible: false,
      delIcon: null,
      filter: ''
    }

  }

  async handleRequest() {
    await this.props.fetchInterfaceList(this.props.projectId);

    // if(!params.actionId){
    //   this.props.history.replace('/project/'+params.id + '/interface/api/' + result.payload.data[0]._id)
    // }
  }

  componentWillMount() {
    this.handleRequest()
  }

  // componentWillReceiveProps() {
  //   this.handleRequest()
  // }

  handleAddInterface = (data) => {
    data.project_id = this.props.projectId;
    axios.post('/api/interface/add', data).then((res) => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口添加成功')
      this.props.addInterfaceData(res.data.data)
      this.setState({
        visible: false
      });

    })
  }

  showConfirm = (id) => {
    let that = this;
    confirm({
      title: '您确认删除此接口',
      content: '温馨提示：接口删除后，无法恢复',
      onOk() {
        that.props.deleteInterfaceData(id)
      },
      onCancel() { }
    });
  }

  delInterface = (id) => {

    this.props.deleteInterfaceData(id)
  }

  enterItem = (e) => {
    this.setState({ delIcon: e.key })
  }

  leaveItem = () => {
    this.setState({ delIcon: null })
  }

  onFilter = (e) => {
    this.setState({
      filter: e.target.value
    })
  }

  handleGroup = (e) =>{
    console.log(e, '33')
    e.stopPropagation();
    return false;
  }

  render() {
    const items = [];
    const matchParams = this.props.match.params;
    this.props.list.forEach((item) => {
      let color, filter = this.state.filter;
      if (filter && item.title.indexOf(filter) === -1 && item.path.indexOf(filter) === -1) {
        return null;
      }
      switch (item.method) {
        case 'GET': color = "green"; break;
        case 'POST': color = "blue"; break;
        case 'PUT': color = "yellow"; break;
        case 'DELETE': color = 'red'; break;
        default: color = "green";
      }

      items.push(

        <Menu.Item onMouseEnter={this.enterItem} onMouseLeave={this.leaveItem} key={"" + item._id}>
          <Tag className="btn-http" color={color}>{item.method}  </Tag>
          <Link className="interface-item" to={"/project/" + matchParams.id + "/interface/api/" + item._id} >{item.title}</Link>
          <Icon type="delete" onClick={() => { this.showConfirm(item._id) }} style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }} className="interface-delete-icon" />
        </Menu.Item>
      )
    })

    return <div>
      <div className="interface-filter">
        <Input onChange={this.onFilter} value={this.state.filter} placeholder="Filter by name" style={{ width: "70%" }} />
        <Tag onClick={this.showModal} color="#108ee9" style={{ marginLeft: "15px" }} ><Icon type="plus" /></Tag>
        <Modal
          title="添加接口"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <AddInterfaceForm onCancel={this.handleCancel} onSubmit={this.handleAddInterface} />
        </Modal>
      </div>
      <Menu className="interface-list" defaultSelectedKeys={['aaa']} mode="inline"  defaultOpenKeys={['aaa']}>
        <SubMenu key={"aaa"} title={<span onClick={this.handleGroup}><Icon type="appstore" /><span>Navigation Two</span></span>}>
          {items}
        </SubMenu>
      </Menu>
    </div>

  }
}

export default withRouter(InterfaceMenu)
