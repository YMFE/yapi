import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { fetchInterfaceList, fetchInterfaceData, addInterfaceData, deleteInterfaceData } from '../../../../reducer/modules/interface.js';
import { Menu, Input, Icon, Tag, Modal, message, Tree, Dropdown } from 'antd';
import AddInterfaceForm from './AddInterfaceForm';
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom';

const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;


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

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  }

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

  enterItem = (id) => {
    this.setState({ delIcon: id })
  }

  leaveItem = () => {
    this.setState({ delIcon: null })
  }

  onFilter = (e) => {
    this.setState({
      filter: e.target.value
    })
  }

  handleGroup = (e) => {
    e.stopPropagation();
    return false;
  }

  render() {
    const matchParams = this.props.match.params;

    const item_interface_create = (item) => {
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
      return <TreeNode
        title={<div onMouseEnter={() => this.enterItem(item._id)} onMouseLeave={this.leaveItem} >          
          <Link className="interface-item" to={"/project/" + matchParams.id + "/interface/api/" + item._id} ><Tag color={color} className="btn-http" >{item.method}</Tag>{item.title}</Link>
          <Icon type='delete' className="interface-delete-icon" onClick={() => { this.showConfirm(item._id) }} style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }} />
        </div>}
        key={'' + item._id} />

    }

    const menu = (
      <Menu>
        <Menu.Item>
          <span onClick={this.showModal}>添加接口</span>
        </Menu.Item>
        <Menu.Item>
          <span >修改分类</span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={this.showModal}>删除分类</span>
        </Menu.Item>
      </Menu>
    );

    return <div>
      <div className="interface-filter">
        <Input onChange={this.onFilter} value={this.state.filter} placeholder="Filter by name" style={{ width: "70%" }} />
        <Tag  color="#108ee9" style={{ marginLeft: "15px" }} ><Icon type="plus" /></Tag>
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
      {this.props.list.length > 0 ?
        <Tree
          className="interface-list"
          defaultExpandedKeys={['group-' + this.props.list[0]._id]}
          onSelect={this.onSelect}
        >
          <TreeNode title={<Link style={{fontSize: '14px'}} to={"/project/" + matchParams.id + "/interface/api"}><Icon type="folder-open" style={{marginRight: 5}} />全部接口</Link>} key="root" />
          {this.props.list.map((item) => {
            return <TreeNode title={<div>              
              <Link className="interface-item" to={"/project/" + matchParams.id + "/interface/api/cat_" + item._id} ><Icon type="folder-open" style={{marginRight: 5}} />{item.name}</Link>
              <Dropdown overlay={menu}>
                <Icon type='bars' className="interface-delete-icon" />
              </Dropdown>
            </div>} key={'group-' + item._id} >
              {item.list.map(item_interface_create)}

            </TreeNode>
          })}



        </Tree>
        : null}
    </div>

  }
}

export default withRouter(InterfaceMenu)
