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
      parent_id: data.parent_id,
      catid: this.state.curCatdata._id,
      name: data.name,
      desc: data.desc,
      index: data.index
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
        // await that.props.getProject(that.props.projectId)
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

  onFilter = e => {
    this.setState({
      filter: e.target.value,
      list: JSON.parse(JSON.stringify(this.props.list))
    });
  };

  onExpand = e => {
    this.setState({
      expands: e
    });
  };

  onDrop = async e => {
    if (e.dragNode.props.pos == '0-0') {
      return;
    }//全部分类 不允许拖动

    const dragKey = e.dragNode.props.eventKey;//拖
    const dropKey = e.node.props.eventKey;//拽

    if (dragKey.indexOf('cat') !== -1) {
      message.error("目录不支持拖拽");
      return;
    }//只支持拖拽同目录下 接口

    const { list } = this.props;

    //拖动元素的上级_id (catId)
    let dragCatId = 0;
    if (dragKey.indexOf('cat') === -1) {
      //拖动的接口
      list.forEach(x => {
        if (x.list.find(y => y._id == dragKey)) {
          dragCatId = x._id;
          return;
        }
      })
    }

    //拽动元素的上级_id (catId)
    let dropCatId = 0;
    if (dropKey.indexOf('cat') === -1) {
      //拽动的接口
      list.forEach(x => {
        if (x.list.find(y => y._id == dropKey)) {
          dropCatId = x._id;
          return;
        }
      })
    }

    //
    const dropPos = e.node.props.pos.split('-');
    const dropIndex = Number(dropPos[dropPos.length - 1]);
    const dragPos = e.dragNode.props.pos.split('-');
    const dragIndex = Number(dragPos[dragPos.length - 1]);

    if (dragKey.indexOf('cat') === -1) {//拖动的是接口
      if (dropCatId === dragCatId) {// 同一个分类下的接口交换顺序
        let colList = [];
        list.forEach(x => {
          if (x.list.find(y => y._id == dropKey)) {
            colList = x.list;
            return;
          }
        })
        let changes = arrayChangeIndex(colList, dragIndex, dropIndex);
        axios.post('/api/interface/up_index', changes).then();

        const { projectId, router } = this.props;
        this.props.fetchInterfaceListMenu(projectId);
        this.props.fetchInterfaceList({ project_id: projectId });
        if (router && isNaN(router.params.actionId)) {
          // 更新分类list下的数据
          let catid = router.params.actionId.substr(4);
          this.props.fetchInterfaceCatList({ catid });
        }
      }else{
        message.error("接口不支持拖拽到目录");
      }

    }else{
      message.error("目录不支持拖拽");
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
        if (item.name.toLowerCase().indexOf(that.state.filter.toLowerCase()) === -1) {
          item.list = item.list.filter(inter => {
            if (
              inter.title.toLowerCase().indexOf(that.state.filter.toLowerCase()) === -1 &&
              inter.path.toLowerCase().indexOf(that.state.filter.toLowerCase()) === -1
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

  render() {
    const matchParams = this.props.match.params;
    // let menuList = this.state.list;
    const searchBox = (
      <div className="interface-filter">
        <Input onChange={this.onFilter} value={this.state.filter} allowClear placeholder="搜索接口" />
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
              catlist={this.props.curProject.cat}
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
              catlist={this.props.curProject.cat}
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

    const renderTreeNodes = data =>
      data.map(item => {
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
                </div>

                {/*<Dropdown overlay={menu(item)} trigger={['click']} onClick={e => e.stopPropagation()}>
              <Icon type='ellipsis' className="interface-delete-icon" />
            </Dropdown>*/}
              </div>
            }
            key={'cat_' + item._id}
            className={`interface-item-nav ${item.list.length || (item.children && item.children.length) ? '' : 'cat_switch_hidden'}`}
          >
            {item.children.length > 0 ? (renderTreeNodes(item.children)) : null}
            {item.list.length > 0 ? (item.list.map(itemInterfaceCreate)) : null}
          </TreeNode>
        );
      });

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
                className="interface-item interface-item-blue"
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

    let currentKes = defaultExpandedKeys();
    let menuList;
    console.log("this.state.filter:"+this.state.filter);
    if (this.state.filter) {
      let res = this.filterList(this.state.list);
      menuList = res.menuList;
      currentKes.expands = res.arr;
    } else {
      menuList = this.state.list;
    }
    //构造树形结构
    const temp = JSON.parse(JSON.stringify(menuList))
    temp.forEach(f => {
      f.children = temp.filter(g => g.parent_id == f._id).sort((a, b) => {
        return a.index - b.index;//从小到大排序
      });
    });
    const resultArray = temp.filter(f => f.parent_id == 0).sort((a, b) => {
      return a.index - b.index;//从小到大排序
    });
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
              {renderTreeNodes(resultArray)}
            </Tree>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(InterfaceMenu);
