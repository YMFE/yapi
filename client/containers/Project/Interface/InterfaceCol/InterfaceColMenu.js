import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import {
  fetchInterfaceColList,
  fetchInterfaceCaseList,
  setColData,
  fetchCaseList,
  fetchCaseData,
} from '../../../../reducer/modules/interfaceCol'
import { fetchProjectList } from '../../../../reducer/modules/project'
import axios from 'axios'
import ImportInterface from './ImportInterface'
import { Input, Icon, Button, Modal, message, Tooltip, Tree, Form } from 'antd'
import { arrayChangeIndex } from '../../../../common.js' // menu顶部到网页顶部部分的高度

import './InterfaceColMenu.scss'

const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const confirm = Modal.confirm
const headHeight = 240
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
}
const ColModalForm = Form.create()(props => {
  const { visible, onCancel, onCreate, form, type } = props
  const { getFieldDecorator } = form
  return (
    <Modal
      visible={visible}
      title={type === 'add' ? '添加集合' : '更新集合'}
      onCancel={onCancel}
      onOk={onCreate}
    >
      <Form>
        <FormItem {...formItemLayout} label="集合名">
          {getFieldDecorator('colName', {
            rules: [{ required: true, message: '请输入集合命名！' }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="简介">
          {getFieldDecorator('colDesc')(<Input type="textarea" />)}
        </FormItem>
      </Form>
    </Modal>
  )
})

const FolderForm = Form.create()(props => {
  const { visible, onCancel, onOk, form, type } = props
  const { getFieldDecorator } = form
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      title={type === 'add' ? '创建目录' : '更新目录'}
    >
      <FormItem {...formItemLayout} label="目录名">
        {getFieldDecorator('folderName', {
          rules: [{ required: true, message: '请输入目录名！' }],
        })(<Input />)}
      </FormItem>
    </Modal>
  )
})

@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currCase: state.interfaceCol.currCase,
      isRander: state.interfaceCol.isRander,
      currCaseId: state.interfaceCol.currCaseId,
      // list: state.inter.list,
      // 当前项目的信息
      curProject: state.project.currProject,
      // projectList: state.project.projectList
    }
  },
  {
    fetchInterfaceColList,
    fetchInterfaceCaseList,
    fetchCaseData,
    // fetchInterfaceListMenu,
    fetchCaseList,
    setColData,
    fetchProjectList,
  },
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
    fetchProjectList: PropTypes.func,
    // projectList: PropTypes.array
  }

  state = {
    colModalType: '',
    colModalVisible: false,
    editColId: 0,
    filterValue: '',
    importInterVisible: false,
    importInterIds: [],
    importColId: 0,
    expands: [],
    selectedKeys: [],
    list: [],
    delIcon: null,
    selectedProject: null,
  }

  constructor(props) {
    super(props)
  }

  UNSAFE_componentWillMount() {
    this.getList()
    this.setState({
      selectedKeys: this.getSelectKeys(),
      expands: this.getExpandedKeys(),
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.interfaceColList !== nextProps.interfaceColList) {
      this.setState({
        list: nextProps.interfaceColList,
      })
    }
    if (this.props.currCase !== nextProps.currCase) {
      let expands = this.getExpandedKeys(nextProps)
      this.setState({
        selectedKeys: this.getSelectKeys(),
        expands: expands,
      })
    }
  }

  async getList() {
    let r = await this.props.fetchInterfaceColList(this.props.match.params.id)
    this.setState({
      list: r.payload.data.data,
    })
    return r
  }

  addorEditCol = async () => {
    const { colName: name, colDesc: desc } = this.form.getFieldsValue()
    const { colModalType, editColId: col_id } = this.state
    const project_id = this.props.match.params.id
    let res = {}
    if (colModalType === 'add') {
      res = await axios.post('/api/col/add_col', { name, desc, project_id })
    } else if (colModalType === 'edit') {
      res = await axios.post('/api/col/up_col', { name, desc, col_id })
    }
    if (!res.data.errcode) {
      this.setState({
        colModalVisible: false,
      })
      message.success(colModalType === 'edit' ? '修改集合成功' : '添加集合成功')
      // await this.props.fetchInterfaceColList(project_id);
      this.getList()
    } else {
      message.error(res.data.errmsg)
    }
  }

  addFolder = async () => {
    const { folderName } = this.folderForm.getFieldsValue()
    const { folderModalType, editFolderId } = this.state
    let res
    let params = {
      casename: folderName,
      project_id: this.props.match.params.id,
      col_id: this.state.folderColId,
      parent_id: this.state.folderParent,
      record_type: 2,
    }
    if (folderModalType === 'edit') {
      params['id'] = editFolderId
      res = await axios.post('/api/col/up_case', params)
    } else {
      res = await axios.post('/api/col/add_case', params)
    }
    if (!res.data.errcode) {
      this.setState({
        folderModalVisible: false,
      })
      message.success(
        folderModalType === 'edit' ? '修改目录成功' : '添加目录成功',
      )
      this.getList()
    } else {
      message.error(res.data.errmsg)
    }
  }

  onExpand = keys => {
    this.setState({ expands: keys })
  }

  onSelect = keys => {
    if (keys.length) {
      let curKey = keys[0]
      const type = curKey.split('_')[0]
      const id = curKey.split('_')[1]
      const project_id = this.props.match.params.id
      this.setState({
        selectedKeys: keys,
      })
      if (type === 'col' || type === 'dir') {
        if (type === 'col') {
          this.props.history.push(
            '/project/' + project_id + '/interface/col/' + id,
          )
        }
        this.props.setColData({
          isRander: false,
        })
        let expands = this.state.expands.concat()
        if (expands.indexOf(curKey) === -1) {
          expands.push(`${curKey}`)
        }
        this.setState({
          expands: expands,
        })
      } else if (type === 'case') {
        this.props.setColData({
          isRander: false,
        })
        this.props.history.push(
          '/project/' + project_id + '/interface/case/' + id,
        )
      }
    } else {
      return false
    }
  }

  showDelColConfirm = colId => {
    let that = this
    const params = this.props.match.params
    confirm({
      title: '您确认删除此测试集合',
      content: '温馨提示：该操作会删除该集合下所有测试用例，用例删除后无法恢复',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const res = await axios.get('/api/col/del_col?col_id=' + colId)
        if (!res.data.errcode) {
          message.success('删除集合成功')
          const result = await that.getList()
          const nextColId = result.payload.data.data[0]._id

          that.props.history.push(
            '/project/' + params.id + '/interface/col/' + nextColId,
          )
        } else {
          message.error(res.data.errmsg)
        }
      },
    })
  }

  // 复制测试集合
  copyInterface = async item => {
    if (this._copyInterfaceSign === true) {
      return
    }
    this._copyInterfaceSign = true
    const { desc, project_id, _id: col_id } = item
    let { name } = item
    name = `${name} copy`

    // 添加集合
    const add_col_res = await axios.post('/api/col/add_col', {
      name,
      desc,
      project_id,
    })

    if (add_col_res.data.errcode) {
      message.error(add_col_res.data.errmsg)
      return
    }

    const new_col_id = add_col_res.data.data._id

    // 克隆集合
    const add_case_list_res = await axios.post('/api/col/clone_case_list', {
      new_col_id,
      col_id,
      project_id,
    })
    this._copyInterfaceSign = false

    if (add_case_list_res.data.errcode) {
      message.error(add_case_list_res.data.errmsg)
      return
    }

    // 刷新接口列表
    // await this.props.fetchInterfaceColList(project_id);
    this.getList()
    this.props.setColData({ isRander: true })
    message.success('克隆测试集成功')
  }

  showNoDelColConfirm = () => {
    confirm({
      title: '此测试集合为最后一个集合',
      content: '温馨提示：建议不要删除',
    })
  }
  caseCopy = async caseId => {
    let that = this
    let caseData = await that.props.fetchCaseData(caseId)
    let data = caseData.payload.data.data
    data = JSON.parse(JSON.stringify(data))
    data.casename = `${data.casename}_copy`
    delete data._id
    const res = await axios.post('/api/col/add_case', data)
    if (!res.data.errcode) {
      message.success('克隆用例成功')
      let colId = res.data.data.col_id
      let projectId = res.data.data.project_id
      await this.getList()
      this.props.history.push(
        '/project/' + projectId + '/interface/col/' + colId,
      )
      this.setState({
        visible: false,
      })
    } else {
      message.error(res.data.errmsg)
    }
  }
  showDelCaseConfirm = caseId => {
    let that = this
    const params = this.props.match.params
    confirm({
      title: '您确认删除该内容',
      content: '温馨提示：删除后数据无法恢复',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const res = await axios.get('/api/col/del_case?caseid=' + caseId)
        if (!res.data.errcode) {
          message.success('删除成功')
          that.getList()
          // 如果删除当前选中 case，切换路由到集合
          if (+caseId === +that.props.currCaseId) {
            that.props.history.push('/project/' + params.id + '/interface/col/')
          } else {
            // that.props.fetchInterfaceColList(that.props.match.params.id);
            that.props.setColData({ isRander: true })
          }
        } else {
          message.error(res.data.errmsg)
        }
      },
    })
  }
  showColModal = (type, col) => {
    const editCol =
      type === 'edit'
        ? { colName: col.name, colDesc: col.desc }
        : { colName: '', colDesc: '' }
    this.setState({
      colModalVisible: true,
      colModalType: type || 'add',
      editColId: col && col._id,
    })
    this.form.setFieldsValue(editCol)
  }
  /**
   * case 目录操作
   */
  showFolderModal = (colId, parent, type, folder) => {
    const editFolder =
      type === 'edit' ? { folderName: folder.casename } : { folderName: '' }
    this.setState({
      folderModalVisible: true,
      folderColId: colId,
      folderParent: parent,
      folderModalType: type || 'add',
      editFolderId: folder && folder._id,
    })
    this.folderForm.setFieldsValue(editFolder)
  }
  saveFormRef = form => {
    this.form = form
  }
  saveFolderFormRef = form => {
    this.folderForm = form
  }

  selectInterface = (importInterIds, selectedProject) => {
    this.setState({ importInterIds, selectedProject })
  }

  showImportInterfaceModal = async (colId, parentId) => {
    // const projectId = this.props.match.params.id;
    const groupId = this.props.curProject.group_id
    await this.props.fetchProjectList(groupId)
    // await this.props.fetchInterfaceListMenu(projectId)
    this.setState({
      importInterVisible: true,
      importColId: colId,
      importParentId: parentId || '',
    })
  }

  handleImportOk = async () => {
    const project_id = this.state.selectedProject || this.props.match.params.id
    const { importColId, importInterIds, importParentId } = this.state
    const res = await axios.post('/api/col/add_case_list', {
      interface_list: importInterIds,
      col_id: importColId,
      parent_id: importParentId,
      project_id,
    })
    if (!res.data.errcode) {
      this.setState({ importInterVisible: false })
      message.success('导入集合成功')
      // await this.props.fetchInterfaceColList(project_id);
      this.getList()

      this.props.setColData({ isRander: true })
    } else {
      message.error(res.data.errmsg)
    }
  }
  handleImportCancel = () => {
    this.setState({ importInterVisible: false })
  }

  filterCol = e => {
    const value = e.target.value
    // const newList = produce(this.props.interfaceColList, draftList => {})
    this.setState({
      filterValue: value,
      list: JSON.parse(JSON.stringify(this.props.interfaceColList)),
      // list: newList
    })
  }

  getTreeNodeList = pos => {
    const { interfaceColList } = this.props
    let posArr = pos.split('-')
    posArr.shift()
    let treeNode = interfaceColList
    for (let i = 0; i < posArr.length; i++) {
      let idx = parseInt(posArr[i])
      if (i === posArr.length - 1) {
        return treeNode
      }
      if (treeNode && treeNode[idx] && treeNode[idx]['caseList']) {
        treeNode = treeNode[idx]['caseList']
      } else {
        return false
      }
    }
  }

  onDrop = async e => {
    const { interfaceColList } = this.props
    const dragKey = e.dragNode.props.eventKey
    const dropKey = e.node.props.eventKey

    const dragNode = e.dragNode.props.dataRef
    const dropNode = e.node.props.dataRef

    const dropPos = e.node.props.pos.split('-')
    const dragPos = e.dragNode.props.pos.split('-')
    const dropIndex = Number(dropPos[dropPos.length - 1])
    const dragIndex = Number(dragPos[dragPos.length - 1])

    if (dragKey.indexOf('col') === -1) {
      // 拖动非 col 类型
      if (dropKey.indexOf('col') !== -1 && e.dropToGap) {
        // 非 col 目录不能和 col 同级
        return message.warn('抱歉，非集合目录无法更改为顶级目录')
      }
      if (e.dropToGap || (!e.dropToGap && dropNode.record_type === 0)) {
        // 兄弟节点 || 如果父级节点是 case，也当兄弟处理，降低操作难度
        if (
          dragNode.col_id === dropNode.col_id &&
          dragNode.parent_id === dropNode.parent_id
        ) {
          // 同级调整顺序
          let curList = this.getTreeNodeList(e.node.props.pos)
          let changes = arrayChangeIndex(curList, dragIndex, dropIndex)
          axios.post('/api/col/up_case_index', { changes, dragNode }).then()
        } else {
          // 非同级，更改目录
          await axios.post('/api/col/up_dir', {
            id: dragNode._id,
            col_id: dropNode.col_id,
            parent_id: dropNode.parent_id,
            dragNode,
          })
        }
      } else {
        // 父子节点
        if (dropKey.indexOf('col') !== -1) {
          // 更改目录
          await axios.post('/api/col/up_dir', {
            id: dragNode._id,
            col_id: dropNode._id,
            parent_id: dropKey.indexOf('col') !== -1 ? '' : dropNode._id,
            dragNode,
          })
        } else if (dropNode.record_type === 2) {
          await axios.post('/api/col/up_dir', {
            id: dragNode._id,
            col_id: dropNode.col_id,
            parent_id: dropNode._id,
            dragNode,
          })
        }
      }
      this.getList()
      this.props.setColData({ isRander: true })
    } else {
      // 拖动的 col 类型
      if (!e.dropToGap || (e.dropToGap && dropKey.indexOf('col') === -1)) {
        // drop 非兄弟节点 || 兄弟节点不是 col 类型
        return message.warn('抱歉，集合目录为顶级目录，无法更改为二级目录')
      } else {
        // 更新 col index
        let changes = arrayChangeIndex(interfaceColList, dragIndex, dropIndex)
        axios.post('/api/col/up_col_index', { changes, dragNode }).then()
        this.getList()
      }
    }
  }

  enterItem = id => {
    this.setState({ delIcon: id })
  }

  leaveItem = () => {
    this.setState({ delIcon: null })
  }

  getSelectKeys = () => {
    const { router } = this.props
    if (router) {
      let actionId = router.params.actionId
      if (router.params.action === 'case') {
        return ['case_' + actionId + '']
      } else {
        return ['col_' + actionId]
      }
    } else {
      return ['root']
    }
  }

  getExpandedKeys = newProps => {
    const { router, currCase, interfaceColList } = newProps || this.props
    if (interfaceColList && interfaceColList.length === 0) {
      return []
    }
    if (router) {
      if (router.params.action === 'case') {
        if (!currCase || !currCase._id) {
          return []
        }
        let arr = currCase.ancestors
          ? currCase.ancestors.split(',').slice(1)
          : []
        let arrPush = []
        arr.map(v => {
          arrPush.push(`dir_${v}`)
        })
        arrPush.unshift(`col_${currCase.col_id}`)
        return arrPush.length ? arrPush : ['col_' + currCase.col_id]
      } else {
        let col_id = router.params.actionId
        return ['col_' + col_id]
      }
    } else {
      return ['col_' + interfaceColList[0]._id]
    }
  }
  render() {
    // const { currColId, currCaseId, isShowCol } = this.props;
    const { colModalType, colModalVisible, importInterVisible } = this.state
    const { folderModalType, folderModalVisible } = this.state
    const currProjectId = this.props.match.params.id
    const loopCase = caseList =>
      caseList.map(interfaceCase => {
        if (interfaceCase.record_type === 2) {
          return (
            <TreeNode
              autoExpandParent
              dataRef={interfaceCase}
              key={'dir_' + interfaceCase._id}
              title={
                <div className="menu-title">
                  <span>
                    <Icon type="folder-open" style={{ marginRight: 5 }} />
                    <span>{interfaceCase.casename}</span>
                  </span>
                  <div className="btns">
                    <Tooltip title="删除目录">
                      <Icon
                        type="delete"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.showDelCaseConfirm(interfaceCase._id)
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="编辑目录">
                      <Icon
                        type="edit"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.showFolderModal(
                            interfaceCase.col_id,
                            interfaceCase.parent_id,
                            'edit',
                            interfaceCase,
                          )
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="导入接口">
                      <Icon
                        type="plus"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.showImportInterfaceModal(
                            interfaceCase.col_id,
                            interfaceCase._id,
                          )
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="新增目录">
                      <Icon
                        type="folder"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.showFolderModal(
                            interfaceCase.col_id,
                            interfaceCase._id,
                            'add',
                          )
                        }}
                      />
                    </Tooltip>
                  </div>
                  {/*<Dropdown overlay={menu(col)} trigger={['click']} onClick={e => e.stopPropagation()}>
                <Icon className="opts-icon" type='ellipsis'/>
              </Dropdown>*/}
                </div>
              }
            >
              {interfaceCase.caseList && loopCase(interfaceCase.caseList)}
            </TreeNode>
          )
        } else {
          return (
            <TreeNode
              style={{ width: '100%' }}
              dataRef={interfaceCase}
              key={'case_' + interfaceCase._id}
              isLeaf={true}
              autoExpandParent
              title={
                <div
                  className="menu-title"
                  onMouseEnter={() => this.enterItem(interfaceCase._id)}
                  onMouseLeave={this.leaveItem}
                  title={interfaceCase.casename}
                >
                  <span className="casename">{interfaceCase.casename}</span>
                  <div className="btns">
                    <Tooltip title="删除用例">
                      <Icon
                        type="delete"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.showDelCaseConfirm(interfaceCase._id)
                        }}
                        style={{
                          display:
                            this.state.delIcon == interfaceCase._id
                              ? 'block'
                              : 'none',
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="克隆用例">
                      <Icon
                        type="copy"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.caseCopy(interfaceCase._id)
                        }}
                        style={{
                          display:
                            this.state.delIcon == interfaceCase._id
                              ? 'block'
                              : 'none',
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              }
            />
          )
        }
      })

    let currentExpands = this.state.expands

    let list = this.state.list
    if (this.state.filterValue) {
      let arr = []
      list = list.filter(item => {
        item.caseList = item.caseList.filter(inter => {
          if (
            inter.casename.indexOf(this.state.filterValue) === -1 &&
            inter.path &&
            inter.path.indexOf(this.state.filterValue) === -1 &&
            inter.r_method &&
            inter.r_method.indexOf(this.state.filterValue) === -1 &&
            inter.r_facade &&
            inter.r_facade.indexOf(this.state.filterValue) === -1
          ) {
            return false
          }
          return true
        })
        arr.push('col_' + item._id)
        return true
      })
      if (arr.length > 0) {
        currentExpands = arr
      }
    }
    return (
      <div>
        <div className="interface-filter">
          <Input placeholder="搜索测试集合" onChange={this.filterCol} />
          <div className="btn-filter">
            <Tooltip title="添加集合">
              <Button type="primary" onClick={() => this.showColModal('add')}>
                <Icon type="folder-add" />
                添加集合
              </Button>
            </Tooltip>
            <Tooltip title="使用指南">
              {/* 文档预留 */}
              使用指南 <Icon type="question-circle" />
            </Tooltip>
          </div>
        </div>
        {list && list.length ? (
          <div
            className="tree-wrapper"
            style={{
              maxHeight:
                parseInt(document.body.clientHeight) - headHeight + 'px',
            }}
          >
            <Tree
              className="col-list-tree"
              expandedKeys={currentExpands}
              selectedKeys={this.state.selectedKeys}
              onSelect={this.onSelect}
              draggable
              onExpand={this.onExpand}
              onDrop={this.onDrop}
            >
              {list.map(col => (
                <TreeNode
                  key={'col_' + col._id}
                  dataRef={col}
                  title={
                    <div className="menu-title">
                      <span>
                        <Icon type="folder-open" style={{ marginRight: 5 }} />
                        <span>{col.name}</span>
                      </span>
                      <div className="btns">
                        <Tooltip title="删除集合">
                          <Icon
                            type="delete"
                            style={{ display: list.length > 1 ? '' : 'none' }}
                            className="interface-delete-icon"
                            onClick={() => {
                              this.showDelColConfirm(col._id)
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="编辑集合">
                          <Icon
                            type="edit"
                            className="interface-delete-icon"
                            onClick={e => {
                              e.stopPropagation()
                              this.showColModal('edit', col)
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="导入接口">
                          <Icon
                            type="plus"
                            className="interface-delete-icon"
                            onClick={e => {
                              e.stopPropagation()
                              this.showImportInterfaceModal(col._id)
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="新增目录">
                          <Icon
                            type="folder"
                            className="interface-delete-icon"
                            onClick={e => {
                              e.stopPropagation()
                              this.showFolderModal(col._id, '', 'add')
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="克隆集合">
                          <Icon
                            type="copy"
                            className="interface-delete-icon"
                            onClick={e => {
                              e.stopPropagation()
                              this.copyInterface(col)
                            }}
                          />
                        </Tooltip>
                      </div>
                      {/*<Dropdown overlay={menu(col)} trigger={['click']} onClick={e => e.stopPropagation()}>
                      <Icon className="opts-icon" type='ellipsis'/>
                    </Dropdown>*/}
                    </div>
                  }
                  autoExpandParent
                >
                  {loopCase(col.caseList)}
                </TreeNode>
              ))}
            </Tree>
          </div>
        ) : null}

        <ColModalForm
          ref={this.saveFormRef}
          type={colModalType}
          visible={colModalVisible}
          onCancel={() => {
            this.setState({ colModalVisible: false })
          }}
          onCreate={this.addorEditCol}
        />
        <FolderForm
          ref={this.saveFolderFormRef}
          type={folderModalType}
          visible={folderModalVisible}
          onCancel={() => {
            this.setState({ folderModalVisible: false })
          }}
          onOk={this.addFolder}
        />
        {importInterVisible ? (
          <Modal
            title="导入接口到集合"
            visible={importInterVisible}
            onOk={this.handleImportOk}
            onCancel={this.handleImportCancel}
            className="import-case-modal"
            width={900}
          >
            <ImportInterface
              currProjectId={currProjectId}
              selectInterface={this.selectInterface}
            />
          </Modal>
        ) : null}
      </div>
    )
  }
}
