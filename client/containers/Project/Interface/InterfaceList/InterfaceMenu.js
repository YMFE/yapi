import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  fetchInterfaceListMenu,
  fetchInterfaceList,
  fetchInterfaceCatList,
  fetchInterfaceData,
  deleteInterfaceData,
  deleteInterfaceCatData,
  initInterface
} from '../../../../reducer/modules/interface.js';
import { getProject } from '../../../../reducer/modules/project.js';
import { Input, Icon, Button, Modal, message, Tree, Tooltip } from 'antd';
import AddInterfaceForm from './AddInterfaceForm';
import AddInterfaceCatForm from './AddInterfaceCatForm';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import produce from 'immer';
import { arrayChangeIndex } from '../../../../common.js';

import './interfaceMenu.scss';

const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const headHeight = 240; // menu顶部到网页顶部部分的高度

@connect(
  state => {
    return {
      list: state.inter.list,
      inter: state.inter.curdata,
      curProject: state.project.currProject,
      expands: [],
      treeData: []
    };
  },
  {
    fetchInterfaceListMenu,
    fetchInterfaceData,
    deleteInterfaceCatData,
    deleteInterfaceData,
    initInterface,
    getProject,
    fetchInterfaceCatList,
    fetchInterfaceList
  }
)
class InterfaceMenu extends Component {
  static propTypes = {
    match: PropTypes.object,
    inter: PropTypes.object,
    projectId: PropTypes.string,
    list: PropTypes.array,
    fetchInterfaceListMenu: PropTypes.func,
    curProject: PropTypes.object,
    fetchInterfaceData: PropTypes.func,
    addInterfaceData: PropTypes.func,
    deleteInterfaceData: PropTypes.func,
    initInterface: PropTypes.func,
    history: PropTypes.object,
    router: PropTypes.object,
    getProject: PropTypes.func,
    fetchInterfaceCatList: PropTypes.func,
    fetchInterfaceList: PropTypes.func
  };

  /**
   * @param {String} key
   */
  changeModal = (key, status) => {
    //visible add_cat_modal_visible change_cat_modal_visible del_cat_modal_visible
    let newState = {};
    newState[key] = status;
    this.setState(newState);
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  constructor(props) {
    super(props);
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
    };
  }

  handleRequest() {
    this.props.initInterface();
    this.getList();
  }

  async getList() {
    let r = await this.props.fetchInterfaceListMenu(this.props.projectId);
    this.setState({
      list: r.payload.data.data
    });
  }

  componentWillMount() {
    this.handleRequest();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      // console.log('next', nextProps.list)
      this.setState({
        list: nextProps.list
      });
    }
  }

  onSelect = selectedKeys => {
    const { history, match } = this.props;
    let curkey = selectedKeys[0];

    if (!curkey || !selectedKeys) {
      return false;
    }
    let basepath = '/project/' + match.params.id + '/interface/api';
    if (curkey === 'root') {
      history.push(basepath);
    } else {
      history.push(basepath + '/' + curkey);
    }
    this.setState({
      expands: null
    });
  };

  changeExpands = () => {
    this.setState({
      expands: null
    });
  };

  handleAddInterface = (data, cb) => {
    data.project_id = this.props.projectId;
    axios.post('/api/interface/add', data).then(res => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口添加成功');
      let interfaceId = res.data.data._id;
      this.props.history.push('/project/' + this.props.projectId + '/interface/api/' + interfaceId);
      this.getList();
      this.setState({
        visible: false
      });
      if (cb) {
        cb();
      }
    });
  };

  handleAddInterfaceCat = data => {
    data.project_id = this.props.projectId;
    axios.post('/api/interface/add_cat', data).then(res => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口分类添加成功');
      this.getList();
      this.props.getProject(data.project_id);
      this.setState({
        add_cat_modal_visible: false
      });
    });
  };

  handleChangeInterfaceCat = data => {
    data.project_id = this.props.projectId;

    let params = {
      catid: this.state.curCatdata._id,
      name: data.name,
      pid: data.pid,
      desc: data.desc
    };

    axios.post('/api/interface/up_cat', params).then(res => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口分类更新成功');
      this.getList();
      this.props.getProject(data.project_id);
      this.setState({
        change_cat_modal_visible: false
      });
    });
  };

  showConfirm = data => {
    let that = this;
    let id = data._id;
    let catid = data.catid;
    const ref = confirm({
      title: '您确认删除此接口????',
      content: '温馨提示：接口删除后，无法恢复',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await that.props.deleteInterfaceData(id, that.props.projectId);
        await that.getList();
        await that.props.fetchInterfaceCatList({ catid });
        ref.destroy();
        that.props.history.push(
          '/project/' + that.props.match.params.id + '/interface/api/cat_' + catid
        );
      },
      onCancel() {
        ref.destroy();
      }
    });
  };

  showDelCatConfirm = item => {
    let catid = item.catid;
    let that = this;
    if(item.list && item.list.length > 0 ) {
      return message.error('该分类下有内容，不允许删除');
    }
    const ref = confirm({
      title: '确定删除此接口分类吗？',
      content: '温馨提示：该操作会删除该分类下所有接口，接口删除后无法恢复',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await that.props.deleteInterfaceCatData(catid, that.props.projectId);
        await that.getList();
        // await that.props.getProject(that.props.projectId)
        await that.props.fetchInterfaceList({ project_id: that.props.projectId });
        that.props.history.push('/project/' + that.props.match.params.id + '/interface/api');
        ref.destroy();
      },
      onCancel() {}
    });
  };

  copyInterface = async id => {
    let interfaceData = await this.props.fetchInterfaceData(id);
    // let data = JSON.parse(JSON.stringify(interfaceData.payload.data.data));
    // data.title = data.title + '_copy';
    // data.path = data.path + '_' + Date.now();
    let data = interfaceData.payload.data.data;
    let newData = produce(data, draftData => {
      draftData.title = draftData.title + '_copy';
      draftData.path = draftData.path + '_' + Date.now();
    });

    axios.post('/api/interface/add', newData).then(async res => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口添加成功');
      let interfaceId = res.data.data._id;
      await this.getList();
      this.props.history.push('/project/' + this.props.projectId + '/interface/api/' + interfaceId);
      this.setState({
        visible: false
      });
    });
  };

  enterItem = id => {
    this.setState({ delIcon: id });
  };

  leaveItem = () => {
    this.setState({ delIcon: null });
  };

  onFilter = e => {
    const list = this.state.list;
    const expands = [];
    const loop = (arr) => {
      arr.forEach((item) => {
        if(item.name && item.name.indexOf(e.target.value) > -1) {
          expands.push('cat_' + item._id);
        }
        if(item.title && item.title.indexOf(e.target.value) > -1) {
          expands.push('cat_' + item.catid);
        }
        if(item.list && item.list.length > 0) {
          loop(item.list);
        }
      });
    };
    if(e.target.value.length > 0) {
      loop(list);
    }
    if(expands.length > 0) {
      this.setState({
        filter: e.target.value,
        expands: expands
      });
    } else {
      this.setState({
        filter: e.target.value
      });
    }
  };

  onExpand = e => {
    this.setState({
      expands: e
    });
  };
  // 通过pos 查找对象
  searchByPos = (pos) => {
    let list = this.state.list;
    const posPath = pos.split('-');
    posPath.splice(0, 1);
    posPath.forEach((item, index) => {
      const i = parseInt(item);
      if(index === 0) {
        list = list[i - 1];
      } else {
        list = list.list[i];
      }
    });
    return list;
  };
  onDrop = async e => {
    // 当前操作ID
    let actionId = e.dragNode.props.eventKey;
    let pathArr = e.node.props.pos.split('-');
    pathArr.splice(0, 1);
    // 当前拖动的对象
    let dragObj = this.searchByPos(e.dragNode.props.pos);
    // 放置到的目标对象
    let putObj = this.state.list;
    let path = [];
    pathArr.forEach((item, index) => {
      const i = parseInt(item);
      if(index === 0) {
        putObj = putObj[i - 1];
        path.push(putObj);
      } else {
        putObj = putObj.list[i];
        path.push(putObj);
      }
    });
    // 判断拖动的是否为接口
    if(actionId.indexOf('cat') === -1) {
      let catid = null;
      actionId = parseInt(actionId);
      // 判断下拖动到了分类还是接口
      if(!putObj) {
        return;
      }
      if(putObj.list) {
        catid = putObj._id;
      } else {
        catid = putObj.catid
      }
      // console.log('dropId:', actionId,'dropDownId',putObj._id, 'pid', putObj.catid, 'catid', catid);
      // 判断是否同级别拖动 同级别只调整顺序
      if(putObj.catid === catid) {
        // 调整顺序
        let colList = path[path.length - 2].list;
        let dragIndex = null;
        let dropIndex = null;
        colList.forEach((item, index) => {
          if(item._id === actionId) {
            dragIndex = index;
          }
          if(item._id === putObj._id) {
            dropIndex = index;
          }
        });
        let changes = arrayChangeIndex(colList, dropIndex, dragIndex);
        axios.post('/api/interface/up_index', changes).then();
      } else {
        await axios.post('/api/interface/up', {
          id: actionId,
          catid
        });
      }
      const { projectId, router } = this.props;
      this.props.fetchInterfaceListMenu(projectId);
      this.props.fetchInterfaceList({ project_id: projectId });
      if (router && isNaN(router.params.actionId)) {
        // 更新分类list下的数据
        this.props.fetchInterfaceCatList({ catid });
      }
    } else {
      // 分类之间拖动
      // 判断下拖动到了分类还是接口
      if(putObj && !putObj.list) {
        return;
      }
      const params = {
        catid: dragObj._id,
        desc: dragObj.desc,
        name: dragObj.name,
        pid: putObj ? putObj._id : null
      };
      axios.post('/api/interface/up_cat', params).then(res => {
        if (res.data.errcode !== 0) {
          return message.error(res.data.errmsg);
        }
        message.success('接口分类更新成功');
      });
      this.props.fetchInterfaceListMenu(this.props.projectId);
    }
  };
  // 上移-下移
  upAndDown = (list, item, index, action) => {
    let dropIndex;
    if(action === 'up') {
      dropIndex = index -1;
    } else {
      dropIndex = index + 1;
    }
    if(list[dropIndex] && list[dropIndex].list) {
      let changes = arrayChangeIndex(list, index, dropIndex);
      axios.post('/api/interface/up_cat_index', changes).then();
      this.props.fetchInterfaceListMenu(this.props.projectId);
    } else {
      return message.warning('分类无法和接口调换位置');
    }
  };
  // 数据过滤
  filterList = list => {
    let that = this;
    let arr = [];
    let menuList = produce(list, draftList => {
      draftList.filter(item => {
        let interfaceFilter = false;
        // arr = [];
        if (item.name.indexOf(that.state.filter) === -1) {
          item.list = item.list.filter(inter => {
            if (
              inter.title.indexOf(that.state.filter) === -1 &&
              inter.path.indexOf(that.state.filter) === -1
            ) {
              return false;
            }
            //arr.push('cat_' + inter.catid)
            interfaceFilter = true;
            return true;
          });
          arr.push('cat_' + item._id);
          return interfaceFilter === true;
        }
        arr.push('cat_' + item._id);
        return true;
      });
    });

    return { menuList, arr };
  };
  // 生成无级树
  renderTree = (treeData) => treeData.map((item, index) => {
    if(item.list) {
      return(
        <TreeNode
          title={
            <div
                className="container-title"
                onMouseEnter={() => this.enterItem(item._id)}
                onMouseLeave={this.leaveItem}
            >
              <Icon type="folder-open" style={{ marginRight: 5 }} />
                {item.name}
              <div className="btns">
                <Tooltip title="删除分类">
                  <Icon
                      type="delete"
                      className="interface-delete-icon"
                      onClick={e => {
                        e.stopPropagation();
                        this.showDelCatConfirm(item);
                      }}
                      style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }}
                  />
                </Tooltip>
                <Tooltip title="修改分类">
                  <Icon
                      type="edit"
                      className="interface-delete-icon"
                      style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }}
                      onClick={e => {
                        e.stopPropagation();
                        item.pid = item.pid ? item.pid.toString() : null;
                        this.changeModal('change_cat_modal_visible', true);
                        this.setState({
                          curCatdata: item
                        });
                      }}
                  />
                </Tooltip>
                <Tooltip title="添加接口">
                  <Icon
                      type="file-add"
                      className="interface-delete-icon"
                      style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }}
                      onClick={e => {
                        e.stopPropagation();
                        this.changeModal('visible', true);
                        this.setState({
                          curCatid: item._id
                        });
                      }}
                  />
                </Tooltip>
                <Tooltip title="添加子分类">
                  <Icon
                    type="folder-add"
                    className="interface-delete-icon"
                    style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }}
                    onClick={e => {
                      e.stopPropagation();
                      const pid = item._id ? item._id.toString() : null;
                      const curCatdata = {
                        pid
                      };
                      this.setState({
                        curCatdata: curCatdata
                      });
                      this.changeModal('add_cat_modal_visible', true);
                    }}
                  />
                </Tooltip>
                <Tooltip title="下移">
                  <Icon
                      type="down"
                      className="interface-delete-icon"
                      style={{ display: (this.state.delIcon == item._id && index !== treeData.length - 1) ? 'block' : 'none' }}
                      onClick={() => {
                        this.upAndDown(treeData, item, index, 'down')
                      }}
                  />
                </Tooltip>
                <Tooltip title="上移">
                  <Icon
                      type="up"
                      className="interface-delete-icon"
                      style={{ display: (this.state.delIcon == item._id && index!== 0) ? 'block' : 'none' }}
                      onClick={() => {
                        this.upAndDown(treeData, item, index, 'up')
                      }}
                  />
                </Tooltip>
              </div>
            </div>
          }
          key={'cat_' + item._id}
          className={`interface-item-nav ${item.list.length ? '' : 'cat_switch_hidden'}`}
        >
          {this.renderTree(item.list)}
        </TreeNode>
      )
    } else {
      let str = item.name || item.title;
      let keyword = this.state.filter;
      let arr = [];
      if(keyword && str.indexOf(keyword) > -1) {
        arr = str.split(keyword);
        return (
          <TreeNode title={
            <div
              className="container-title"
              onMouseEnter={() => this.enterItem(item._id)}
              onMouseLeave={this.leaveItem}
            >
              {
                arr.map((item, index) => {
                  return (
                    <span key={index}>
                      <i style={{
                        color: 'red',
                        fontStyle: 'normal',
                        display: index === 0 ? 'none' : 'inline-block'
                      }}>{ keyword }</i>
                      {item}
                    </span>
                  )
                })
              }
            </div>
          } key={'' + item._id}>
          </TreeNode>
        )
      } else {
        return (
          <TreeNode title={
            <div
              className="container-title"
              onMouseEnter={() => this.enterItem(item._id)}
              onMouseLeave={this.leaveItem}
            >
              { str }
            </div>
          } key={'' + item._id}/>
        )
      }

    }
  });
  render() {
    const matchParams = this.props.match.params;
    // let menuList = this.state.list;
    const searchBox = (
      <div className="interface-filter">
        <Input onChange={this.onFilter} value={this.state.filter} placeholder="搜索接口" />
        <Button
          type="primary"
          onClick={() => this.changeModal('add_cat_modal_visible', true)}
          className="btn-filter"
        >
          添加分类
        </Button>
        {this.state.visible ? (
          <Modal
            title="添加接口"
            visible={this.state.visible}
            onCancel={() => this.changeModal('visible', false)}
            footer={null}
            className="addcatmodal"
          >
            <AddInterfaceForm
              catdata={this.props.curProject.cat}
              catid={this.state.curCatid}
              onCancel={() => this.changeModal('visible', false)}
              onSubmit={this.handleAddInterface}
            />
          </Modal>
        ) : (
          ''
        )}

        {this.state.add_cat_modal_visible ? (
          <Modal
            title="添加分类"
            visible={this.state.add_cat_modal_visible}
            onCancel={() => this.changeModal('add_cat_modal_visible', false)}
            footer={null}
            className="addcatmodal"
          >
            <AddInterfaceCatForm
              category={this.state.list}
              catdata={this.state.curCatdata}
              onCancel={() => this.changeModal('add_cat_modal_visible', false)}
              onSubmit={this.handleAddInterfaceCat}
            />
          </Modal>
        ) : (
          ''
        )}

        {this.state.change_cat_modal_visible ? (
          <Modal
            title="修改分类"
            visible={this.state.change_cat_modal_visible}
            onCancel={() => this.changeModal('change_cat_modal_visible', false)}
            footer={null}
            className="addcatmodal"
          >
            <AddInterfaceCatForm
              category={this.state.list}
              catdata={this.state.curCatdata}
              onCancel={() => this.changeModal('change_cat_modal_visible', false)}
              onSubmit={this.handleChangeInterfaceCat}
            />
          </Modal>
        ) : (
          ''
        )}
      </div>
    );
    const defaultExpandedKeys = () => {
      const { router, inter, list } = this.props,
        rNull = { expands: [], selects: [] };
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
            selects: [inter._id + '']
          };
        } else {
          let catid = router.params.actionId.substr(4);
          return {
            expands: this.state.expands ? this.state.expands : ['cat_' + catid],
            selects: ['cat_' + catid]
          };
        }
      } else {
        return {
          expands: this.state.expands ? this.state.expands : ['cat_' + list[0]._id],
          selects: ['root']
        };
      }
    };

    let currentKes = defaultExpandedKeys();
    let menuList = this.state.list;
    return (
      <div>
        {searchBox}
        {menuList.length > 0 ? (
          <div
              className="tree-wrappper"
              style={{ maxHeight: parseInt(document.body.clientHeight) - headHeight + 'px' }}
          >
            <Tree
                className="interface-list"
                defaultExpandedKeys={currentKes.expands}
                defaultSelectedKeys={currentKes.selects}
                expandedKeys={currentKes.expands}
                selectedKeys={currentKes.selects}
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                onDrop={this.onDrop}
                autoExpandParent
                showLine
                draggable
            >
              <TreeNode
                className="item-all-interface"
                title={
                  <Link
                    onClick={e => {
                      e.stopPropagation();
                      this.changeExpands();
                    }}
                    to={'/project/' + matchParams.id + '/interface/api'}
                  >
                    <Icon type="folder" style={{ marginRight: 5 }} />
                    全部接口
                  </Link>
                }
                key="root"
              />
              {
                this.renderTree(menuList)
              }
            </Tree>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(InterfaceMenu);
