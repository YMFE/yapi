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
import _ from 'underscore'

import './interfaceMenu.scss';

const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const headHeight = 240; // menu顶部到网页顶部部分的高度
const limit = 20;

@connect(
  state => {
    return {
      list: state.inter.list,
      inter: state.inter.curdata,
      curProject: state.project.currProject,
      expands: []
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
      add_sub_cat_modal_visible: false,
      curCatdata: {},
      expands: null,
      canFilter: true, //触发过滤条件
      list: []
    };
    this.draftList = []
    this.onFilter = _.debounce(this.onFilter, 500)
  }

  handleRequest() {
    this.props.initInterface();
    this.getList();
  }

  switchList(_list) {
    let list = _list.filter((item) => {
      let childs = _list.filter(child => {
        return item._id === child.parent_id
      })
      if (childs && childs.length > 0) {
        item.children = childs
      }
      return !item.parent_id
    })
    return list
  }

  async getList() {
    let r = await this.props.fetchInterfaceListMenu(this.props.projectId);
    let _list = r.payload.data.data
    let list = this.switchList(_list)
    this.draftList = JSON.parse(JSON.stringify(list))
    this.setState({ list });
  }




  componentWillMount() {
    this.handleRequest();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      // console.log('next', nextProps.list)
      this.setState({
        list: this.switchList(nextProps.list)
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
        add_cat_modal_visible: false,
        add_sub_cat_modal_visible: false
      });
    });
  };

  handleChangeInterfaceCat = data => {
    data.project_id = this.props.projectId;

    let params = {
      catid: this.state.curCatdata._id,
      name: data.name,
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
        await that.props.getProject(that.props.projectId)
        await that.props.fetchInterfaceCatList({ catid, limit, page: 1 });
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

  showDelCatConfirm = catid => {
    let that = this;
    const ref = confirm({
      title: '确定删除此接口分类吗？',
      content: '温馨提示：该操作会删除该分类下所有接口，接口删除后无法恢复',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await that.props.deleteInterfaceCatData(catid, that.props.projectId);
        await that.getList();
        await that.props.getProject(that.props.projectId)
        await that.props.fetchInterfaceList({ project_id: that.props.projectId });
        that.props.history.push('/project/' + that.props.match.params.id + '/interface/api');
        ref.destroy();
      },
      onCancel() { }
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

  onFilter = () => {
    this.setState({
      canFilter: true,
      list: JSON.parse(JSON.stringify(this.draftList))
    });
  }

  onSearchChange = (e) => {
    e.persist();
    this.setState({
      canFilter: false,
      filter: e.target.value
    });
    this.onFilter(e.target.value);
  }

  onExpand = e => {
    this.setState({
      expands: e
    });
  };

  onDrop = async e => {
    let { node, dragNode } = e;
    let nodeArray = node.props.pos.split('-') //目的node层级
    const id = node.props.eventKey;
    const dragId = dragNode.props.eventKey;

    //目标是文件夹，就插入到文件夹里面
    if (id.indexOf('cat_') >= 0) {
      //如果是拖拽到目标节点前后
      if (!node.props.dragOver) {
        //接口不能在一级目录
        if (nodeArray.length <= 2 && dragId.indexOf('cat_') === -1) {
          message.warning('接口只能在分类中');
          return
        }

        let sort = node.props.dragOverGapTop ? -1 : 1
        let params = {
          catid: id.split('_')[1],
          dragId,
          sort
        }
        axios.post('/api/interface/up_pid_or_cid', params).then(res => {
          if (res.data.errcode !== 0) {
            return message.error(res.data.errmsg);
          }
          message.success('移动成功');
          this.getList();
        });
        return
      }
      //拖拽是文件夹
      if (dragId.indexOf('cat_') >= 0) {
        let params = {
          catid: dragId.split('_')[1],
          parent_id: id.split('_')[1]
        };
        axios.post('/api/interface/up_cat_pid', params).then(res => {
          if (res.data.errcode !== 0) {
            return message.error(res.data.errmsg);
          }
          message.success('分类移动成功');
          this.getList();
        });
      } else {
        //拖拽是接口
        let params = {
          catid: id.split('_')[1],
          id: dragId
        };
        axios.post('/api/interface/up_catid', params).then(res => {
          if (res.data.errcode !== 0) {
            return message.error(res.data.errmsg);
          }
          message.success('接口移动成功');
          this.getList();
        });
      }
    } else {
      //如果是拖拽到目标节点前后
      if (!node.props.dragOver) {
        let sort = node.props.dragOverGapTop ? -1 : 1
        let params = {
          id,
          dragId,
          sort
        }
        axios.post('/api/interface/up_pid_or_cid', params).then(res => {
          if (res.data.errcode !== 0) {
            return message.error(res.data.errmsg);
          }
          message.success('移动成功');
          this.getList();
        });
        return
      }
    }

  };


  //递归过滤list
  treeFilter = (tree, func) => {
    return tree.filter(node => {
      node.children = node.children && this.treeFilter(node.children, func)
      return func(node) || (node.children && node.children.length)
    })
  }

  // 数据过滤
  filterList = list => {
    let that = this;
    let arr = [];
    //过滤节点
    function nodefilter(node) {
      let interfaceFilter = false;
      let _filter = that.state.filter
      if (node.name.indexOf(_filter) === -1) {
        node.list = node.list.filter(inter => {
          if (
            inter.title.indexOf(_filter) === -1 &&
            inter.path.indexOf(_filter) === -1
          ) {
            return false;
          }
          arr.push('cat_' + node._id)
          interfaceFilter = true
          return true;
        });
        return interfaceFilter === true
      }
      arr.push('cat_' + node._id)
      return true;
    }

    let menuList = this.treeFilter(list, nodefilter)

    return { menuList, arr };
  };


  render() {
    const matchParams = this.props.match.params;
    // let menuList = this.state.list;
    const searchBox = (
      <div className="interface-filter">
        <Input onChange={this.onSearchChange} value={this.state.filter} placeholder="搜索分类/接口" />
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
              catdata={this.state.curCatdata}
              onCancel={() => this.changeModal('change_cat_modal_visible', false)}
              onSubmit={this.handleChangeInterfaceCat}
            />
          </Modal>
        ) : (
          ''
        )}
        {this.state.add_sub_cat_modal_visible && (
          <Modal
            title="添加子分类"
            visible={this.state.add_sub_cat_modal_visible}
            onCancel={() => this.changeModal('add_sub_cat_modal_visible', false)}
            footer={null}
            className="addcatmodal"
          >
            <AddInterfaceCatForm
              isSubCat
              catdata={this.state.curCatdata}
              onCancel={() => this.changeModal('add_sub_cat_modal_visible', false)}
              onSubmit={this.handleAddInterfaceCat}
            />
          </Modal>
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

    const itemInterfaceCreate = item => {
      return (
        <TreeNode
          title={
            <div
              className="container-title"
              onMouseEnter={() => this.enterItem(item._id)}
              onMouseLeave={this.leaveItem}
            >
              <Link
                className="interface-item"
                onClick={e => e.stopPropagation()}
                to={'/project/' + matchParams.id + '/interface/api/' + item._id}
              >
                {item.title}
              </Link>
              <div className="btns">
                <Tooltip title="删除接口">
                  <Icon
                    type="delete"
                    className="interface-delete-icon"
                    onClick={e => {
                      e.stopPropagation();
                      this.showConfirm(item);
                    }}
                    style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }}
                  />
                </Tooltip>
                <Tooltip title="复制接口">
                  <Icon
                    type="copy"
                    className="interface-delete-icon"
                    onClick={e => {
                      e.stopPropagation();
                      this.copyInterface(item._id);
                    }}
                    style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }}
                  />
                </Tooltip>
              </div>
              {/*<Dropdown overlay={menu(item)} trigger={['click']} onClick={e => e.stopPropagation()}>
            <Icon type='ellipsis' className="interface-delete-icon" style={{ opacity: this.state.delIcon == item._id ? 1 : 0 }}/>
          </Dropdown>*/}
            </div>
          }
          key={'' + item._id}
        />
      );
    };


    /**
     * 递归生产左侧多级菜单
     * @param {*} menuList 
     */
    const renderItemLoop = menuList => {
      return menuList.map(item => {
        return (
          <TreeNode
            title={
              <div
                className="container-title"
                onMouseEnter={() => this.enterItem(item._id)}
                onMouseLeave={this.leaveItem}
              >
                <Link
                  className="interface-item"
                  onClick={e => {
                    e.stopPropagation();
                    this.changeExpands();
                  }}
                  to={'/project/' + matchParams.id + '/interface/api/cat_' + item._id}
                >
                  <Icon type="folder-open" style={{ marginRight: 5 }} />
                  {item.name}
                </Link>
                <div className="btns">
                  <Tooltip title="删除分类">
                    <Icon
                      type="delete"
                      className="interface-delete-icon"
                      onClick={e => {
                        e.stopPropagation();
                        this.showDelCatConfirm(item._id);
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
                        this.changeModal('change_cat_modal_visible', true);
                        this.setState({
                          curCatdata: item
                        });
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="添加接口">
                    <Icon
                      type="plus"
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
                      type="addfolder"
                      className="interface-delete-icon"
                      onClick={e => {
                        e.stopPropagation();
                        this.changeModal('add_sub_cat_modal_visible', true);
                        this.setState({
                          curCatdata: item
                        });
                      }}
                      style={{ display: this.state.delIcon == item._id ? 'block' : 'none' }}
                    />
                  </Tooltip>
                </div>

                {/*<Dropdown overlay={menu(item)} trigger={['click']} onClick={e => e.stopPropagation()}>
        <Icon type='ellipsis' className="interface-delete-icon" />
      </Dropdown>*/}
              </div>
            }
            key={'cat_' + item._id}
            className={`interface-item-nav ${item.list.length || item.children ? '' : 'cat_switch_hidden'}`}
          >
            {item.children && item.children.length && renderItemLoop(item.children)}
            {item.list.map(itemInterfaceCreate)}
          </TreeNode>
        );
      })
    };

    let currentKes = defaultExpandedKeys();
    let menuList;
    if (this.state.filter && this.state.canFilter) {
      let res = this.filterList(this.state.list)
      menuList = res.menuList;
      currentKes.expands = res.arr;
    } else {
      menuList = this.state.list;
    }

    return (
      <div>
        {searchBox}
        {this.state.list.length > 0 ? (
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
              draggable
              onDrop={this.onDrop}
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
              {renderItemLoop(menuList)}
            </Tree>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(InterfaceMenu);
