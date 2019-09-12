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
  (state) => {
    return {
      list: state.inter.list,
      inter: state.inter.curdata,
      curProject: state.project.currProject,
      expands: [],
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
      curCatid: -1,
      add_cat_modal_visible: false,
      change_cat_modal_visible: false,
      del_cat_modal_visible: false,
      curCatdata: {},
      expands: [],
      selects: ['root'],
      // loadedKeysSet: [],
      list: [],
      currentSelectNode: {}
    };
  }

  handleRequest() {
    this.props.initInterface();
    this.getList();
  }

  async getList(getChild = false) {
    console.log("opppppp", this.state.curCatid)
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

  componentWillMount() {
    this.handleRequest();
  }
  componentDidMount(){
    // 监听在接口列表添加接口后的路由变化，刷新子目录，通过监听路由来同步同级路由的状态
    this.props.history.listen((location, action)=>{
      console.log('监听路由变化')
      console.log(location)
      console.log(action)
      if(location.search.indexOf('addApiFromList') > -1) {
        this.reloadCurParentList();
      }
     })
    }
  componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      // console.log('next', nextProps.list)
      this.setState({
        list: nextProps.list
      });
    }
  }

  // e:{selected: bool, selectedNodes, node, event}
  onSelect = (selectedKeys, e) => {
    console.log(e.selectedNodes);
    console.log("sssssssssss");
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
      curNode.props.child_type === 0 ? curNode.props._id : curNode.props.catid;
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
  reloadCurParentList = () => {
    // 把当前需要更新且已经加载的目录从已加载目录中删除,解决目录已经打开不会重新onload
    console.log('@@@@@',this.state.currentSelectNode)
    console.log('322^^^^^^',this.state.curCatid)
    if (this.state.curCatid !== -1 && this.state.selects[0]!== 'root') {
      console.log("hhahahg")
      console.log(this.state.currentSelectNode)
      console.log(this.state.curCatid)
      const curParentKey = 'cat_'+ this.state.currentSelectNode.props.parent_id;
      let arr = this.state.expands.slice(0);
      const newLoadKeys = arr.splice(arr.indexOf(curParentKey), 1);
      this.onLoadData(this.state.currentSelectNode);
      this.setState({
        expands: [...this.state.expands, this.state.currentSelectNode.key, curParentKey],
      })
    } else {
     this.getList();
     console.log("gogogogogo")
    //  this.setState({
    //    expands: null
    //  })      
    }
  }
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
      this.reloadCurParentList();
      this.setState({
        visible: false,
      });
      if (cb) {
        cb();
      }
    });
  };

  handleAddInterfaceCat = (data) => {
    data.project_id = this.props.projectId;
    data.parent_id = this.state.selects.indexOf('root') > -1 ?  -1 : this.state.curCatid;
    axios.post('/api/interface/add_cat', data).then((res) => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口分类添加成功');
      this.props.getProject(data.project_id);
      if(this.curCatid !== -1) {
        this.reloadCurParentList();
      }
      this.setState({
        add_cat_modal_visible: false,
      });
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
      this.reloadCurParentList();
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
        await that.getList();
        await that.props.fetchInterfaceCatList({ catid });
        ref.destroy();
        that.props.history.push(
          '/project/' +
            that.props.match.params.id +
            '/interface/api/cat_' +
            catid
        );
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
        await that.getList();
        // await that.props.getProject(that.props.projectId)
        await that.props.fetchInterfaceList({
          project_id: that.props.projectId
        });
        that.props.history.push(
          '/project/' + that.props.match.params.id + '/interface/api'
        );
        ref.destroy();
      },
      onCancel() {}
    });
  };

  copyInterface = async (id) => {
    let interfaceData = await this.props.fetchInterfaceData(id);
    // let data = JSON.parse(JSON.stringify(interfaceData.payload.data.data));
    // data.title = data.title + '_copy';
    // data.path = data.path + '_' + Date.now();
    let data = interfaceData.payload.data.data;
    let newData = produce(data, (draftData) => {
      draftData.title = draftData.title + '_copy';
      draftData.path = draftData.path + '_' + Date.now();
    });

    axios.post('/api/interface/add', newData).then(async (res) => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口添加成功');
      let interfaceId = res.data.data._id;
      await this.getList();
      this.props.history.push(
        '/project/' + this.props.projectId + '/interface/api/' + interfaceId
      );
      this.setState({
        visible: false
      });
    });
  };

  enterItem = (id) => {
    this.setState({ delIcon: id });
  };

  leaveItem = () => {
    this.setState({ delIcon: null });
  };

  onFilter = (e) => {
    this.setState({
      filter: e.target.value,
      list: JSON.parse(JSON.stringify(this.props.list))
    });
  };

  onExpand = (e) => {
    this.setState({
      expands: e
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
      const { projectId, router } = this.props;
      this.props.fetchInterfaceListMenu(projectId);
      this.props.fetchInterfaceList({ project_id: projectId });
      if (router && isNaN(router.params.actionId)) {
        // 更新分类list下的数据
        let catid = router.params.actionId.substr(4);
        this.props.fetchInterfaceCatList({ catid });
      }
    } else {
      // 分类之间拖动
      let changes = arrayChangeIndex(list, dragIndex - 1, dropIndex - 1);
      axios.post('/api/interface/up_cat_index', changes).then();
      this.props.fetchInterfaceListMenu(this.props.projectId);
    }
  };
  // 数据过滤
  filterList = (list) => {
    let that = this;
    let arr = [];
    let menuList = produce(list, (draftList) => {
      draftList.filter((item) => {
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
  
 
  itemInterfaceColTitle (item){
    // const item = props.item;
    return (
      <div
        className="container-title"
        onClick={() => this.enterItem(item._id)}
        onMouseLeave={this.leaveItem}
      >
        <Link
          className="interface-item"
          onClick={(e) => {
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
        <div className="btns">
          <Tooltip title="删除分类">
            <Icon
              type="delete"
              className="interface-delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                this.showDelCatConfirm(item._id);
              }}
              style={{
                display: this.state.delIcon == item._id ? 'block' : 'none'
              }}
            />
          </Tooltip>
          <Tooltip title="修改分类">
            <Icon
              type="edit"
              className="interface-delete-icon"
              style={{
                display: this.state.delIcon == item._id ? 'block' : 'none'
              }}
              onClick={(e) => {
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
              style={{
                display: this.state.delIcon == item._id ? 'block' : 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                this.setState({
                  curCatid: Number(item._id)
                }, ()=> {
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
      // }
    );
  };

  itemInterfaceCreateTitle(item) {
    return (
      <div
        className="container-title"
        onMouseEnter={() => this.enterItem(item._id)}
        onMouseLeave={this.leaveItem}
      >
        <Link
          className="interface-item"
          onClick={(e) => e.stopPropagation()}
          to={'/project/' + this.props.match.params.id + '/interface/api/' + item._id}
        >
          {item.title}
        </Link>
        <div className="btns">
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
  };
   // 动态加载子节点数据
 onLoadData = (treeNode) => {
  console.log(treeNode.props._id);
  console.log('tree',treeNode);
  const getCurCatId = treeNode.props.child_type === 0 ? treeNode.props._id : treeNode.props.catid;
   return new Promise((resolve) => {
     let childrenList = [];
    //  if (treeNode.props.children) {
    //     resolve();
    //    return;
    //  }
     console.log("eeeeee")
     // setState异步更新
     this.setState({
      curCatid: getCurCatId
     }, async()=>{
      childrenList = await this.getList(true);
      console.log('更新孩子----')
      treeNode.props.dataRef.children = [...childrenList];
      this.setState({
        currentSelectNode: treeNode
      })
      console.log('更新孩子11----',treeNode)
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
       if (item.children) {
         return (
           <TreeNode 
             title={this.itemInterfaceColTitle(item)}
             key={'cat_'+item._id}
             {...item}
             dataRef={item}
             className =  'interface-item-nav'
           >
             {this.renderTreeNodes(item.children)}
           </TreeNode>
         );
       }
       return (
         <TreeNode
           title={this.itemInterfaceColTitle(item)}
           key={'cat_'+item._id}
           {...item}
           dataRef={item}
           className =  'interface-item-nav'
           // className={`interface-item-nav ${
           //   item.list.length ? '' : 'cat_switch_hidden'
           // }`
           // }
         />
       );
     }
     return (
       <TreeNode
         title={this.itemInterfaceCreateTitle(item)}
         key={item._id}
         {...item}
         dataRef={item}
         isLeaf = {true}
         className =  'interface-item-nav cat_switch_hidden'
         // className={`interface-item-nav ${
         //   item.list.length ? '' : 'cat_switch_hidden'
         // }`
         // }
       />
     );
   });
 };


  render() {
    const matchParams = this.props.match.params;
    const searchBox = (
      <div className="interface-filter">
        <Input
          onChange={this.onFilter}
          value={this.state.filter}
          placeholder="搜索接口"
        />
        <Button
          type="primary"
          onClick={
            () => {
              // 选中目录才可以添加
              console.log('-----------',this.state.currentSelectNode)
              if(this.state.currentSelectNode.props &&  this.state.currentSelectNode.props.child_type === 1) {
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
      console.log('jajajja', this.state.selects)
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
    let menuList;
    if (this.state.filter) {
      let res = this.filterList(this.state.list);
      menuList = res.menuList;
      currentKes.expands = res.arr;
    } else {
      menuList = this.state.list;
    }

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
              // loadedKeys={this.state.loadedKeysSet}
              autoExpandParent = { false }
              defaultExpandedKeys={currentKes.expands}
              defaultSelectedKeys={currentKes.selects}
              expandedKeys={currentKes.expands}
              selectedKeys={currentKes.selects}
              onSelect={this.onSelect}
              onExpand={this.onExpand}
              draggable
              onDrop={this.onDrop}
              expandAction={false}
            >
              <TreeNode
                className="item-all-interface"
                isLeaf = {true}
                selectable = {true}
                title={
                  <Link
                    onClick={(e) => {
                      e.stopPropagation();
                      // this.changeExpands();
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
                { this.renderTreeNodes(menuList) }
            </Tree>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(InterfaceMenu);
