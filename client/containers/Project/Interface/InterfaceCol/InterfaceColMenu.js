import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { fetchInterfaceColList, fetchInterfaceCaseList, setColData, fetchCaseList } from '../../../../reducer/modules/interfaceCol'
import { fetchInterfaceList } from '../../../../reducer/modules/interface.js';
import axios from 'axios';
// import { Input, Icon, Button, Modal, message, Tooltip, Tree, Dropdown, Menu, Form } from 'antd';
import ImportInterface from './ImportInterface'
import { Input, Icon, Button, Modal, message, Tooltip, Tree, Form } from 'antd';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const confirm = Modal.confirm;

import './InterfaceColMenu.scss'

const ColModalForm = Form.create()((props) => {
  const { visible, onCancel, onCreate, form, title } = props;
  const { getFieldDecorator } = form;
  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={onCancel}
      onOk={onCreate}
    >
      <Form layout="vertical">
        <FormItem label="集合名">
          {getFieldDecorator('colName', {
            rules: [{ required: true, message: '请输入集合命名！' }]
          })(
            <Input />
            )}
        </FormItem>
        <FormItem label="简介">
          {getFieldDecorator('colDesc')(<Input type="textarea" />)}
        </FormItem>
      </Form>
    </Modal>
  )
});

@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currColId: state.interfaceCol.currColId,
      currCaseId: state.interfaceCol.currCaseId,
      isShowCol: state.interfaceCol.isShowCol,
      isRander: state.interfaceCol.isRander,
      list: state.inter.list
    }
  },
  {
    fetchInterfaceColList,
    fetchInterfaceCaseList,
    fetchInterfaceList,
    fetchCaseList,
    setColData
  }
)
@withRouter
export default class InterfaceColMenu extends Component {

  static propTypes = {
    match: PropTypes.object,
    interfaceColList: PropTypes.array,
    fetchInterfaceColList: PropTypes.func,
    fetchInterfaceCaseList: PropTypes.func,
    fetchInterfaceList: PropTypes.func,
    fetchCaseList: PropTypes.func,
    setColData: PropTypes.func,
    history: PropTypes.object,
    currColId: PropTypes.number,
    currCaseId: PropTypes.number,
    isShowCol: PropTypes.bool,
    isRander: PropTypes.bool,
    list: PropTypes.array
  }

  state = {
    expandedKeys: [],
    colModalType: '',
    colModalVisible: false,
    editColId: 0,
    filterValue: '',
    importInterVisible: false,
    importInterIds: [],
    importColId: 0
  }

  constructor(props) {
    super(props)
  }

  async componentWillMount() {
    const { isShowCol, currColId, currCaseId } = this.props;
    const action = isShowCol ? 'col' : 'case';
    const actionId = isShowCol ? currColId : currCaseId;
    this.setState({ expandedKeys: [action + '_' + actionId] })
  }

  async componentWillReceiveProps(nextProps) {
    const { currColId } = nextProps;
    let expandedKeys = this.state.expandedKeys;
    if (expandedKeys.indexOf('col_' + currColId) === -1) {
      expandedKeys = expandedKeys.concat(['col_' + currColId])
    }
    this.setState({ expandedKeys })
  }

  addorEditCol = async () => {
    const { colName: name, colDesc: desc } = this.form.getFieldsValue();
    const { colModalType, editColId: col_id } = this.state;
    const project_id = this.props.match.params.id;
    let res = {};
    if (colModalType === 'add') {
      res = await axios.post('/api/col/add_col', { name, desc, project_id })
    } else if (colModalType === 'edit') {
      res = await axios.post('/api/col/up_col', { name, desc, col_id })
    }
    if (!res.data.errcode) {
      this.setState({
        colModalVisible: false
      });
      message.success(colModalType === 'edit' ? '修改集合成功' : '添加集合成功');
      await this.props.fetchInterfaceColList(project_id);
    } else {
      message.error(res.data.errmsg);
    }
  }

  onExpand = (keys) => {
    this.setState({ expandedKeys: keys })
  }

  onSelect = (keys) => {
    if (keys.length) {
      const type = keys[0].split('_')[0];
      const id = keys[0].split('_')[1];
      const project_id = this.props.match.params.id
      if (type === 'col') {
        this.props.setColData({
          isShowCol: true,
          isRander: false,
          currColId: +id
        })
        this.props.history.push('/project/' + project_id + '/interface/col/' + id)
      } else {
        this.props.setColData({
          isShowCol: false,
          isRander: false,
          currCaseId: +id
        })
        this.props.history.push('/project/' + project_id + '/interface/case/' + id)
      }
    }
  }

  showDelColConfirm = (colId) => {
    let that = this;
    const params = this.props.match.params;
    confirm({
      title: '您确认删除此测试集合',
      content: '温馨提示：该操作会删除该集合下所有测试用例，用例删除后无法恢复',
      async onOk() {
        const res = await axios.get('/api/col/del_col?col_id=' + colId)
        if (!res.data.errcode) {
          message.success('删除集合成功');
          const result = await that.props.fetchInterfaceColList(that.props.match.params.id);
          const nextColId = result.payload.data.data[0]._id;

          that.props.history.push('/project/' + params.id + '/interface/col/' + nextColId);
        } else {
          message.error(res.data.errmsg);
        }
      }
    });
  }


  // 复制测试集合 
  copyInterface = async (item) => {    
    if(this._copyInterfaceSign === true){
      return ;
    }
    this._copyInterfaceSign = true;
    const { desc, project_id, _id: col_id } = item;
    let { name } = item;
    name = `${name} copy`;

    // 添加集合
    const add_col_res = await axios.post('/api/col/add_col', { name, desc, project_id });

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
    })
    this._copyInterfaceSign = false;

    if (add_case_list_res.data.errcode) {
      message.error(add_case_list_res.data.errmsg);
      return;
    }

    // 刷新接口列表  
    await this.props.fetchInterfaceColList(project_id);
    this.props.setColData({ currColId: + new_col_id, isRander: true })
    message.success('克隆测试集成功')

  }

  showNoDelColConfirm = () => {
    confirm({
      title: '此测试集合为最后一个集合',
      content: '温馨提示：建议不要删除'
    });
  }
  showDelCaseConfirm = (caseId) => {
    let that = this;
    const params = this.props.match.params;
    confirm({
      title: '您确认删除此测试用例',
      content: '温馨提示：用例删除后无法恢复',
      async onOk() {
        const res = await axios.get('/api/col/del_case?caseid=' + caseId)
        if (!res.data.errcode) {
          message.success('删除用例成功');
          // 如果删除当前选中 case，切换路由到集合
          if (+caseId === +that.props.currCaseId) {
            that.props.history.push('/project/' + params.id + '/interface/col/')
          } else {
            that.props.fetchInterfaceColList(that.props.match.params.id);
            that.props.setColData({ currColId: +that.props.currColId, isRander: true })
          }
        } else {
          message.error(res.data.errmsg);
        }
      }
    });
  }
  showColModal = (type, col) => {
    const editCol = type === 'edit' ? { colName: col.name, colDesc: col.desc } : { colName: '', colDesc: '' };
    this.setState({
      colModalVisible: true,
      colModalType: type || 'add',
      editColId: col && col._id
    })
    this.form.setFieldsValue(editCol)
  }
  saveFormRef = (form) => {
    this.form = form;
  }

  selectInterface = (importInterIds) => {
    // console.log(importInterIds)
    this.setState({ importInterIds })
  }

  showImportInterfaceModal = async (colId) => {
    const projectId = this.props.match.params.id;
    await this.props.fetchInterfaceList(projectId)
    this.setState({ importInterVisible: true, importColId: colId })
  }
  handleImportOk = async () => {
    const project_id = this.props.match.params.id;
    const { importColId, importInterIds } = this.state;
    const res = await axios.post('/api/col/add_case_list', {
      interface_list: importInterIds,
      col_id: importColId,
      project_id
    })
    if (!res.data.errcode) {
      this.setState({ importInterVisible: false })
      message.success('导入集合成功');
      await this.props.fetchInterfaceColList(project_id);
      this.props.setColData({ currColId: +this.props.currColId, isRander: true })
    } else {
      message.error(res.data.errmsg);
    }
  }
  handleImportCancel = () => {
    this.setState({ importInterVisible: false })
  }

  filterCol = (e) => {
    const value = e.target.value;
    this.setState({ filterValue: value })
  }

  onDrop = async (e) => {
    const projectId = this.props.match.params.id;
    const dropColIndex = e.node.props.pos.split('-')[1];

    const dropColId = this.props.interfaceColList[dropColIndex]._id;
    const id = e.dragNode.props.eventKey;
    const dragColIndex = e.dragNode.props.pos.split('-')[1];

    const dragColId = this.props.interfaceColList[dragColIndex]._id;

    if (id.indexOf('col') === -1 && dropColId !== dragColId) {
      // if (dropColId !== dragColId) {
      //  
      // } 
      // else {
      //   let caseList = this.props.interfaceColList[dropColIndex].caseList;
      //   const dropIndex = e.node.props.pos.split('-')[2];
      //   const dragIndex = e.dragNode.props.pos.split('-')[2];
      //   // caseList[dropIndex] = [caseList[dragIndex], caseList[dragIndex] = caseList[dropIndex]][0]
      //   let newArr = [].concat(caseList);
      //   newArr[dragIndex] = caseList[dropIndex];
      //   newArr[dropIndex] = caseList[dragIndex];
      //   let changes = [];
      //   newArr.forEach((item, index) => {
      //     changes.push({
      //       id: item._id,
      //       index: index
      //     })
      //   })
      //   axios.post('/api/col/up_col_index', changes).then()
      // }
      await axios.post('/api/col/up_case', { id: id.split('_')[1], col_id: dropColId });
      this.props.fetchInterfaceColList(projectId);
      this.props.setColData({ currColId: +this.props.currColId, isShowCol: true, isRander: true })


    }
  }

  render() {
    const { currColId, currCaseId, isShowCol } = this.props;
    const { colModalType, colModalVisible, filterValue, importInterVisible } = this.state;

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

    let isFilterCat = false;
    // console.log();
    // let caseList = this.props.interfaceColList.caseList;
    // if(caseList&&caseList.length>1){
    //   caseList = caseList.sort((a,b)=>{
    //     return a.index-b.index;
    //   });
    //   this.props.interfaceColList.caseList = caseList;
    // }
    const list = this.props.interfaceColList.filter(col => {
      if (col.name.indexOf(filterValue) !== -1) {
        isFilterCat = true;
        return true;
      }
      isFilterCat = false;

      let caseList = col.caseList.filter(item => {
        return item.casename.indexOf(filterValue) !== -1
      })

      return caseList.length > 0;
    });
    return (
      <div>
        <div className="interface-filter">
          <Input placeholder="搜索测试集合" onChange={this.filterCol} />
          <Tooltip placement="bottom" title="添加集合">
            <Button type="primary" style={{ marginLeft: "16px" }} onClick={() => this.showColModal('add')} className="btn-filter" >添加集合</Button>
          </Tooltip>
        </div>
        <Tree
          className="col-list-tree"
          expandedKeys={this.state.expandedKeys}
          selectedKeys={[isShowCol ? 'col_' + currColId : 'case_' + currCaseId]}
          onSelect={this.onSelect}
          autoExpandParent
          onExpand={this.onExpand}
          ondragstart={() => { return false }}
        >
          {
            list.map((col) => (
              <TreeNode
                key={'col_' + col._id}
                title={
                  <div className="menu-title">
                    <span><Icon type="folder-open" style={{ marginRight: 5 }} /><span>{col.name}</span></span>
                    <div className="btns">

                      <Tooltip title="删除集合">
                        <Icon type='delete' style={{display:list.length > 1 ? '': 'none' }} className="interface-delete-icon" onClick={() => {  this.showDelColConfirm(col._id)  }} />
                      </Tooltip>
                      <Tooltip title="编辑集合">
                        <Icon type='edit' className="interface-delete-icon" onClick={(e) => { e.stopPropagation(); this.showColModal('edit', col) }} />
                      </Tooltip>
                      <Tooltip title="导入接口">
                        <Icon type='plus' className="interface-delete-icon" onClick={(e) => { e.stopPropagation(); this.showImportInterfaceModal(col._id) }} />
                      </Tooltip>
                      <Tooltip title="克隆集合">
                        <Icon type='copy' className="interface-delete-icon" onClick={(e) => { e.stopPropagation(); this.copyInterface(col) }} />
                      </Tooltip>
                    </div>
                    {/*<Dropdown overlay={menu(col)} trigger={['click']} onClick={e => e.stopPropagation()}>
                      <Icon className="opts-icon" type='ellipsis'/>
                    </Dropdown>*/}
                  </div>
                }
              >
                {
                  col.caseList && col.caseList.filter((item) => {
                    if (isFilterCat) {
                      return true;
                    }
                    return item.casename.indexOf(filterValue) !== -1
                  }).sort((a, b) => {
                    return a.index - b.index;
                  }).map((interfaceCase) => (
                    <TreeNode
                      style={{ width: '100%' }}
                      key={'case_' + interfaceCase._id}
                      title={
                        <div className="menu-title" title={interfaceCase.casename}>
                          <span className="casename">{interfaceCase.casename}</span>
                          <Tooltip title="删除用例">
                            <Icon type='delete' className="case-delete-icon" onClick={(e) => { e.stopPropagation(); this.showDelCaseConfirm(interfaceCase._id) }} />
                          </Tooltip>
                        </div>
                      }
                    ></TreeNode>
                  ))
                }
              </TreeNode>
            ))
          }
        </Tree>
        <ColModalForm
          ref={this.saveFormRef}
          type={colModalType}
          visible={colModalVisible}
          onCancel={() => { this.setState({ colModalVisible: false }) }}
          onCreate={this.addorEditCol}
        ></ColModalForm>
        <Modal
          title="导入接口到集合"
          visible={importInterVisible}
          onOk={this.handleImportOk}
          onCancel={this.handleImportCancel}
          width={800}
        >
          <ImportInterface onChange={this.selectInterface} list={this.props.list} />
        </Modal>
      </div>
    )
  }
}
