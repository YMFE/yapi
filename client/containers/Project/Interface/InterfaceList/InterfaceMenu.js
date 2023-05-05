import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  fetchInterfaceListMenu,
  fetchInterfaceList,
  fetchInterfaceCatList,
  fetchInterfaceData,
  deleteInterfaceData,
  deleteInterfaceCatData,
  initInterface,
} from '../../../../reducer/modules/interface.js'
import { getProject } from '../../../../reducer/modules/project.js'
import { Input, Icon, Button, Modal, message, Tree, Tooltip } from 'antd'
import AddInterfaceForm from './AddInterfaceForm'
import AddInterfaceCatForm from './AddInterfaceCatForm'
import AddInterfaceFile from './AddInterfaceFile'
import AddInterfaceFolder from './AddInterfaceFolder'
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom'
import produce from 'immer'
import { arrayChangeIndex } from '../../../../common.js'
import variable from '../../../../constants/variable'
import './interfaceMenu.scss'

const confirm = Modal.confirm
const TreeNode = Tree.TreeNode
const headHeight = 240 // menu顶部到网页顶部部分的高度

@connect(
  state => {
    return {
      list: state.inter.list,
      inter: state.inter.curdata,
      curProject: state.project.currProject,
      expands: [],
    }
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
  },
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
  }

  /**
   * @param {String} key
   */
  changeModal = (key, status) => {
    /* 
      visible 
      add_cat_modal_visible
      change_cat_modal_visible 
      del_cat_modal_visible 
      add_file_modal_visible 
      add_folder_modal_visible 
    
    */
    let newState = {}
    newState[key] = status
    this.setState(newState)
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      curKey: null,
      visible: false,
      delIcon: null,
      curCatid: null,
      curParentId: '',
      add_cat_modal_visible: false,
      change_cat_modal_visible: false,
      del_cat_modal_visible: false,
      add_file_modal_visible: false,
      add_folder_modal_visible: false,
      curCatdata: {},
      expands: [],
      selectedKeys: [],
      list: [],
    }
    this.debounceOnFilter = _.debounce(this.onFilter, 300, false)
  }

  handleRequest() {
    this.props.initInterface()
    this.getList()
  }

  async getList() {
    let r = await this.props.fetchInterfaceListMenu(this.props.projectId)
    this.setState({
      list: r.payload.data.data,
    })
  }

  UNSAFE_componentWillMount() {
    this.handleRequest()
    let expands = this.getExpandedKeys(this.props)
    this.setState({
      selectedKeys: expands.selects,
      expands: expands.expands,
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      this.setState({
        list: nextProps.list,
      })
    }
    if (this.props.inter !== nextProps.inter) {
      let expands = this.getExpandedKeys(nextProps)
      this.setState({
        expands: expands.expands,
        selectedKeys: expands.selects,
      })
    }
  }

  onSelect = selectedKeys => {
    if (!selectedKeys.length) {
      return false
    }
    let curKey = selectedKeys[0]
    let expands = this.state.expands.concat()
    if (expands.indexOf(curKey) === -1) {
      expands.push(`${curKey}`)
    }
    this.setState({
      expands: expands,
      selectedKeys: selectedKeys,
    })
  }

  changeExpands = () => {
    this.setState({
      expands: null,
    })
  }

  handleAddInterface = (data, cb) => {
    data.project_id = this.props.projectId
    axios.post('/api/interface/add', data).then(res => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg)
      }
      message.success('接口添加成功')
      let interfaceId = res.data.data._id
      this.props.history.push(
        '/project/' + this.props.projectId + '/interface/api/' + interfaceId,
      )
      this.getList()
      this.setState({
        visible: false,
      })
      if (cb) {
        cb()
      }
    })
  }

  //添加文件 wiki
  handleAddInterfaceFile = (data, cb) => {
    // const actionId = this.props.router.params.actionId
    data.project_id = this.props.projectId
    axios.post('/api/interface/add', data).then(res => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg)
      }
      message.success('wiki添加成功')
      let interfaceId = res.data.data._id
      this.props.history.push(
        '/project/' + this.props.projectId + '/interface/api/' + interfaceId,
      )
      this.getList()
      this.setState({
        add_file_modal_visible: false,
      })
      if (cb) {
        cb()
      }
    })
  }

  //添加目录
  handleAddInterfaceFolder = data => {
    data.project_id = this.props.projectId
    axios.post('/api/interface/add', data).then(res => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg)
      }
      message.success('目录创建成功')
      this.getList()
      this.setState({
        add_folder_modal_visible: false,
      })
    })
  }

  handleAddInterfaceCat = data => {
    data.project_id = this.props.projectId
    axios.post('/api/interface/add_cat', data).then(res => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg)
      }
      message.success('接口分类添加成功')
      this.getList()
      this.props.getProject(data.project_id)
      this.setState({
        add_cat_modal_visible: false,
      })
    })
  }

  handleChangeInterfaceCat = data => {
    data.project_id = this.props.projectId

    let params = {
      catid: this.state.curCatdata._id,
      name: data.name,
      desc: data.desc,
    }

    axios.post('/api/interface/up_cat', params).then(res => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg)
      }
      message.success('接口分类更新成功')
      this.getList()
      this.props.getProject(data.project_id)
      this.setState({
        change_cat_modal_visible: false,
      })
    })
  }

  handleChangeInterfaceFolder = data => {
    axios.post('/api/interface/up', data).then(res => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg)
      }
      message.success('目录更新成功')
      this.getList()
      this.setState({
        change_dir_modal_visible: false,
      })
    })
  }

  showConfirm = data => {
    let that = this
    let id = data._id
    let catid = data.catid
    const ref = confirm({
      title: '您确认删除此该内容 ?',
      content: '温馨提示：删除后，无法恢复',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await that.props.deleteInterfaceData(id, that.props.projectId)
        await that.getList()
        await that.props.fetchInterfaceCatList({ catid })
        ref.destroy()
        that.props.history.push(
          '/project/' +
            that.props.match.params.id +
            '/interface/api/cat_' +
            catid,
        )
      },
      onCancel() {
        ref.destroy()
      },
    })
  }

  showDelCatConfirm = catid => {
    let that = this
    const ref = confirm({
      title: '确定删除此接口分类吗？',
      content: '温馨提示：该操作会删除该分类下所有接口，接口删除后无法恢复',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await that.props.deleteInterfaceCatData(catid, that.props.projectId)
        await that.getList()
        await that.props.fetchInterfaceList({
          project_id: that.props.projectId,
        })
        that.props.history.push(
          '/project/' + that.props.match.params.id + '/interface/api',
        )
        ref.destroy()
      },
      onCancel() {},
    })
  }

  copyInterface = async id => {
    let interfaceData = await this.props.fetchInterfaceData(id)
    let data = interfaceData.payload.data.data
    let newData = produce(data, draftData => {
      draftData.title = draftData.title + '_copy'
      if (draftData.record_type === 0) {
        if (draftData.interface_type === 'http') {
          draftData.path = draftData.path + '_' + Date.now()
        } else {
          draftData.r_facade = draftData.r_facade + '_' + Date.now()
        }
      }
    })

    axios.post('/api/interface/add', newData).then(async res => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg)
      }
      message.success('接口添加成功')
      let interfaceId = res.data.data._id
      await this.getList()
      this.props.history.push(
        '/project/' + this.props.projectId + '/interface/api/' + interfaceId,
      )
      this.setState({
        visible: false,
      })
    })
  }

  enterItem = id => {
    this.setState({ delIcon: id })
  }

  leaveItem = () => {
    this.setState({ delIcon: null })
  }

  onFilter = val => {
    this.setState({
      filter: val,
    })
  }

  onExpand = keys => {
    this.setState({
      expands: keys,
    })
  }

  getTreeNodeList = pos => {
    const { list } = this.props
    let posArr = pos.split('-')
    posArr.shift()
    let treeNode = list
    for (let i = 0; i < posArr.length; i++) {
      let idx = parseInt(posArr[i])
      // 因为存在 tree 中存在多一个 "全部接口"
      if (i === 0) {
        idx -= 1
      }
      if (i === posArr.length - 1) {
        return treeNode
      }
      if (treeNode && treeNode[idx] && treeNode[idx]['list']) {
        treeNode = treeNode[idx]['list']
      } else {
        return false
      }
    }
  }

  onDrop = async e => {
    const dropIdx = e.node.props.pos.split('-')[1] - 1
    const dragIdx = e.dragNode.props.pos.split('-')[1] - 1
    if (dropIdx < 0 || dragIdx < 0) {
      return
    }
    const { list } = this.props
    const dragNode = e.dragNode.props.dataRef
    const dropNode = e.node.props.dataRef
    const dragKey = e.dragNode.props.eventKey
    const dropKey = e.node.props.eventKey

    const dropPos = e.node.props.pos.split('-')
    const dragPos = e.dragNode.props.pos.split('-')
    const dropIndex = Number(dropPos[dropPos.length - 1])
    const dragIndex = Number(dragPos[dragPos.length - 1])

    if (dragKey.indexOf('cat') === -1) {
      // 拖动的非 cat 类型
      if (dropKey.indexOf('cat') !== -1 && e.dropToGap) {
        // 非 cat 类型不能和 cat 同级
        return message.warn('抱歉，非分类目录无法更改为顶级目录')
      }
      if (
        e.dropToGap ||
        (!e.dropToGap &&
          (dropNode.record_type === 1 || dropNode.record_type === 0))
      ) {
        // 兄弟节点，如果父级节点是否是 doc 或 api,也当兄弟处理，降低用户操作难度
        if (
          dragNode.catid === dropNode.catid &&
          dragNode.parent_id === dropNode.parent_id
        ) {
          // 同级调整顺序
          let curList = this.getTreeNodeList(e.node.props.pos)
          let changes = arrayChangeIndex(curList, dragIndex, dropIndex)
          axios.post('/api/interface/up_index', { changes, dragNode })
        } else {
          // 更改目录
          await axios.post('/api/interface/up_dir', {
            id: dragNode._id,
            catid: dropNode.catid,
            parent_id: dropNode.parent_id || '',
            dragNode,
          })
        }
      } else {
        // 父子节点
        if (dropKey.indexOf('cat') !== -1) {
          // 更改目录
          await axios.post('/api/interface/up_dir', {
            id: dragNode._id,
            catid: dropNode._id,
            parent_id: '',
            dragNode,
          })
        } else if (dropNode.record_type === 2) {
          await axios.post('/api/interface/up_dir', {
            id: dragNode._id,
            catid: dropNode.catid,
            parent_id: dropNode._id,
            dragNode,
          })
        }
      }
      const { projectId, router } = this.props
      this.props.fetchInterfaceListMenu(projectId)
      if (router && isNaN(router.params.actionId)) {
        let catid = router.params.actionId.substr(4)
        this.props.fetchInterfaceCatList({ catid })
      }
    } else {
      // 拖动的 cat 类型
      if (!e.dropToGap || (e.dropToGap && dropKey.indexOf('cat') === -1)) {
        // drop 非兄弟节点 || drop 在兄弟层级，但兄弟非 cat 类型
        return message.warn('抱歉，集合目录为顶级目录，无法更改为二级目录')
      } else {
        // 更新 cat index
        let changes = arrayChangeIndex(list, dragIndex - 1, dropIndex - 1)
        axios.post('/api/interface/up_cat_index', { changes, dragNode })
        this.props.fetchInterfaceListMenu(this.props.projectId)
      }
    }
  }

  getExpandedKeys = props => {
    const { router, inter } = props,
      rNull = { expands: [], selects: [] }
    if (router) {
      if (!isNaN(+router.params.actionId)) {
        if (!inter || !inter._id) {
          return rNull
        }
        let arr = inter.ancestors ? inter.ancestors.split(',').slice(1) : []
        let arrPush = []
        arr.map(v => {
          arrPush.push(`dir_${v}`)
        })
        arrPush.push(`cat_${inter.catid}`)
        return {
          expands: arrPush,
          selects: [inter._id + ''],
        }
      } else {
        let catKey = router.params.actionId
        return {
          expands: [catKey],
          selects: [catKey],
        }
      }
    } else {
      return {
        expands: [],
        selects: ['root'],
      }
    }
  }

  strFilter = (str, filter) => {
    const filterStr = filter || this.state.filter.toLowerCase()
    if (str && str.toLowerCase().indexOf(filterStr) !== -1) {
      return true
    }
    return false
  }

  recursFilter = list => {
    const that = this
    let newList = []
    let expandArr = []
    for (let inter of list) {
      const recordType = inter.record_type
      if (recordType === 2) {
        let recursRes = this.recursFilter(inter.list)
        inter.list = recursRes.list
        expandArr = expandArr.concat(recursRes.arr)
        if (inter.list.length) {
          expandArr.push('dir_' + inter._id)
          newList.push(inter)
        }
      } else if (recordType === 1) {
        if (that.strFilter(inter.title)) {
          newList.push(inter)
        }
      } else {
        if (
          that.strFilter(inter.title) ||
          that.strFilter(inter.path) ||
          that.strFilter(inter.r_method) ||
          that.strFilter(inter.r_facade)
        ) {
          newList.push(inter)
        }
      }
    }
    return { list: newList, arr: expandArr }
  }

  // 数据过滤
  filterList = list => {
    let arr = []
    let menuList = produce(list, draftList => {
      for (let inter of draftList) {
        let filterRes = this.recursFilter(inter.list)
        inter.list = filterRes.list
        if (inter.list.length) {
          arr.push('cat_' + inter._id)
          arr = arr.concat(filterRes.arr)
        }
      }
    })
    return { menuList, arr }
  }

  render() {
    const matchParams = this.props.match.params
    const searchBox = (
      <div className="interface-filter">
        <Input
          onChange={e => this.debounceOnFilter(e.target.value)}
          // value={this.state.filter}
          placeholder="搜索接口"
        />
        <div className="btn-filter">
          <Tooltip title="添加分类">
            <Button
              type="primary"
              onClick={() => this.changeModal('add_cat_modal_visible', true)}
            >
              <Icon type="folder-add" />
              添加分类
            </Button>
          </Tooltip>

          <Tooltip title="使用指南">
            <a className="btn-tip" target="_blank" rel="noopener noreferrer">
              {/* 文档预留 */}
              使用指南 <Icon type="question-circle" />
            </a>
          </Tooltip>
        </div>

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
              parentid={this.state.curParentId}
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

        {this.state.change_dir_modal_visible ? (
          <Modal
            title="修改目录"
            visible={this.state.change_dir_modal_visible}
            onCancel={() => this.changeModal('change_dir_modal_visible', false)}
            footer={null}
            className="addcatmodal"
          >
            <AddInterfaceFolder
              dirdata={this.state.curDirData}
              onCancel={() =>
                this.changeModal('add_folder_modal_visible', false)
              }
              onSubmit={this.handleChangeInterfaceFolder}
            />
          </Modal>
        ) : (
          ''
        )}

        {this.state.add_folder_modal_visible ? (
          <Modal
            title="创建目录"
            visible={this.state.add_folder_modal_visible}
            onCancel={() => this.changeModal('add_folder_modal_visible', false)}
            footer={null}
            className="addcatmodal"
          >
            <AddInterfaceFolder
              catdata={this.state.curCatdata}
              catid={this.state.curCatid}
              parentid={this.state.curParentId}
              onCancel={() =>
                this.changeModal('add_folder_modal_visible', false)
              }
              onSubmit={this.handleAddInterfaceFolder}
            />
          </Modal>
        ) : (
          ''
        )}

        {this.state.add_file_modal_visible ? (
          <Modal
            title="创建文档"
            visible={this.state.add_file_modal_visible}
            onCancel={() => this.changeModal('add_file_modal_visible', false)}
            footer={null}
            className="addcatmodal"
          >
            <AddInterfaceFile
              catdata={this.state.curCatdata}
              catid={this.state.curCatid}
              parentid={this.state.curParentId}
              onCancel={() => this.changeModal('add_file_modal_visible', false)}
              onSubmit={this.handleAddInterfaceFile}
            />
          </Modal>
        ) : (
          ''
        )}
      </div>
    )
    const getTitle = data => {
      if (data.record_type === 2) {
        return (
          <div>
            <Icon type="folder-open" style={{ marginRight: 5 }} />
            {data.title || data.name}
          </div>
        )
      } else if (data.record_type === 1) {
        return (
          <div>
            <Icon type="file-text" style={{ marginRight: 5 }} />
            {data.title || data.name}
          </div>
        )
      } else if (data.record_type === 0) {
        let methodColor =
          variable.METHOD_COLOR[
            data.method ? data.method.toLowerCase() : 'get'
          ] || variable.METHOD_COLOR['get']
        if (data.interface_type === 'http') {
          return (
            <div>
              <span style={{ color: methodColor.color }}>{data.method}</span>{' '}
              {data.title || data.name}
            </div>
          )
        } else {
          methodColor = variable.METHOD_COLOR['dubbo']
          return (
            <div>
              <span style={{ color: methodColor.color }}>DUBBO</span>{' '}
              {data.title || data.name}
            </div>
          )
        }
      }
    }

    const loop = data =>
      data.map(item => {
        if (item.itemType === 'cat') {
          //一级目录，cat 目录
          return (
            <TreeNode
              dataRef={item}
              title={
                <div
                  className="container-title"
                  onMouseEnter={() => this.enterItem(item._id)}
                  onMouseLeave={this.leaveItem}
                >
                  <Link
                    className="interface-item"
                    to={
                      '/project/' +
                      matchParams.id +
                      '/interface/api/cat_' +
                      item._id
                    }
                  >
                    <Icon type="folder-open" style={{ marginRight: 5 }} />
                    {item.name || item.title}
                  </Link>
                  <div className="btns">
                    <Tooltip title="删除分类">
                      <Icon
                        type="delete"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.showDelCatConfirm(item._id)
                        }}
                        style={{
                          display:
                            this.state.delIcon == item._id ? 'block' : 'none',
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="修改分类">
                      <Icon
                        type="edit"
                        className="interface-delete-icon"
                        style={{
                          display:
                            this.state.delIcon == item._id ? 'block' : 'none',
                        }}
                        onClick={e => {
                          e.stopPropagation()
                          this.changeModal('change_cat_modal_visible', true)
                          this.setState({
                            curCatdata: item,
                          })
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="添加接口">
                      <Icon
                        type="plus"
                        className="interface-delete-icon"
                        style={{
                          display:
                            this.state.delIcon == item._id ? 'block' : 'none',
                        }}
                        onClick={e => {
                          e.stopPropagation()
                          this.changeModal('visible', true)
                          this.setState({
                            curCatid: item._id,
                            curParentId: '',
                          })
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="创建目录">
                      <Icon
                        type="folder"
                        className="interface-delete-icon"
                        style={{
                          display:
                            this.state.delIcon == item._id ? 'block' : 'none',
                        }}
                        onClick={e => {
                          e.stopPropagation()
                          this.changeModal('add_folder_modal_visible', true)
                          this.setState({
                            curCatid: item._id,
                            curParentId: '',
                          })
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="创建文档">
                      <Icon
                        type="file"
                        className="interface-delete-icon"
                        style={{
                          display:
                            this.state.delIcon == item._id ? 'block' : 'none',
                        }}
                        onClick={e => {
                          e.stopPropagation()
                          this.changeModal('add_file_modal_visible', true)
                          this.setState({
                            curCatid: item._id,
                            curParentId: '',
                          })
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              }
              key={'cat_' + item._id}
              className={`interface-item-nav1`}
            >
              {loop(item.list)}
            </TreeNode>
          )
        } else if (item.record_type === 2) {
          //文件夹类型
          return (
            <TreeNode
              dataRef={item}
              className={`interface-item-nav2`}
              title={
                <div
                  className="container-title"
                  onMouseEnter={() => this.enterItem(item._id)}
                  onMouseLeave={this.leaveItem}
                >
                  <div className="interface-item">{getTitle(item)}</div>
                  <div className="btns">
                    <Tooltip title="删除">
                      <Icon
                        type="delete"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.showConfirm(item)
                        }}
                        style={{
                          display:
                            this.state.delIcon == item._id ? 'block' : 'none',
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="修改目录">
                      <Icon
                        type="edit"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.changeModal('change_dir_modal_visible', true)
                          this.setState({
                            curDirData: item,
                          })
                        }}
                        style={{
                          display:
                            this.state.delIcon == item._id ? 'block' : 'none',
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="创建目录">
                      <Icon
                        type="folder"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.changeModal('add_folder_modal_visible', true)
                          this.setState({
                            curCatid: item.catid,
                            curParentId: item._id,
                          })
                        }}
                        style={{
                          display:
                            this.state.delIcon == item._id ? 'block' : 'none',
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="创建接口">
                      <Icon
                        type="plus"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.changeModal('visible', true)
                          this.setState({
                            curCatid: item.catid,
                            curParentId: item._id,
                          })
                        }}
                        style={{
                          display:
                            this.state.delIcon == item._id ? 'block' : 'none',
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="创建文档">
                      <Icon
                        type="file"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.changeModal('add_file_modal_visible', true)
                          this.setState({
                            curCatid: item.catid,
                            curParentId: item._id,
                          })
                        }}
                        style={{
                          display:
                            this.state.delIcon == item._id ? 'block' : 'none',
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              }
              key={'dir_' + item._id}
            >
              {item.list && loop(item.list)}
            </TreeNode>
          )
        } else {
          //文档 || api 类型
          return (
            <TreeNode
              dataRef={item}
              className={`interface-item-nav3`}
              title={
                <div
                  className="container-title"
                  onMouseEnter={() => this.enterItem(item._id)}
                  onMouseLeave={this.leaveItem}
                >
                  <Link
                    className="interface-item"
                    onClick={e => {
                      e.stopPropagation()
                    }}
                    to={
                      '/project/' +
                      matchParams.id +
                      '/interface/api/' +
                      item._id
                    }
                  >
                    {getTitle(item)}
                  </Link>
                  <div className="btns">
                    <Tooltip title="删除">
                      <Icon
                        type="delete"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.showConfirm(item)
                        }}
                        style={{
                          display:
                            this.state.delIcon == item._id ? 'block' : 'none',
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="复制">
                      <Icon
                        type="copy"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.copyInterface(item._id)
                        }}
                        style={{
                          display:
                            this.state.delIcon == item._id ? 'block' : 'none',
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              }
              key={'' + item._id}
            />
          )
        }
      })

    let currentExpands = this.state.expands
    let menuList
    if (this.state.filter) {
      let res = this.filterList(this.state.list)
      menuList = res.menuList
      currentExpands = res.arr
    } else {
      menuList = this.state.list
    }

    return (
      <div>
        {searchBox}
        {menuList && menuList.length > 0 ? (
          <div className="tree-wrappper">
            <Tree
              className="interface-list"
              expandedKeys={currentExpands}
              selectedKeys={this.state.selectedKeys}
              onSelect={this.onSelect}
              onExpand={this.onExpand}
              draggable
              onDrop={this.onDrop}
              autoExpandParent={false}
            >
              <TreeNode
                className="item-all-interface"
                title={
                  <Link
                    onClick={e => {
                      e.stopPropagation()
                    }}
                    to={'/project/' + matchParams.id + '/interface/api'}
                  >
                    <Icon type="folder" style={{ marginRight: 5 }} />
                    全部接口
                  </Link>
                }
                key="root"
              />
              {loop(menuList)}
            </Tree>
          </div>
        ) : null}
      </div>
    )
  }
}

export default withRouter(InterfaceMenu)
