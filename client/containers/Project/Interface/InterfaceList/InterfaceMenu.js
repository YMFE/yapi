import React, {PureComponent as Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'underscore';
import {
  deleteInterfaceCatData,
  deleteInterfaceData,
  fetchInterfaceCatList,
  fetchInterfaceData,
  fetchInterfaceList,
  fetchInterfaceListMenu,
  initInterface
} from '../../../../reducer/modules/interface.js';
import {fetchProjectList, getProject} from '../../../../reducer/modules/project.js';
import MoveInterface from './MoveInterface';
import {Button, Icon, Input, message, Modal, Tooltip, Tree} from 'antd';
import AddInterfaceForm from './AddInterfaceForm';
import AddInterfaceCatForm from './AddInterfaceCatForm';
import axios from 'axios';
import {Link, withRouter} from 'react-router-dom';
import produce from 'immer';
import {arrayChangeIndex,findMeInTree,isContained, findCategoriesById } from '../../../../common.js';

import './interfaceMenu.scss';

const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const headHeight = 240; // menu顶部到网页顶部部分的高度

@connect(
  state => {
    return {
      list: state.inter.list,
      inter: state.inter.curdata,
      curProject: state.project.currProject
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
    fetchProjectList,
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
    location: PropTypes.object,
    router: PropTypes.object,
    getProject: PropTypes.func,
    fetchInterfaceCatList: PropTypes.func,
    fetchProjectList: PropTypes.func,
    fetchInterfaceList: PropTypes.func
  };
  state = {
    moveInterVisible: false,
    moveId: 0,
    moveToProjectId: 0,
    moveToCatId: 0,
    expandedKeys: [],
    selectedKey: []
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
      list: [],
      expandedKeys: [],
      selectedKey:[],
      isdelall:false
    };
  }

  /**
   * @param {String} key
   */
  changeModal = (key, status) => {
    //visible add_cat_modal_visible change_cat_modal_visible del_cat_modal_visible
    let newState = {};
    newState[key] = status;
    this.setState(newState);
  };

  handleMoveCancel = () => {
    this.setState({
      moveInterVisible: false
    });
  };

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
    // console.log('nextProps: ', nextProps);
    if (this.props.list !== nextProps.list) {
      // console.log('next', nextProps.list)
      this.setState({
        list: nextProps.list
      });
    }
    const { pathname } = this.props.location;
    const { pathname: nextPathname } = nextProps.location;
    if (pathname !== nextPathname || this.state.expandedKeys.length===0) {
      this.initexpandedKeys(nextProps.curProject.cat, nextProps);
    }
  }
  appendSetExpandedKeys=list=>{
    try {
      let treePath=[];
      let catid=0;
      let par=this.props.router.params;
      let selectedKey=[];
      if(par.actionId) {
        catid = Number(par.actionId.indexOf('cat_')===0?par.actionId.substr(4):this.props.inter.catid);
        selectedKey.push(par.actionId);
      }
      if (catid) {
        treePath = findMeInTree(list, catid).treePath;
        treePath.push(catid);
        treePath = treePath.map(it => {
          return 'cat_' + it
        });
        let expandedKeys=[];
        if(isContained(this.state.expandedKeys,treePath)){
          expandedKeys=this.state.expandedKeys;
        }else{
          expandedKeys=this.state.expandedKeys.concat(treePath);
        }
        this.state.expandedKeys
        this.setState(
          {
            expandedKeys: expandedKeys,
            selectedKey:selectedKey
          }
        )
      }
    }catch (e){
    }
  }

  onSelect = (selectedKeys,e) => {
    const {history, match} = this.props;
    let key = e.node.props.eventKey;
    let basepath = '/project/' + match.params.id + '/interface/api';
    if (key === 'root') {
      history.push(basepath);
    } else {
      history.push(basepath + '/' + key);
    }

    const { expandedKeys, selectedKey } = this.state;

    if (expandedKeys.includes(key) && selectedKey.includes(key)) {
      this.setState({
        expandedKeys: expandedKeys.filter(i => i !== key),
        selectedKey: [key]
      })
    } else {
      this.setState({
        expandedKeys: key.startsWith('cat_') ? [...expandedKeys, key] : expandedKeys,
        selectedKey: [key]
      })
    }

  };

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys
    })
  };



  handleAddInterface = (data, cb) => {
    data.project_id = this.props.projectId;
    data.catid = data.catids.pop();
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
    data.parent_id = this.state.curCatdata.addchild ? this.state.curCatdata._id : -1;
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
        await that.props.fetchInterfaceCatList({catid});
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
      content: '温馨提示：该操作会删除该分类下“所有接口及子分类”，接口删除后无法恢复)',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await that.props.deleteInterfaceCatData(catid);
        await that.getList();
        await that.props.getProject(that.props.projectId);//需要重新获取当前项目接口分类，否则新建接口中会出现已经删除的分类
        await that.props.fetchInterfaceList({project_id: that.props.projectId});
        that.props.history.push('/project/' + that.props.match.params.id + '/interface/api');
        ref.destroy();
      },
      onCancel() {
      }
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
    this.setState({delIcon: id});
  };

  leaveItem = () => {
    this.setState({delIcon: null});
  };

  onFilter = e => {
    let res = this.filterList(this.props.list,e.target.value);
    //menuList = res.menuList;
    console.log({res});
    this.setState(
      {
        expandedKeys:res.arr,
        list: res.menuList,
        filter:e.target.value
      }
    )
  };


  getcatItem = (c, ids, iscat) => {
    let inids = JSON.parse(JSON.stringify(ids));
    iscat ? '' : inids.pop();
    let itrlist = (lis, idz) => {
      let ret = lis[Number(idz.shift())];
      if (idz.length > 0) {
        ret = itrlist(ret.children, idz);
      }
      return ret;
    };
    let item = itrlist(c, inids);
    return item;
  };

  onDrop = async e => {
    let dropCatIndex = e.node.props.pos.split('-');
    let dragCatIndex = e.dragNode.props.pos.split('-');
    dropCatIndex.shift();
    dropCatIndex[0] = dropCatIndex[0] - 1;
    dragCatIndex.shift();
    dragCatIndex[0] = dragCatIndex[0] - 1;

    ////console.log({"onDrop":{"e.node.props.pos":e.node.props.pos,"e.dragNode.props.pos":e.dragNode.props.pos}});
    if (dropCatIndex < 0 || dragCatIndex < 0) {
      return;
    }
    const {list} = this.props;
    const dragid = e.dragNode.props.eventKey;
    const dropid = e.node.props.eventKey;
    const dropCatItem = this.getcatItem(list, dropCatIndex, dropid.indexOf('cat') != -1);
    const dragCatItem = this.getcatItem(list, dragCatIndex, dragid.indexOf('cat') != -1);
    const dropCatId = dropCatItem._id;
    const dragCatId = dragCatItem._id;

    const dropPos = e.node.props.pos.split('-');
    const dropIndex = Number(dropPos[dropPos.length - 1]);
    const dragPos = e.dragNode.props.pos.split('-');
    const dragIndex = Number(dragPos[dragPos.length - 1]);

    if (dragid.indexOf('cat') === -1) {
      if (dropCatId === dragCatId) {
        // 同一个分类下的接口交换顺序
        let colList = dropCatItem.list;
        let childCount = dropCatItem.children ? dropCatItem.children.length : 0;
        let changes = arrayChangeIndex(colList, dragIndex - childCount, dropIndex - childCount);
        axios.post('/api/interface/up_index', changes).then();
      } else {
        await axios.post('/api/interface/up', {id: dragid, catid: dropCatId});
      }
      const {projectId, router} = this.props;
      this.props.fetchInterfaceListMenu(projectId);
      this.props.fetchInterfaceList({project_id: projectId});
      if (router && isNaN(router.params.actionId)) {
        // 更新分类list下的数据
        let catid = router.params.actionId.substr(4);
        this.props.fetchInterfaceCatList({catid});
      }
    } else {
      // 分类拖动

      //处理分类拖动到接口上
      //处理分类在不同级时相互拖动情况
      if (dropid.indexOf('cat') === -1 || (dropid.indexOf('cat') != -1 && dropCatItem.parent_id != dragCatItem.parent_id)) {
        let catid = dragCatItem._id;
        let parent_id = -1;
        //不同级别时，拖到上gap,则成为同级分类
        if (e.node.props.dragOverGapTop) {
          parent_id = dropCatItem.parent_id;
        } else {// 不同级别时，拖到节点或下gap时，成为子目录
          parent_id = dropCatItem._id;
        }
        axios.post('/api/interface/up_cat', {catid, parent_id}).then();
      } else { //同分类目录下:
        let changes = [];
        if (e.node.props.dragOver) {//如果不是在gap上，则进行排序
          if (dropCatItem.parent_id === -1) {
            changes = arrayChangeIndex(list, dragIndex - 1, dropIndex - 1);
          } else {
            dropCatIndex.pop();
            changes = arrayChangeIndex(this.getcatItem(list, dropCatIndex, true).children, dragIndex, dropIndex);
          }
          axios.post('/api/interface/up_cat_index', changes).then();
        } else {//如果drop在gap上，则是成为drop目标的子目录
          let catid = dragCatItem._id;
          let parent_id = dropCatItem._id;
          axios.post('/api/interface/up_cat', {catid, parent_id}).then();
        }
      }
    }
    this.props.getProject(this.props.projectId);
    this.props.fetchInterfaceListMenu(this.props.projectId);
  };

  changeStyle = (str,searchValue) => {
    const index = str.indexOf(searchValue);
    if (index > -1) {
      const beforeStr = str.substr(0, index);
      const afterStr = str.substr(index + searchValue.length);
      return (
        <span>
          {beforeStr}
          <span style={{color: 'red'}}>{searchValue}</span>
          {afterStr}
        </span>
      )
    } else {
      return str;
    }
  };
  // 数据过滤
  filterList = (list,filter) => {
    let arr = [];

    let iterater = item => {

      //console.log(JSON.parse(JSON.stringify(item)));
      // arr = [];
      if (item.name.indexOf(filter) === -1) {

        item.children = item.children ? item.children.filter(me => iterater(me)) : [];
        item.list = item.list.filter(inter => {
          if (
            inter.title.indexOf(filter) === -1 &&
            inter.path.indexOf(filter) === -1
          ) {
            return false;
          } else {
            inter.title = inter.path.indexOf(filter) === -1 ? this.changeStyle(inter.title,filter) : (
              <span style={{color: 'blue'}}>{inter.title}</span>)
          }
          return true;
        });

        if (item.list.length > 0 || item.children.length > 0) {
          arr.push('cat_' + item._id);
          item.in = true;
        } else {
          item.in = false;
        }

        return item.in ;
      } else {
        arr.push('cat_' + item._id);
        item.title = this.changeStyle(item.title,filter);
        item.in = true;
        return true;
      }

    };
    let menuList = produce(list, draftList => {
      draftList.filter(item => {
          iterater(item);
        }
      );
    });
    console.log({menuList, arr});
    return {menuList, arr};
  };

  showMoveInterfaceModal = async id => {
    const groupId = this.props.curProject.group_id;
    await this.props.fetchProjectList(groupId);
    this.setState({moveInterVisible: true, moveId: id});
    ////console.log("this.state.moveInterVisible "+ this.state.moveInterVisible)
  };

  handleMoveOk = async () => {
    const {moveId, moveToProjectId, moveToCatId} = this.state;
    await axios.post('/api/interface/move', {moveId, pid: moveToProjectId, cid: moveToCatId}).then(res => {
        if (res.data.errcode == 0) {
          message.success("小手一抖，接口移走！咻咻……咻…… ");
        }
      }
    );
    await axios.post('/api/col/flush', {inpid: moveId, pid: moveToProjectId});

    this.props.fetchInterfaceListMenu(this.props.projectId);
    this.setState({
      moveInterVisible: false
    });
  };

  movecallback = (pid, cid) => {
    this.setState({
      moveToProjectId: pid,
      moveToCatId: cid
    })
  };

  initexpandedKeys =(list, props)=>{
    try {
      let treePath = [];
      let catid = 0;
      let selectedKey = [];
      const router = props.router || {};
      const { actionId = "" } = router.params || {};
      if (actionId) {
        // catid = Number(actionId.indexOf('cat_') ===0 ? actionId.substr(4) : props.inter.catid);
        selectedKey.push(actionId);
      }

      if (actionId.startsWith('cat_')) {
        catid = Number(actionId.substr(4));
        // 目录
      } else {
        let ids = findCategoriesById(props.list, Number(actionId));
        ids = ids.map(it => {
          return 'cat_' + it
        });
        const { expandedKeys } = this.state;
        const newExpandedKeys = _.uniq([...expandedKeys, ...ids]);
        this.setState(
            {
              expandedKeys: newExpandedKeys,
              selectedKey:selectedKey
            }
        )
      }

      if (catid) {
        treePath = findMeInTree(list, catid).treePath.slice();
        treePath.push(catid);
        treePath = treePath.map(it => {
          return 'cat_' + it
        });
        const { expandedKeys } = this.state;
        const newExpandedKeys = _.uniq([...expandedKeys, ...treePath]);
        this.setState(
          {
            expandedKeys: newExpandedKeys,
            selectedKey:selectedKey
          }
        )
      }
    }catch (e){
    }
  };


  render() {
    const matchParams = this.props.match.params;
    // let menuList = this.state.list;
    const searchBox = (
      <div className="interface-filter">
        <Input onChange={this.onFilter} value={this.state.filter} placeholder="搜索分类/接口名/PATH"/>
        <Button
          type="primary"
          onClick={() => {
            this.changeModal('add_cat_modal_visible', true);
            this.setState({
              curCatdata: {}
            });
          }}
          className="btn-filter"
        >
          添加主分类
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
            title={
              this.state.curCatdata.addchild ? "在【" + this.state.curCatdata.name + "】下添加子分类" : "添加主分类"
            }
            visible={this.state.add_cat_modal_visible}
            onCancel={() => this.changeModal('add_cat_modal_visible', false)}
            footer={null}
            className="addcatmodal"
          >
            <AddInterfaceCatForm
              catdata={this.state.curCatdata.addchild ? {} : this.state.curCatdata}
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
      </div>
    );

    const itemCatCreate = item => {
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
                to={'/project/' + matchParams.id + '/interface/api/cat_' + item._id}
              >
                <Icon type="folder-open" style={{marginRight: 5}}/>
                {item.title}
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
                    style={{display: this.state.delIcon == item._id ? 'block' : 'none'}}
                  />
                </Tooltip>
                <Tooltip title="添加子分类">
                  <Icon
                    type="plus"
                    className="interface-delete-icon"
                    style={{display: this.state.delIcon == item._id ? 'block' : 'none'}}
                    onClick={e => {
                      e.stopPropagation();
                      this.changeModal('add_cat_modal_visible', true);
                      item['addchild'] = true;
                      this.setState({
                        curCatdata: item
                      });
                    }}
                  />
                </Tooltip>
                <Tooltip title="修改分类">
                  <Icon
                    type="edit"
                    className="interface-delete-icon"
                    style={{display: this.state.delIcon == item._id ? 'block' : 'none'}}
                    onClick={e => {
                      e.stopPropagation();
                      this.changeModal('change_cat_modal_visible', true);
                      // item.addchild=false;
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
                    style={{display: this.state.delIcon == item._id ? 'block' : 'none'}}
                    onClick={e => {
                      e.stopPropagation();
                      this.changeModal('visible', true);
                      this.setState({
                        curCatid: item._id
                      });
                    }}
                  />
                </Tooltip>
              </div>

              {/*<Dropdown overlay={menu(item)} trigger={['click']} onClick={e => e.stopPropagation()}>
                <Icon type='ellipsis' className="interface-delete-icon" />
              </Dropdown>*/}
            </div>
          }
          key={'cat_' + item._id}
        >
          {item.children ? item.children.filter(me => (me.in === true || typeof me.in === "undefined")).map(itemCatCreate) : ''}
          {item.list.map(itemInterfaceCreate)}
        </TreeNode>
      )

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
                to={'/project/' + matchParams.id + '/interface/api/' + item._id}
              >
                <span className={"tag-status "+item.status}>
                  {item.title}
                </span>
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
                    style={{display: this.state.delIcon == item._id ? 'block' : 'none'}}
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
                    style={{display: this.state.delIcon == item._id ? 'block' : 'none'}}
                  />
                </Tooltip>
                <Tooltip title="移动接口">
                  <Icon
                    type="scan"
                    className="interface-delete-icon"
                    onClick={e => {
                      e.stopPropagation();
                      this.showMoveInterfaceModal(item._id);
                    }}
                    style={{display: this.state.delIcon == item._id ? 'block' : 'none'}}
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


    let menuList=this.state.list;

    //  //console.log("render this.state.moveInterVisible " + this.state.moveInterVisible);
    //console.log({menuList});
    return (
      <div>
        {searchBox}
        {menuList.length > 0 ? (
          <div
            className="tree-wrappper"
            style={{maxHeight: parseInt(document.body.clientHeight) - headHeight + 'px'}}
          >
            <Tree
              className="interface-list"
              selectedKeys={this.state.selectedKey}
              expandedKeys={this.state.expandedKeys}
              onSelect={this.onSelect}
              onExpand={this.onExpand}
              draggable
              onDrop={this.onDrop}
            >
              <TreeNode
                className="item-all-interface"
                title={
                  <Link
                    to={'/project/' + matchParams.id + '/interface/api'}
                  >
                    <Icon type="folder" style={{marginRight: 5}}/>
                    全部接口
                  </Link>
                }
                key="root"
              />
              {menuList.filter(me => (me.in === true || typeof me.in === "undefined")).map(itemCatCreate)}
            </Tree>
          </div>
        ) : null}
        <Modal
          title="移动接口到其他项目"
          visible={this.state.moveInterVisible}
          className="import-case-modal"
          onOk={this.handleMoveOk}
          onCancel={this.handleMoveCancel}
          width={500}
          destroyOnClose
        >
          <MoveInterface
            currProjectId={this.props.projectId}
            movecallback={this.movecallback}
          />
        </Modal>
      </div>


    );
  }
}

export default withRouter(InterfaceMenu);
