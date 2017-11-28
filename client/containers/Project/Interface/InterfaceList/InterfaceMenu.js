import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { fetchInterfaceList, fetchInterfaceData, deleteInterfaceData, deleteInterfaceCatData, initInterface } from '../../../../reducer/modules/interface.js';
import { getProject } from '../../../../reducer/modules/project.js';
import { Input, Icon, Button, Modal, message, Tree, Tooltip } from 'antd';
import AddInterfaceForm from './AddInterfaceForm';
import AddInterfaceCatForm from './AddInterfaceCatForm';
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom';

const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;

@connect(

  state => {
    return {
      list: state.inter.list,
      inter: state.inter.curdata,
      curProject: state.project.currProject,
      expands: []
    }
  },
  {
    fetchInterfaceList,
    fetchInterfaceData,
    deleteInterfaceCatData,
    deleteInterfaceData,
    initInterface,
    getProject
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
    initInterface: PropTypes.func,
    history: PropTypes.object,
    router: PropTypes.object,
    getProject: PropTypes.func
  }

  /**
   * @param {String} key
   */
  changeModal = (key, status) => {
    //visible add_cat_modal_visible change_cat_modal_visible del_cat_modal_visible
    let newState = {}
    newState[key] = status
    this.setState(newState);
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
      curCatid: null,
      add_cat_modal_visible: false,
      change_cat_modal_visible: false,
      del_cat_modal_visible: false,
      curCatdata: {},
      expands: null,
      list: []
    }
  }

  handleRequest() {
    this.props.initInterface()
    this.getList()
  }

  async getList() {
    let r = await this.props.fetchInterfaceList(this.props.projectId);
    this.setState({
      list: JSON.parse(JSON.stringify(r.payload.data))
    })
  }

  componentWillMount() {
    this.handleRequest()
    
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      this.setState({
        list: nextProps.list
      })
    }
  }


  onSelect = (selectedKeys) => {
    const { history, match } = this.props;
    let curkey = selectedKeys[0];
    if (!curkey || !selectedKeys) return false;
    let basepath = "/project/" + match.params.id + "/interface/api";
    if (curkey === 'root') {
      history.push(basepath)
    } else {
      history.push(basepath + '/' + curkey)
    }
    this.setState({
      expands: null
    })
  }

  handleAddInterface = (data, cb) => {
    data.project_id = this.props.projectId;
    axios.post('/api/interface/add', data).then((res) => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口添加成功')
      let interfaceId = res.data.data._id;
      this.props.history.push("/project/" + this.props.projectId + "/interface/api/" + interfaceId)
      this.getList()
      this.setState({
        visible: false
      });
      if (cb) {
        cb();
      }

    })
  }

  handleAddInterfaceCat = (data) => {
    data.project_id = this.props.projectId;
    axios.post('/api/interface/add_cat', data).then((res) => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口分类添加成功')
      this.getList()
      this.props.getProject(data.project_id)
      this.setState({
        add_cat_modal_visible: false
      });

    })
  }

  handleChangeInterfaceCat = (data) => {
    data.project_id = this.props.projectId;

    let params = {
      catid: this.state.curCatdata._id,
      name: data.name
    }

    axios.post('/api/interface/up_cat', params).then((res) => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口分类更新成功')
      this.getList()
      this.props.getProject(data.project_id)
      this.setState({
        change_cat_modal_visible: false
      });

    })
  }

  showConfirm = (id) => {
    let that = this;
    const ref = confirm({
      title: '您确认删除此接口',
      content: '温馨提示：接口删除后，无法恢复',
      async onOk() {

        await that.props.deleteInterfaceData(id, that.props.projectId)
        await that.getList()
        ref.destroy()
        that.props.history.push('/project/' + that.props.match.params.id + '/interface/api')
      },
      onCancel() {
        ref.destroy()
      }
    });
  }

  showDelCatConfirm = (catid) => {
    let that = this;
    const ref = confirm({
      title: '确定删除此接口分类吗？',
      content: '温馨提示：该操作会删除该分类下所有接口，接口删除后无法恢复',
      async onOk() {
        await that.props.deleteInterfaceCatData(catid, that.props.projectId)
        await that.getList()
        await that.props.getProject(that.props.projectId)
        that.props.history.push('/project/' + that.props.match.params.id + '/interface/api')
        ref.destroy()
      },
      onCancel() { }
    });
  }

  copyInterface = (data) => {
    data.title = data.title + '_copy';
    data.path = data.path + '_' + Date.now();
    axios.post('/api/interface/add', data).then((res) => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口添加成功')
      let interfaceId = res.data.data._id;
      this.props.history.push("/project/" + this.props.projectId + "/interface/api/" + interfaceId)
      this.getList()
      this.setState({
        visible: false
      });
    })
  }

  enterItem = (id) => {
    this.setState({ delIcon: id })
  }

  leaveItem = () => {
    this.setState({ delIcon: null })
  }

  onFilter = (e) => {
    this.setState({
      filter: e.target.value,
      list: JSON.parse(JSON.stringify(this.props.list))
    })
  }

  onExpand = (e) => {
    this.setState({
      expands: e
    })
  }

  onDrop = async (e) => {
    const dropCatIndex = e.node.props.pos.split('-')[1] - 1;
    const dragCatIndex = e.dragNode.props.pos.split('-')[1] - 1;
    if (dropCatIndex < 0 || dragCatIndex < 0) {
      return;
    }
    const dropCatId = this.props.list[dropCatIndex]._id;
    const id = e.dragNode.props.eventKey;
    const dragCatId = this.props.list[dragCatIndex]._id;
    if (id.indexOf('cat') === -1 && dropCatId !== dragCatId) {
      await axios.post('/api/interface/up', { id, catid: dropCatId });
      this.props.fetchInterfaceList(this.props.projectId);
    }
  }

  render() {
    const matchParams = this.props.match.params;
    let menuList = this.state.list;
    const searchBox = <div className="interface-filter">
      <Input onChange={this.onFilter} value={this.state.filter} placeholder="搜索接口" />
      <Button type="primary" onClick={() => this.changeModal('add_cat_modal_visible', true)} className="btn-filter" >添加分类</Button>
      {this.state.visible ? <Modal
        title="添加接口"
        visible={this.state.visible}
        onCancel={() => this.changeModal('visible', false)}
        footer={null}
        className="addcatmodal"
      >
        <AddInterfaceForm catdata={this.props.curProject.cat} catid={this.state.curCatid} onCancel={() => this.changeModal('visible', false)} onSubmit={this.handleAddInterface} />
      </Modal> : ""}

      {this.state.add_cat_modal_visible ? <Modal
        title="添加分类"
        visible={this.state.add_cat_modal_visible}
        onCancel={() => this.changeModal('add_cat_modal_visible', false)}
        footer={null}
        className="addcatmodal"
      >
        <AddInterfaceCatForm onCancel={() => this.changeModal('add_cat_modal_visible', false)} onSubmit={this.handleAddInterfaceCat} />
      </Modal> : ""}

      {this.state.change_cat_modal_visible ? <Modal
        title="修改分类"
        visible={this.state.change_cat_modal_visible}
        onCancel={() => this.changeModal('change_cat_modal_visible', false)}
        footer={null}
        className="addcatmodal"
      >
        <AddInterfaceCatForm catdata={this.state.curCatdata} onCancel={() => this.changeModal('change_cat_modal_visible', false)} onSubmit={this.handleChangeInterfaceCat} />
      </Modal> : ""}
    </div>
    if (menuList.length === 0) {
      return searchBox;
    }
    const defaultExpandedKeys = () => {
      const { router, inter, list } = this.props, rNull = { expands: [], selects: [] };
      if (list.length === 0) {
        return rNull;
      }
      if (router) {
        if (!isNaN(router.params.actionId)) {
          if (!inter || !inter._id) {
            return rNull;
          }
          return {
            expands: this.state.expands ? this.state.expands : ['cat_' + inter.catid],
            selects: [inter._id + ""]
          }
        } else {
          let catid = router.params.actionId.substr(4);
          return {
            expands: this.state.expands ? this.state.expands : ['cat_' + catid],
            selects: ['cat_' + catid]
          }
        }
      } else {
        return {
          expands: this.state.expands ? this.state.expands : ['cat_' + list[0]._id],
          selects: ['root']
        }
      }
    }

    const item_interface_create = (item) => {
      // let color;
      // switch (item.method) {
      //   case 'GET': color = "green"; break;
      //   case 'POST': color = "blue"; break;
      //   case 'PUT': color = "yellow"; break;
      //   case 'DELETE': color = 'red'; break;
      //   default: color = "yellow";
      // }
      // const menu = (item) => {
      //   return <Menu>
      //     <Menu.Item>
      //       <span onClick={() => { this.showConfirm(item._id) }}>删除接口</span>
      //     </Menu.Item>
      //     <Menu.Item>
      //       <span onClick={() => {
      //         this.copyInterface(item)
      //       }}>复制接口</span>
      //     </Menu.Item>
      //   </Menu>
      // };

      return <TreeNode
        title={<div className="container-title" onMouseEnter={() => this.enterItem(item._id)} onMouseLeave={this.leaveItem}  >
          <Link className="interface-item" to={"/project/" + matchParams.id + "/interface/api/" + item._id} >{item.title}</Link>
          <div className="btns">
            <Tooltip title="删除接口">
              <Icon type='delete' className="interface-delete-icon" onClick={(e) => { e.stopPropagation(); this.showConfirm(item._id) }} style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }} />
            </Tooltip>
            <Tooltip title="复制接口">
              <Icon type='copy' className="interface-delete-icon" onClick={(e) => { e.stopPropagation(); this.copyInterface(item) }} style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }} />
            </Tooltip>
          </div>
          {/*<Dropdown overlay={menu(item)} trigger={['click']} onClick={e => e.stopPropagation()}>
            <Icon type='ellipsis' className="interface-delete-icon" style={{ opacity: this.state.delIcon == item._id ? 1 : 0 }}/>
          </Dropdown>*/}
        </div>}
        key={'' + item._id} />

    }

    // const menu = (item) => {
    //   return <Menu>
    //     <Menu.Item>
    //       <span onClick={() => {
    //         this.changeModal('visible', true);
    //         this.setState({
    //           curCatid: item._id
    //         })
    //       }}>添加接口</span>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <span onClick={() => {
    //         this.changeModal('change_cat_modal_visible', true);
    //         this.setState({
    //           curCatdata: item
    //         })
    //       }}>修改分类</span>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <span onClick={() => {
    //         this.showDelCatConfirm(item._id)
    //       }}>删除分类</span>
    //     </Menu.Item>
    //   </Menu>
    // };



    let currentKes = defaultExpandedKeys();

    if (this.state.filter) {
      let arr = [];
      menuList = menuList.filter((item) => {
        let interfaceFilter = false;
        if (item.name.indexOf(this.state.filter) === -1) {
          item.list = item.list.filter(inter => {
            if (inter.title.indexOf(this.state.filter) === -1 && inter.path.indexOf(this.state.filter)) {
              return false;
            }
            //arr.push('cat_' + inter.catid)
            interfaceFilter = true;
            return true;

          })
          return interfaceFilter === true
        }
        arr.push('cat_' + item._id)
        return true;
      })
      if (arr.length > 0) {
        currentKes.expands = arr;
      }
    }

    // console.log('height',this.state.scrollHeight)
    return <div>
      {searchBox}
      {menuList.length > 0 ?
        <Tree
          className="interface-list"
          defaultExpandedKeys={currentKes.expands}
          defaultSelectedKeys={currentKes.selects}
          expandedKeys={currentKes.expands}
          selectedKeys={currentKes.selects}
          onSelect={this.onSelect}
          onExpand={this.onExpand}
          ondragstart={() => { return false }}
        >
          <TreeNode className="item-all-interface" title={<Link style={{ fontSize: '14px' }} to={"/project/" + matchParams.id + "/interface/api"}><Icon type="folder" style={{ marginRight: 5 }} />全部接口</Link>} key="root" />
          {menuList.map((item) => {
            return <TreeNode title={<div className="container-title" onMouseEnter={() => this.enterItem(item._id)} onMouseLeave={this.leaveItem} >
              <Link className="interface-item" to={"/project/" + matchParams.id + "/interface/api/cat_" + item._id} ><Icon type="folder-open" style={{ marginRight: 5 }} />{item.name}</Link>
              <div className="btns">
                <Tooltip title="删除分类">
                  <Icon type='delete' className="interface-delete-icon" onClick={(e) => { e.stopPropagation(); this.showDelCatConfirm(item._id) }} style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }} />
                </Tooltip>
                <Tooltip title="修改分类">
                  <Icon type='edit' className="interface-delete-icon" style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }} onClick={(e) => {
                    e.stopPropagation();
                    this.changeModal('change_cat_modal_visible', true);
                    this.setState({
                      curCatdata: item
                    })
                  }} />
                </Tooltip>
                <Tooltip title="添加接口">
                  <Icon type='plus' className="interface-delete-icon" style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }} onClick={(e) => {
                    e.stopPropagation();
                    this.changeModal('visible', true);
                    this.setState({
                      curCatid: item._id
                    });
                  }} />
                </Tooltip>
              </div>

              {/*<Dropdown overlay={menu(item)} trigger={['click']} onClick={e => e.stopPropagation()}>
                <Icon type='ellipsis' className="interface-delete-icon" />
              </Dropdown>*/}
            </div>}
              key={'cat_' + item._id}
              className={`interface-item-nav ${item.list.length ? "" : "cat_switch_hidden"}`}
            >
              {item.list.map(item_interface_create)}

            </TreeNode>
          })}



        </Tree>
        : null}
    </div>

  }
}

export default withRouter(InterfaceMenu)
