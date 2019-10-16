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
  initInterface,
  queryCatAndInterface
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
  (state) => {
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
    fetchInterfaceList,
    queryCatAndInterface
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
    fetchInterfaceList: PropTypes.func,
    queryCatAndInterface: PropTypes.func
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
      curCatid: -1,
      add_cat_modal_visible: false,
      change_cat_modal_visible: false,
      del_cat_modal_visible: false,
      curCatdata: {},
      filter: '',
      expands: [],
      selects: ['root'],
      loadedKeysSet: [],
      list: [],
      currentSelectNode: {}
    };
  }

  handleRequest() {
    this.props.initInterface();
    this.getList();
  }

  async getList(getChild = false) {
    let r = await this.props.fetchInterfaceListMenu(
      this.props.projectId,
      this.state.curCatid,
      getChild
    );
    if (!getChild) {
      this.setState({
        list: r.payload.data.data
      });
    } else {
      return r.payload.data.data;
    }
  }

  componentDidMount() {
    this.handleRequest();
    // 监听在接口列表添加接口后的路由变化，刷新子目录，通过监听路由来同步同级路由的状态
    this.props.history.listen((location) => {
      if (location.search.indexOf('addApiFromList') > -1) {
        this.reloadColMenuList();
      }
    })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      this.setState({
        list: nextProps.list
      });
    }
  }

  async doInterfaceSearch() {
    if(this.state.filter === '') {
      this.setState({
        curCatid: -1
      }, async()=>{
        this.reloadColMenuList();
      })
    } else {
      this.setState({
        list: [],
        expands: [],
        selects: []
      })
      let r = await this.props.queryCatAndInterface({
        project_id: Number(this.props.projectId),
        query_text: this.state.filter
      });
      const data = r.payload.data.data;
      if (data.length === 0) {
        message.info('搜索结果为空')
      }
      this.setState({
        list: data
      });
    }
  }

  // e:{selected: bool, selectedNodes, node, event}
  onSelect = (selectedKeys, e) => {
    const { history, match } = this.props;
    let curkey = selectedKeys[0] ? selectedKeys[0] : 'root';
    const curNode = e.selectedNodes[0];
    let catId = null;

    if (!curkey || !selectedKeys) {
      return false;
    }
    let basepath = '/project/' + match.params.id + '/interface/api';
    if (curkey === 'root') {
      catId = -1;
      history.push(basepath);
    } else {
      catId = curNode.props.child_type === 0 ? curNode.props._id : curNode.props.catid;
      history.push(basepath + '/' + curkey);
    }
    this.setState({
      currentSelectNode: curNode,
      curCatid: catId,
      selects: [curkey]
    });
  };

  changeExpands = () => {
    this.setState({
      expands: null
    });
  };

  copyInterface = async (id) => {
    let interfaceData = await this.props.fetchInterfaceData(id);
    let data = interfaceData.payload.data.data;
    let newData = produce(data, (draftData) => {
      draftData.title = draftData.title + '_copy';
      draftData.path = draftData.path + '_' + Date.now();
    });
    axios.post('/api/interface/add', newData).then((res) => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口复制成功');
      let interfaceId = res.data.data._id;
      this.props.history.push(
        '/project/' + this.props.projectId + '/interface/api/' + interfaceId
      );
      this.setState({
        visible: false,
        list: [],
        curCatid: -1
      });
      this.changeExpands();
      this.getList();
      this.props.fetchInterfaceList({
        project_id: this.props.projectId
      });
      // this.changeExpands();
    });
  };


  handleAddInterface = (data, cb) => {
    data.project_id = this.props.projectId;
    axios.post('/api/interface/add', data).then((res) => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口添加成功');
      let interfaceId = res.data.data._id;
      this.props.history.push(
        '/project/' + this.props.projectId + '/interface/api/' + interfaceId
      );
      this.setState({
        visible: false
      });
      this.reloadColMenuList();
      if (cb) {
        cb();
      }
    });
  };

  handleAddInterfaceCat = (data) => {
    data.project_id = this.props.projectId;
    data.parent_id = this.state.curCatid;
    axios.post('/api/interface/add_cat', data).then((res) => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口分类添加成功');
      this.setState({
        add_cat_modal_visible: false
      });
      // this.props.getProject(data.project_id);
      this.reloadColMenuList();

    });
  };

  handleChangeInterfaceCat = (data) => {
    data.project_id = this.props.projectId;

    let params = {
      catid: this.state.curCatdata._id,
      name: data.name,
      desc: data.desc
    };

    axios.post('/api/interface/up_cat', params).then((res) => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口分类更新成功');
      this.props.getProject(data.project_id);
      let currentNode = this.state.currentSelectNode;
      currentNode.name = data.name;
      this.setState({
        change_cat_modal_visible: false
      });
    });
  };

  showConfirm = (data) => {
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
        that.changeExpands();
        that.setState({
          curCatid: -1,
          list: []
        }, async () => {
          await that.getList();
          await that.props.fetchInterfaceList({
            project_id: that.props.projectId
          });
        })
        that.props.history.push(
          '/project/' +
          that.props.match.params.id +
          '/interface/api/cat_' +
          catid
        );
        ref.destroy();
      },
      onCancel() {
        ref.destroy();
      }
    });
  };

  showDelCatConfirm = (catid) => {
    let that = this;
    const ref = confirm({
      title: '确定删除此接口分类吗？',
      content: '温馨提示：该操作会删除该分类下所有接口，接口删除后无法恢复',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await that.props.deleteInterfaceCatData(catid, that.props.projectId);
        that.changeExpands();
        that.setState({
          curCatid: -1
        }, async () => {
          await that.getList();
          await that.props.fetchInterfaceList({
            project_id: that.props.projectId
          });
        })
        that.props.history.push(
          '/project/' + that.props.match.params.id + '/interface/api'
        );
        ref.destroy();
      },
      onCancel() { }
    });
  };

  enterItem = (id) => {
    this.setState({ delIcon: id });
  };

  leaveItem = () => {
    this.setState({ delIcon: null });
  };

  onInputChange = (e) => {
    this.setState({
      filter: e.target.value
    });
  };
  onExpand = (keys) => {
    this.setState({
      expands: keys
    });
  };

  onDrop = async (e) => {
    const dropCatIndex = e.node.props.pos.split('-')[1] - 1;
    const dragCatIndex = e.dragNode.props.pos.split('-')[1] - 1;
    if (dropCatIndex < 0 || dragCatIndex < 0) {
      return;
    }
    const { list } = this.props;
    const dropCatId = this.props.list[dropCatIndex]._id;
    const id = e.dragNode.props.eventKey;
    const dragCatId = this.props.list[dragCatIndex]._id;

    const dropPos = e.node.props.pos.split('-');
    const dropIndex = Number(dropPos[dropPos.length - 1]);
    const dragPos = e.dragNode.props.pos.split('-');
    const dragIndex = Number(dragPos[dragPos.length - 1]);

    if (id.indexOf('cat') === -1) {
      if (dropCatId === dragCatId) {
        // 同一个分类下的接口交换顺序
        let colList = list[dropCatIndex].list;
        let changes = arrayChangeIndex(colList, dragIndex, dropIndex);
        axios.post('/api/interface/up_index', changes).then();
      } else {
        await axios.post('/api/interface/up', { id, catid: dropCatId });
      }
      // const { projectId, router } = this.props;
      // this.props.fetchInterfaceListMenu(projectId);
      // this.props.fetchInterfaceList({ project_id: projectId });
      this.reloadColMenuList();
      // if (router && isNaN(router.params.actionId)) {
        // 更新分类list下的数据
        // let catid = router.params.actionId.substr(4);
        // this.props.fetchInterfaceCatList({ catid });
      // }
    } else {
      // 分类之间拖动
      let changes = arrayChangeIndex(list, dragIndex - 1, dropIndex - 1);
      axios.post('/api/interface/up_cat_index', changes).then();
      this.reloadColMenuList();
      // this.props.fetchInterfaceListMenu(this.props.projectId);
    }
  };
  // 数据过滤
  filterList = (list) => {
    // let that = this;
    let arr = [];
    let menuList = produce(list, (draftList) => {
      draftList.filter(() => {
        //   let interfaceFilter = false;
        //   // arr = [];
        //   if (item.name.indexOf(that.state.filter) === -1) {
        //     item.list = item.list.filter((inter) => {
        //       if (
        //         inter.title.indexOf(that.state.filter) === -1 &&
        //         inter.path.indexOf(that.state.filter) === -1
        //       ) {
        //         return false;
        //       }
        //       //arr.push('cat_' + inter.catid)
        //       interfaceFilter = true;
        //       return true;
        //     });
        //     arr.push('cat_' + item._id);
        //     return interfaceFilter === true;
        //   }
        //   arr.push('cat_' + item._id);
        return true;
      });
    });
    return { menuList, arr };
  };

  itemInterfaceColTitle(item) {
    return (
      <div
        className="container-title"
        onMouseEnter={() => { this.enterItem('cat_' + item._id) }}
        onMouseLeave={this.leaveItem}
      >
        <Link
          className="interface-item"
          onClick={() => {
            // e.stopPropagation();
            // this.changeExpands();
            this.setState({
              curCatid: Number(item._id)
            });
          }}
          to={'/project/' + this.props.match.params.id + '/interface/api/cat_' + item._id}
        >
          <Icon type="folder-open" style={{ marginRight: 5 }} />
          {item.name}
        </Link>
        <div className="btns interface-btns">
          <Tooltip title="删除分类">
            <Icon
              type="delete"
              className="interface-delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                this.showDelCatConfirm(item._id);
                this.setState({
                  curCatid: Number(item._id),
                  currentSelectNode: item
                });
              }}
              style={{
                display: this.state.delIcon == 'cat_' + item._id ? 'block' : 'none'
              }}
            />
          </Tooltip>
          <Tooltip title="修改分类">
            <Icon
              type="edit"
              className="interface-delete-icon"
              style={{
                display: this.state.delIcon == 'cat_' + item._id ? 'block' : 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                this.changeModal('change_cat_modal_visible', true);
                this.setState({
                  curCatdata: item,
                  currentSelectNode: item,
                  curCatid: Number(item._id)
                });
              }}
            />
          </Tooltip>
          <Tooltip title="添加接口">
            <Icon
              type="plus"
              className="interface-delete-icon"
              style={{
                display: this.state.delIcon == 'cat_' + item._id ? 'block' : 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                this.setState({
                  curCatid: Number(item._id),
                  currentSelectNode: item
                }, () => {
                  this.changeModal('visible', true);
                });
              }}
            />
          </Tooltip>
        </div>

        {/*<Dropdown overlay={menu(item)} trigger={['click']} onClick={e => e.stopPropagation()}>
              <Icon type='ellipsis' className="interface-delete-icon" />
            </Dropdown>*/}
      </div>
    );
  }

  itemInterfaceCreateTitle(item) {
    return (
      <div
        className="container-title"
        onMouseEnter={() => {
          this.enterItem(item._id)
        }}
        // onMouseEnter={()=>{this.enterItem(item._id)}}
        onMouseLeave={this.leaveItem}
      >
        <Link
          className="interface-item"
          // onClick={(e) => e.stopPropagation()}
          to={'/project/' + this.props.match.params.id + '/interface/api/' + item._id}
        >
          {item.title}
        </Link>
        <div className="btns interface-btns">
          <Tooltip title="删除接口">
            <Icon
              type="delete"
              className="interface-delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                this.showConfirm(item);
              }}
              style={{
                display: this.state.delIcon == item._id ? 'block' : 'none'
              }}
            />
          </Tooltip>
          <Tooltip title="复制接口">
            <Icon
              type="copy"
              className="interface-delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                this.copyInterface(item._id);
              }}
              style={{
                display: this.state.delIcon == item._id ? 'block' : 'none'
              }}
            />
          </Tooltip>
        </div>
        {/*<Dropdown overlay={menu(item)} trigger={['click']} onClick={e => e.stopPropagation()}>
          <Icon type='ellipsis' className="interface-delete-icon" style={{ opacity: this.state.delIcon == item._id ? 1 : 0 }}/>
        </Dropdown>*/}
      </div>
    );
  }
  // 动态加载子节点数据
  onLoadData = (treeNode) => {
    const id = (!treeNode.props) ? treeNode._id : treeNode.props._id;
    const catid = (!treeNode.props) ? treeNode.parent_id : treeNode.props.parent_id;
    const child_type = (!treeNode.props) ? treeNode.child_type : treeNode.props.child_type;
    const getCurCatId = child_type === 0 ? id : catid;
    return new Promise((resolve) => {
      let childrenList = [];
      // setState异步更新
      this.setState({
        curCatid: getCurCatId
      }, async () => {
        childrenList = await this.getList(true);
        if (treeNode.props) {
          treeNode.props.dataRef.children = [...childrenList];
        } else {
          treeNode.children = [...childrenList];
        }
        this.setState({
          currentSelectNode: treeNode
        })
        resolve()
      });
    }).catch(err => {
      console.log(err.message);
    })
  };

  // 子节点渲染 0 文件夹 1 接口
  renderTreeNodes = (data) => {
    //  const data = props.data;
    return data.map((item) => {
      if (item.child_type === 0) {
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode
              key={'cat_' + item._id}
              {...item}
              title={this.itemInterfaceColTitle(item)}
              dataRef={item}
              className='interface-item-nav'
            >
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={'cat_' + item._id}
            {...item}
            title={this.itemInterfaceColTitle(item)}
            dataRef={item}
            className='interface-item-nav'
          // className={`interface-item-nav ${
          //   item.list.length ? '' : 'cat_switch_hidden'
          // }`
          // }
          />
        );
      } else {
        return (
          <TreeNode
            key={item._id}
            {...item}
            title={this.itemInterfaceCreateTitle(item)}
            dataRef={item}
            isLeaf={true}
          />
        );
      }
    });
  };
  reloadColMenuList = () => {
    this.setState(
      {
        curCatid: -1,
        list: [],
        selects: []
      },
      async () => {
        await this.getList();
        let expandIds = this.state.expands.map((item) => {
          return Number(item.split('_')[1]);
        });
        let newList = [...this.state.list];
        let updateNode = (list) => {
          for (let i = 0; i < list.length; i++) {
            if (list[i].child_type === 0) {
              if (expandIds.indexOf(list[i]._id) > -1) {
                this.onLoadData(list[i]);
              }
            }
            if (list[i].children) {
              updateNode(list[i].children);
            }
          }
        };
        updateNode(newList);
        this.setState({
          list: [...newList]
        });
      }
    );
  };
  // reloadColMenuList = () => {
  //   // 把当前需要更新且已经加载的目录从已加载目录中删除,解决目录已经打开不会重新onload
  //   if (this.state.curCatid !== -1) {
  //     const curParentKey = 'cat_' + this.state.currentSelectNode.parent_id;
  //     let arr = this.state.expands ? this.state.expands.slice(0) : [];
  //     const newLoadKeys = arr.splice(arr.indexOf(curParentKey), 1);
  //     this.onLoadData(this.state.currentSelectNode);
  //     this.setState({
  //       expands: [...this.state.expands, this.state.currentSelectNode.key, curParentKey, newLoadKeys]
  //     })
  //   } else {
  //     this.changeExpands();
  //     this.getList();
  //   }
  // }


  render() {
    const matchParams = this.props.match.params;
    const searchBox = (
      <div className="interface-filter">
        <Input
          onChange={this.onInputChange}
          value={this.state.filter}
          placeholder="搜索接口/分类"
        />
        <Button
          type="primary"
          onClick={
            () => {
              this.doInterfaceSearch();
            }
          }
          className="btn-filter interface-search-bt"
        >
          搜索
        </Button>
        <Button
          type="primary"
          onClick={
            () => {
              // 选中目录才可以添加
              if (this.state.currentSelectNode && this.state.currentSelectNode.props && this.state.currentSelectNode.props.child_type === 1) {
                message.error('接口不可再添加分类');
              } else {
                this.changeModal('add_cat_modal_visible', true);
              }
            }
          }
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
              onCancel={() =>
                this.changeModal('change_cat_modal_visible', false)
              }
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
            expands: this.state.expands
              ? this.state.expands
              : ['cat_' + inter.catid],
            selects: this.state.selects ? this.state.selects : [inter._id + '']
          };
        } else {
          let catid = router.params.actionId.substr(4);
          return {
            expands: this.state.expands ? this.state.expands : ['cat_' + catid],
            selects: this.state.selects ? this.state.selects : ['cat_' + catid]
          };
        }
      } else {
        return {
          expands: this.state.expands
            ? this.state.expands
            : ['cat_' + list[0]._id],
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
            style={{
              maxHeight:
                parseInt(document.body.clientHeight) - headHeight + 'px'
            }}
          >
            <Tree
              className="interface-list"
              loadData={this.onLoadData}
              autoExpandParent={false}
              // loadedKeys={this.state.loadedKeysSet}
              defaultExpandedKeys={currentKes.expands}
              defaultSelectedKeys={currentKes.selects}
              expandedKeys={currentKes.expands}
              selectedKeys={currentKes.selects}
              onSelect={this.onSelect}
              onExpand={this.onExpand}
              draggable={true}
              onDrop={this.onDrop}
              expandAction={false}
            >
              <TreeNode
                className="item-all-interface"
                isLeaf={true}
                title={
                  <Link
                    onClick={(e)=> {
                      e.stopPropagation();
                      this.setState({
                        curCatid: Number(-1)
                      });
                    }}
                    to={'/project/' + matchParams.id + '/interface/api'}
                  >
                    <Icon type="folder" style={{ marginRight: 5 }} />
                    全部接口
                  </Link>
                }
                key="root"
              />
              {this.renderTreeNodes(menuList)}
            </Tree>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(InterfaceMenu);
