import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
  fetchInterfaceColList,
  fetchInterfaceCaseList,
  setColData,
  fetchCaseList,
  fetchCaseData
} from '../../../../reducer/modules/interfaceCol';
import { fetchProjectList } from '../../../../reducer/modules/project';
import axios from 'axios';
import ImportInterface from './ImportInterface';
import { Input, Icon, Button, Modal, message, Tooltip, Tree, Form } from 'antd';
import { arrayChangeIndex } from '../../../../common.js';
import { Link } from 'react-router-dom';

const { confirm } = Modal;

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const headHeight = 240; // menu顶部到网页顶部部分的高度

import './InterfaceColMenu.scss';

const ColModalForm = Form.create()(props => {
  const { visible, onCancel, onCreate, form, title } = props;
  const { getFieldDecorator } = form;
  return (
    <Modal visible={visible} title={title} onCancel={onCancel} onOk={onCreate}>
      <Form layout="vertical">
        <FormItem label="集合名">
          {getFieldDecorator('colName', {
            rules: [{ required: true, message: '请输入集合命名！' }]
          })(<Input />)}
        </FormItem>
        <FormItem label="简介">{getFieldDecorator('colDesc')(<Input type="textarea" />)}</FormItem>
      </Form>
    </Modal>
  );
});

@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currCase: state.interfaceCol.currCase,
      isRander: state.interfaceCol.isRander,
      currCaseId: state.interfaceCol.currCaseId,
      // list: state.inter.list,
      // 当前项目的信息
      curProject: state.project.currProject
      // projectList: state.project.projectList
    };
  },
  {
    fetchInterfaceColList,
    fetchInterfaceCaseList,
    fetchCaseData,
    // fetchInterfaceListMenu,
    fetchCaseList,
    setColData,
    fetchProjectList
  }
)
@withRouter
export default class InterfaceColMenu extends Component {
  static propTypes = {
    match: PropTypes.object,
    interfaceColList: PropTypes.array,
    fetchInterfaceColList: PropTypes.func,
    fetchInterfaceCaseList: PropTypes.func,
    // fetchInterfaceListMenu: PropTypes.func,
    fetchCaseList: PropTypes.func,
    fetchCaseData: PropTypes.func,
    setColData: PropTypes.func,
    currCaseId: PropTypes.number,
    history: PropTypes.object,
    isRander: PropTypes.bool,
    // list: PropTypes.array,
    router: PropTypes.object,
    currCase: PropTypes.object,
    curProject: PropTypes.object,
    fetchProjectList: PropTypes.func
    // projectList: PropTypes.array
  };

  state = {
    colModalType: '',
    colModalVisible: false,
    curColId: 0,
    filterValue: '',
    importInterVisible: false,
    confirmImportVisble: false,
    importInterIds: [],
    importColId: 0,
    expands: [],
    selects: ['root'],
    list: [],
    delIcon: null,
    selectedProject: null,
    currentSelectNode: null
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getList();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.interfaceColList !== nextProps.interfaceColList) {
      this.setState({
        list: nextProps.interfaceColList
      });
    }
  }

  async getList(getChild) {
    let r = await this.props.fetchInterfaceColList(
      this.props.match.params.id,
      this.state.curColId,
      getChild
    );
    // return r;
    if (!getChild) {
      this.setState({
        list: r.payload.data.data
      });
      return r.payload.data.data
    } else {
      return r.payload.data.data;
    }
  }

  addorEditCol = async () => {
    const { colName: name, colDesc: desc } = this.form.getFieldsValue();
    const { colModalType, curColId: col_id} = this.state;
    const project_id = this.props.match.params.id;
    let res = {};
    if (colModalType === 'add') {
      res = await axios.post('/api/col/add_col', { name, desc, project_id, parent_id: col_id});
    } else if (colModalType === 'edit') {
      res = await axios.post('/api/col/up_col', { name, desc, col_id });
    }
    if (!res.data.errcode) {
      this.setState({
        colModalVisible: false
      });
      message.success(colModalType === 'edit' ? '修改集合成功' : '添加集合成功');
      // await this.props.fetchInterfaceColList(project_id);
      this.getList(true);
    } else {
      message.error(res.data.errmsg);
    }
  };

  onExpand = (keys,e) => {
    this.setState({ expands: keys });
  };

  onSelect = (keys, e) => {
    if (keys.length) {
      const type = keys[0].split('_')[0];
      const id = keys[0].split('_')[1];
      const project_id = this.props.match.params.id;
      const curNode = e.selectedNodes[0];
      const colId = curNode.props.child_type === 0 ? curNode.props._id : curNode.props.col_id;
      const curkey = keys[0];

      console.log('curnode',curNode)
      console.log('curkey',curkey)
      console.log('colId',colId)

      this.setState({
        currentSelectNode: curNode,
        curColId: colId,
        selects: [curkey],
      });
      if (type === 'col') {
        this.props.setColData({
          isRander: false
        });
        this.props.history.push('/project/' + project_id + '/interface/col/' + id);
      } else {
        this.props.setColData({
          isRander: false
        });
        this.props.history.push('/project/' + project_id + '/interface/case/' + id + '?colId=' + colId);
      }
    }

  };

  showDelColConfirm = colId => {
    let that = this;
    const params = this.props.match.params;
    confirm({
      title: '您确认删除此测试集合',
      content: '温馨提示：该操作会删除该集合下所有测试用例，用例删除后无法恢复',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const res = await axios.get('/api/col/del_col?col_id=' + colId);
        if (!res.data.errcode) {
          message.success('删除集合成功');
          const result = await that.getList();
          const nextColId = result.payload.data.data[0]._id;

          that.props.history.push('/project/' + params.id + '/interface/col/' + nextColId);
        } else {
          message.error(res.data.errmsg);
        }
      }
    });
  };

  // 复制测试集合
  copyInterface = async item => {
    if (this._copyInterfaceSign === true) {
      return;
    }
    this._copyInterfaceSign = true;
    const { desc, project_id, _id: col_id } = item;
    let { name } = item;
    name = `${name} copy`;
    let parent_id = this.state.curColId;
    // 添加集合
    const add_col_res = await axios.post('/api/col/add_col', { name, desc, project_id,parent_id });

    if (add_col_res.data.errcode) {
      message.error(add_col_res.data.errmsg);
      return;
    }

    const new_col_id = add_col_res.data.data._id;

    // 克隆集合
    const add_case_list_res = await axios.post('/api/col/clone_case_list', {
      new_col_id,
      col_id,
      project_id
    });
    this._copyInterfaceSign = false;

    if (add_case_list_res.data.errcode) {
      message.error(add_case_list_res.data.errmsg);
      return;
    }

    // 刷新接口列表
    // await this.props.fetchInterfaceColList(project_id);
    this.getList(true);
    this.props.setColData({ isRander: true });
    message.success('克隆测试集成功');
  };

  showNoDelColConfirm = () => {
    confirm({
      title: '此测试集合为最后一个集合',
      content: '温馨提示：建议不要删除'
    });
  };
  caseCopy = async caseId=> {
    let that = this;
    let caseData = await that.props.fetchCaseData(caseId);
    let data = caseData.payload.data.data;
    data = JSON.parse(JSON.stringify(data));
    data.casename=`${data.casename}_copy`
    delete data._id 
    const res = await axios.post('/api/col/add_case',data);
      if (!res.data.errcode) {
        message.success('克隆用例成功');
        let colId = res.data.data.col_id;
        let projectId=res.data.data.project_id;
        await this.getList(true);
        this.props.history.push('/project/' + projectId + '/interface/col/' + colId);
        this.setState({
          visible: false
        });
      } else {
        message.error(res.data.errmsg);
      }
  };
  showDelCaseConfirm = caseId => {
    let that = this;
    const params = this.props.match.params;
    confirm({
      title: '您确认删除此测试用例',
      content: '温馨提示：用例删除后无法恢复',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const res = await axios.get('/api/col/del_case?caseid=' + caseId);
        if (!res.data.errcode) {
          message.success('删除用例成功');
          that.getList(true);
          // 如果删除当前选中 case，切换路由到集合
          if (+caseId === +that.props.currCaseId) {
            that.props.history.push('/project/' + params.id + '/interface/col/');
          } else {
            // that.props.fetchInterfaceColList(that.props.match.params.id);
            that.props.setColData({ isRander: true });
          }
        } else {
          message.error(res.data.errmsg);
        }
      }
    });
  };
  showColModal = (type, col) => {
    const editCol =
      type === 'edit' ? { colName: col.name, colDesc: col.desc } : { colName: '', colDesc: '' };
    this.setState({
      colModalVisible: true,
      colModalType: type || 'add',
      curColId: col && col._id
    });
    this.form.setFieldsValue(editCol);
  };
  saveFormRef = form => {
    this.form = form;
  };

  selectInterface = (importInterIds, selectedProject) => {
    this.setState({ importInterIds, selectedProject });
  };

  showImportInterfaceModal = async colId => {
    // const projectId = this.props.match.params.id;
    // console.log('project', this.props.curProject)
    const groupId = this.props.curProject.group_id;
    await this.props.fetchProjectList(groupId);
    // await this.props.fetchInterfaceListMenu(projectId)
    this.setState({ importInterVisible: true, importColId: colId });
  };

  handleImportOk = async () => {
    const project_id = this.state.selectedProject || this.props.match.params.id;
    const { importColId, importInterIds } = this.state;
    const res = await axios.post('/api/col/add_case_list', {
      interface_list: importInterIds,
      col_id: importColId,
      project_id
    });
    if (!res.data.errcode) {
      // this.setState({ importInterVisible: false , importInterIds: [], selectedProject: null});
      this.setState({ importInterVisible: false });
      message.success('导入集合成功');
      // await this.props.fetchInterfaceColList(project_id);
      this.getList(true);

      this.props.setColData({ isRander: true });
    } else {
      message.error(res.data.errmsg);
    }
  };
  handleImportCancel = () => {
    // this.setState({ importInterVisible: false , importInterIds: [], selectedProject: null });
    this.setState({ importInterVisible: false });
  };
  showConfirm = () => {
    let that = this;
    confirm({
      title: '已选中'+this.state.importInterIds.length+'条接口，确认提交吗?',
      content: '只能导入已展开过的一级目录下的所有接口',
      onOk() {
       that.handleImportOk();
      },
      onCancel() {
        that.handleImportCancel()
      },
    });
  };
  
  filterCol = e => {
    const value = e.target.value;
    // console.log('list', this.props.interfaceColList);
    // const newList = produce(this.props.interfaceColList, draftList => {})
    // console.log('newList',newList);
    this.setState({
      filterValue: value,
      list: JSON.parse(JSON.stringify(this.props.interfaceColList))
      // list: newList
    });
  };

  onDrop = async e => {
    // const projectId = this.props.match.params.id;
    const { interfaceColList } = this.props;
    const dropColIndex = e.node.props.pos.split('-')[1];
    const dropColId = interfaceColList[dropColIndex]._id;
    const id = e.dragNode.props.eventKey;
    const dragColIndex = e.dragNode.props.pos.split('-')[1];
    const dragColId = interfaceColList[dragColIndex]._id;

    const dropPos = e.node.props.pos.split('-');
    const dropIndex = Number(dropPos[dropPos.length - 1]);
    const dragPos = e.dragNode.props.pos.split('-');
    const dragIndex = Number(dragPos[dragPos.length - 1]);

    if (id.indexOf('col') === -1) {
      if (dropColId === dragColId) {
        // 同一个测试集合下的接口交换顺序
        let caseList = interfaceColList[dropColIndex].caseList;
        let changes = arrayChangeIndex(caseList, dragIndex, dropIndex);
        axios.post('/api/col/up_case_index', changes).then();
      }
      await axios.post('/api/col/up_case', { id: id.split('_')[1], col_id: dropColId });
      // this.props.fetchInterfaceColList(projectId);
      this.getList();
      this.props.setColData({ isRander: true });
    } else {
      let changes = arrayChangeIndex(interfaceColList, dragIndex, dropIndex);
      axios.post('/api/col/up_col_index', changes).then();
      this.getList();
    }
  };

  enterItem = id => {
    this.setState({ delIcon: id });
  };

  leaveItem = () => {
    this.setState({ delIcon: null });
  };


  async doInterfaceSearch() {
    if(this.state.filter === '') {
      message.error('搜索内容不能为空');
    }else{
      this.setState({
        list: [],
        expands: [],
        selects: [],
        loadedKeysSet: []
      })
      // let r = await this.props.queryCatAndInterface({
      //   project_id: Number(this.props.projectId),
      //   query_text: this.state.filter
      // });
      // this.setState({
      //   list: r.payload.data.data
      // });
    }
  };
  itemInterfaceColTitle(col) {
    return (
      <div 
      className="menu-title"
      onMouseEnter={() => { this.enterItem('col_' + col._id) }}
      onMouseLeave={this.leaveItem}
      onClick={(e) => {
        // e.stopPropagation();
        // this.setState({
        //   curColId: Number(col._id),
        //   currentSelectNode: col
        // })
      }}
      >
      <span>
        <Icon type="folder-open" style={{ marginRight: 5 }} />
        <span>{col.name}</span>
      </span>
      <div className="btns">
        <Tooltip title="删除集合">
          <Icon
            type="delete"
            // style={{ display: list.length > 1 ? '' : 'none' }}
            className="interface-delete-icon"
            style={{
              display: this.state.delIcon == 'col_' + col._id ? 'block' : 'none'
            }}
            onClick={() => {
              this.showDelColConfirm(col._id);
              this.setState({
                curColId: Number(col._id),
                currentSelectNode: col
              });
            }}
          />
        </Tooltip>
        <Tooltip title="编辑集合">
          <Icon
            type="edit"
            className="interface-delete-icon"
            onClick={e => {
              e.stopPropagation();
              this.showColModal('edit', col);
              this.setState({
                curColId: Number(col._id),
                currentSelectNode: col
              });
            }}
          />
        </Tooltip>
        <Tooltip title="导入接口">
          <Icon
            type="plus"
            className="interface-delete-icon"
            style={{
              display: this.state.delIcon == 'col_' + col._id ? 'block' : 'none'
            }}
            onClick={e => {
              e.stopPropagation();
              this.showImportInterfaceModal(col._id);
              this.setState({
                curColId: Number(col._id),
                currentSelectNode: col
              });
            }}
          />
        </Tooltip>
        <Tooltip title="克隆集合">
          <Icon
            type="copy"
            className="interface-delete-icon"
            style={{
              display: this.state.delIcon == 'col_' + col._id ? 'block' : 'none'
            }}
            onClick={e => {
              e.stopPropagation();
              this.setState({
                curColId: Number(col._id),
                currentSelectNode: col
              });
              this.copyInterface(col);
            }}
          />
        </Tooltip>
      </div>
      {/*<Dropdown overlay={menu(col)} trigger={['click']} onClick={e => e.stopPropagation()}>
        <Icon className="opts-icon" type='ellipsis'/>
      </Dropdown>*/}
    </div>
    );
  }

  itemInterfaceCreateTitle(interfaceCase) {
    return (
      <div
      className="menu-title"
      onMouseEnter={() => this.enterItem(interfaceCase._id)}
      onMouseLeave={this.leaveItem}
      title={interfaceCase.casename}
      onClick={(e) => {
        // e.stopPropagation();
      }}
    >
      <span className="casename">{interfaceCase.casename}</span>
      <div className="btns">
        <Tooltip title="删除用例">
          <Icon
            type="delete"
            className="interface-delete-icon"
            onClick={e => {
              e.stopPropagation();
              this.showDelCaseConfirm(interfaceCase._id);
            }}
            style={{ display: this.state.delIcon == interfaceCase._id ? 'block' : 'none' }}
          />
        </Tooltip>
        <Tooltip title="克隆用例">
          <Icon
            type="copy"
            className="interface-delete-icon"
            onClick={e => {
              e.stopPropagation();
              this.caseCopy(interfaceCase._id);
            }}
            style={{ display: this.state.delIcon == interfaceCase._id ? 'block' : 'none' }}
          />
        </Tooltip>
      </div>
    </div>
    );
  }
  // 动态加载子节点数据
  onLoadData = (treeNode) => {
    console.log(treeNode._id);
    console.log('tree', treeNode);
    const id = (!treeNode.props) ? treeNode._id : treeNode.props._id;
    const catid = (!treeNode.props) ? treeNode.parent_id : treeNode.props.parent_id;
    const child_type = (!treeNode.props) ? treeNode.child_type : treeNode.props.child_type;
    const getCurCatId = child_type === 0 ? id : catid;
    console.log("11111111", id)
    console.log("11111111", catid)
    console.log("11111111", getCurCatId)
    return new Promise((resolve) => {
      let childrenList = [];
      // setState异步更新
      this.setState({
        curColId: getCurCatId
      }, async () => {
        childrenList = await this.getList(true);
        console.log('更新孩子----')
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
              checkable={true}
              key={'col_' + item._id}
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
            checkable={true}
            key={'col_' + item._id}
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
            checkable={true}
            key={'case_' + item._id}
            {...item}
            title={this.itemInterfaceCreateTitle(item)}
            dataRef={item}
            isLeaf={true}
          />
        );
      }
    });
  };
  reloadCurChildList = () => {
    // 把当前需要更新且已经加载的目录从已加载目录中删除,解决目录已经打开不会重新onload
    console.log('@@@@@', this.state.currentSelectNode)
    console.log('322^^^^^^', this.state.curColId)
    if (this.state.curColId !== -1) {
      console.log("hhahahg")
      console.log(this.state.currentSelectNode)
      console.log(this.state.curColId)
      const curParentKey = 'col_' + this.state.currentSelectNode.parent_id;
      let arr = this.state.expands ? this.state.expands.slice(0) : [];
      const newLoadKeys = arr.splice(arr.indexOf(curParentKey), 1);
      this.onLoadData(this.state.currentSelectNode);
      this.setState({
        expands: [...this.state.expands, this.state.currentSelectNode.key, curParentKey, newLoadKeys]
      })
    } else {
      // this.changeExpands();
      this.getList();
      console.log("gogogogogo")
    }
  };
  render() {
    // const { currColId, currCaseId, isShowCol } = this.props;
    const matchParams = this.props.match.params;
    const { colModalType, colModalVisible, importInterVisible } = this.state;
    const currProjectId = this.props.match.params.id;
    // const menu = (col) => {
    //   return (
    //     <Menu>
    //       <Menu.Item>
    //         <span onClick={() => this.showColModal('edit', col)}>修改集合</span>
    //       </Menu.Item>
    //       <Menu.Item>
    //         <span onClick={() => {
    //           this.showDelColConfirm(col._id)
    //         }}>删除集合</span>
    //       </Menu.Item>
    //       <Menu.Item>
    //         <span onClick={() => this.showImportInterface(col._id)}>导入接口</span>
    //       </Menu.Item>
    //     </Menu>
    //   )
    // };

    const defaultExpandedKeys = () => {
      const { router, currCase, interfaceColList } = this.props,
        rNull = { expands: [], selects: [] };
      if (interfaceColList&&interfaceColList.length === 0) {
        return rNull;
      }
      if (router) {
        if (router.params.action === 'case') {
          console.log("aaaaaa",)
          if (!currCase || !currCase._id) {
            return rNull;
          }
          console.log("bbbbbbb",this.state.expands,currCase.col_id)
          return {
            expands: this.state.expands ? this.state.expands : ['col_' + currCase.col_id],
            selects: this.state.selects ? this.state.selects : ['case_' + currCase._id + '']
          };
        } else {
          let col_id = router.params.actionId;
          console.log("cccccc",this.state.expands,col_id)
          return {
            expands: this.state.expands ? this.state.expands : ['col_' + col_id],
            selects: this.state.selects ? this.state.selects : ['col_' + col_id]
          };
        }
      } else {
        console.log("ddddd",this.state.expands,interfaceColList[0]._id)
        return {
          expands: this.state.expands ? this.state.expands : ['col_' + interfaceColList[0]._id],
          selects: ['root']
        };
      }
    };

    // const itemInterfaceColCreate = interfaceCase => {
    //   return (
    //     <TreeNode
    //       style={{ width: '100%' }}
    //       key={'case_' + interfaceCase._id}
    //       title={
            
    //       }
    //     />
    //   );
    // };

    let currentKes = defaultExpandedKeys();
    // console.log('currentKey', currentKes)

    let list = this.state.list;

    // if (this.state.filterValue) {
    //   let arr = [];
    //   list = list.filter(item => {

    //     item.caseList = item.caseList.filter(inter => {
    //       if (inter.casename.indexOf(this.state.filterValue) === -1 
    //       && inter.path.indexOf(this.state.filterValue) === -1
    //       ) {
    //         return false;
    //       }
    //       return true;
    //     });

    //     arr.push('col_' + item._id);
    //     return true;
    //   });
    //   // console.log('arr', arr);
    //   if (arr.length > 0) {
    //     currentKes.expands = arr;
    //   }
    // }

    // console.log('list', list);
    // console.log('currentKey', currentKes)

    return (
      <div>
        <div className="interface-filter">
          <Input placeholder="搜索测试集合" onChange={this.filterCol} />
          <Tooltip placement="bottom" title="添加集合">
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
          </Tooltip>
          <Tooltip placement="bottom" title="添加集合">
            <Button
              type="primary"
              style={{ marginLeft: '16px' }}
              onClick={() => this.showColModal('add')}
              className="btn-filter"
            >
              添加集合
            </Button>
          </Tooltip>
        </div>
        <div className="tree-wrapper" style={{ maxHeight: parseInt(document.body.clientHeight) - headHeight + 'px'}}>
          <Tree
            className="col-list-tree"
            loadData={this.onLoadData}
            defaultExpandedKeys={currentKes.expands}
            defaultSelectedKeys={currentKes.selects}
            expandedKeys={currentKes.expands}
            selectedKeys={currentKes.selects}
            onSelect={this.onSelect}
            autoExpandParent={false}
            draggable
            onExpand={this.onExpand}
            onDrop={this.onDrop}
            expandAction={"doubleClick"}
          >
            {/* {list.map(col => (
              <TreeNode
                key={'col_' + col._id}
                title={
                  
                }
              >
                {col.caseList.map(itemInterfaceColCreate)}
              </TreeNode>
            ))} */}
            {/* <TreeNode
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
                    to={'/project/' + matchParams.id + '/interface/case'}
                  >
                    <Icon type="folder" style={{ marginRight: 5 }} />
                    全部测试用例
                  </Link>
                }
                key="root"
              /> */}
              {this.renderTreeNodes(list)}
          </Tree>
        </div>
        <ColModalForm
          ref={this.saveFormRef}
          type={colModalType}
          visible={colModalVisible}
          onCancel={() => {
            this.setState({ colModalVisible: false });
          }}
          onCreate={this.addorEditCol}
        />

        <Modal
          title="导入接口到集合"
          visible={importInterVisible}
          onOk={this.showConfirm}
          onCancel={this.handleImportCancel}
          className="import-case-modal"
          width={800}
        >
          <ImportInterface currProjectId={currProjectId} selectInterface={this.selectInterface} />
        </Modal>
      </div>
    );
  }
}
