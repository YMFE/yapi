import React, { Component } from 'react'
import {
  BackTop,
  message,
  Modal,
  Tree,
  Icon,
  Tooltip,
  Spin,
  Upload,
  Dropdown,
  Menu,
} from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import _ from 'lodash'
import tocbot from 'tocbot'
import Viewer from 'viewerjs'
import TuiViewer from 'client/components/Editor/View'
import Breadcrumb from './Breadcrumb/Breadcrumb.js'
import 'viewerjs/dist/viewer.css'
import './index.scss'

const confirm = Modal.confirm
const { TreeNode } = Tree

@connect(state => {
  return {
    projectData: state.project.currProject,
  }
}, {})
@withRouter
class WikiPage extends Component {
  static propTypes = {
    match: PropTypes.object,
    projectData: PropTypes.object,
    history: PropTypes.object,
  }

  constructor(props) {
    super(props)
    let curWikiId = props.match.params.wiki_id
    this.state = {
      id: curWikiId,
      markdown: '',
      editUid: '',
      editName: '',
      editorTimeAt: 0,
      pageList: [], //  页面列表
      wikiLoading: false,
      fileList: [], //附件列表
      importVisible: false,
      importing: false,
      selectedKeys: [curWikiId],
      expandedKeys: [curWikiId],
      pathList: [],
    }
    this.viewerRef = React.createRef()
  }

  componentDidMount() {
    this.vRef = this.viewerRef.current.getInstance()
    this.fetchDocList()
    if (this.state.id) {
      this.fetchData()
    }
    this.initToc()
  }

  initToc = async () => {
    tocbot.init({
      tocSelector: '.aside-directory',
      contentSelector: '#viewContainer',
      headingSelector: 'h1, h2, h3, h4, h5, h6',
      scrollContainer: null,
      collapseDepth: 6,
    })
  }

  initImgViewer = () => {
    if (this.viewer) {
      this.viewer.destroy()
    }
    this.viewer = new Viewer(document.getElementById('viewContainer'), {
      show() {
        this.viewer.update()
      },
      viewed() {
        this.viewer.zoom(0)
      },
      container: 'body',
      toolbar: false,
      navbar: false,
      movable: false,
    })
  }

  componentWillUnmount() {
    document.title = `落兵台 · 接口文档管理平台`
  }

  componentDidUpdate(prevProps) {
    const curProjectData = this.props.projectData
    const curDocTitle = this.state.title
    document.title = curDocTitle
      ? `文档 · ${curDocTitle}`
      : curProjectData && curProjectData
      ? `${curProjectData.name} · 文档`
      : '文档'
    const curDocId = this.props.match.params.wiki_id
    if (prevProps.match.params.wiki_id !== curDocId) {
      this.setState(
        {
          id: curDocId,
          title: '',
          markdown: '',
          editUid: '',
          editName: '',
          selectedKeys: [curDocId],
        },
        () => {
          this.vRef.setMarkdown('')
          this.fetchData()
        },
      )
    }
  }

  fetchDocList = async () => {
    let response = await axios.get('/api/plugin/wiki_action/get_page_list', {
      params: {
        project_id: this.props.match.params.id,
      },
    })
    let pageList = _.get(response, ['data', 'data'], [])
    this.setState({
      pageList: pageList,
    })
    if (pageList.length && !this.state.id) {
      let firstPage = pageList[0]
      this.redirectTo.page(firstPage['_id'])
    }
    return
  }

  hashCode = s =>
    s.split('').reduce(function(a, b) {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)

  fetchDocContent = async () => {
    let id = this.state.id
    let response = await axios.get('/api/plugin/wiki_action/get_detail', {
      params: {
        id: id,
      },
    })

    let record = _.get(response, ['data', 'data'], {})
    if (_.isEmpty(record)) {
      record = {}
    }

    let {
      title = '',
      markdown = '',
      uid: editUid = 0,
      up_time: editorTimeAt = 0,
      file = [],
      ancestorData = [],
    } = record
    let fileList = []
    file.forEach(file => {
      fileList.push({
        url: file.path,
        name: `${file.name} (${this.sizeChange(file.size)})`,
        uid: file._id,
      })
    })
    this.vRef.setMarkdown(markdown)
    var viewerContent = document.getElementById('viewContainer')
    var headList = viewerContent.querySelectorAll('h1, h2, h3, h4, h5, h6')
    for (let idx = 0; idx < headList.length; idx++) {
      headList[idx].setAttribute('id', this.hashCode(headList[idx].innerHTML))
    }

    this.setState(
      {
        markdown,
        title,
        editUid,
        editorTimeAt,
        fileList,
        wikiLoading: false,
        pathList: ancestorData,
      },
      () => {
        tocbot.refresh()
        this.initImgViewer()
        if (location.hash) {
          var url = location.href
          location.href = location.hash
          history.replaceState(null, null, url)
        }
      },
    )
    return
  }

  fetchData = async () => {
    this.setState(
      {
        wikiLoading: true,
      },
      async () => {
        await this.fetchDocContent()
      },
    )
  }

  redirectTo = {
    page: (id = '') => {
      this.props.history.replace(this.pathTo.page(id))
    },
    edit: (id = '') => {
      this.props.history.push(this.pathTo.edit(id))
    },
    create: (parent_id = '') => {
      this.props.history.push(this.pathTo.create(parent_id))
    },
  }
  pathTo = {
    page: (id = '') => {
      return `/project/${this.props.match.params.id}/wiki/page/${id}`
    },
    edit: (id = '') => {
      return `/project/${this.props.match.params.id}/wiki/edit/${id}`
    },
    create: (parent = '') => {
      return `/project/${this.props.match.params.id}/wiki/create/${parent}`
    },
  }

  onRemove = async id => {
    let option = {
      id: id,
      email_notice: false,
    }
    let result = await axios.post('/api/plugin/wiki_action/remove', option)
    if (result.data.errcode === 0) {
      message.success(`删除成功`)
      this.redirectTo.page()
      this.fetchDocList()
    } else {
      message.error(`删除失败： ${result.data.errmsg}`)
    }
  }

  arrayChangeIndex = (arr, start, end) => {
    let newArr = [].concat(arr)
    let startItem = newArr[start]
    newArr.splice(start, 1)
    newArr.splice(end, 0, startItem)
    let changes = []
    newArr.forEach((item, index) => {
      changes.push({
        id: item._id,
        index: index,
      })
    })
    return changes
  }

  /**
   * @param tree 相关
   */
  onExpand = keys => {
    this.setState({
      expandedKeys: keys,
    })
  }

  onDragEnter = e => {
    this.setState({
      expandedKeys: e.expandedKeys,
    })
  }

  changeModal = (key, status) => {
    let newState = {}
    newState[key] = status
    this.setState(newState)
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  //新增文件
  addWikiConfirm = info => {
    this.redirectTo.create(info._id)
  }

  createPage = () => {
    this.redirectTo.create()
  }

  onCreateMenuClick = e => {
    let key = e.key
    switch (key) {
      case 'import':
        this.onImportShow()
        break
      case 'create':
        this.createPage()
        break
      default:
        break
    }
  }

  onImportShow = () => {
    this.setState({
      importVisible: true,
    })
  }
  onImportHide = () => {
    this.setState({
      importVisible: false,
    })
  }

  //删除文件
  showConfirm = data => {
    let that = this
    const ref = confirm({
      title: `确认删除文件 ${data.title} 及其下级文件 ?`,
      content: '温馨提示：删除后，无法恢复',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await that.onRemove(data._id)
      },
      onCancel() {
        ref.destroy()
      },
    })
  }

  //编辑文件
  editorConfirm = info => {
    this.redirectTo.edit(info._id)
  }

  enterItem = id => {
    this.setState({ delIcon: id })
  }

  leaveItem = () => {
    this.setState({ delIcon: null })
  }

  onSelect = (selectedKeys, e) => {
    // console.log('onSelect', selectedKeys, e)
  }

  getTreeNodeList = pos => {
    const list = this.state.pageList
    let posArr = pos.split('-')
    posArr.shift()
    let treeNode = list
    for (let i = 0; i < posArr.length; i++) {
      let idx = parseInt(posArr[i])

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

  onDrop = async info => {
    const dragNodeDataRef = info.dragNode.props.dataRef
    const dropNodeDataRef = info.node.props.dataRef
    const dropPos = info.node.props.pos.split('-')
    const dropIndex = Number(dropPos[dropPos.length - 1])
    const dragPos = info.dragNode.props.pos.split('-')
    const dragIndex = Number(dragPos[dragPos.length - 1])
    if (!info.dropToGap) {
      let option = {
        project_id: dragNodeDataRef.project_id,
        parent_id: dropNodeDataRef._id,
        id: dragNodeDataRef._id,
        title: dragNodeDataRef.title || dragNodeDataRef.name,
      }
      let result = await axios.post('/api/plugin/wiki_action/update', option)
      if (result.data.errcode === 0) {
        // 编辑侧边栏后默认返回回首页
        this.fetchDocList()
      } else {
        message.error(`更新失败： ${result.data.errmsg}`)
      }
    } else {
      if (dragNodeDataRef.parent_id === dropNodeDataRef.parent_id) {
        //兄弟节点
        let curList = this.getTreeNodeList(info.node.props.pos, true)
        let changes = this.arrayChangeIndex(curList, dragIndex, dropIndex)
        let result = await axios.post(
          '/api/plugin/wiki_action/up_index',
          changes,
        )
        if (result.data.errcode === 0) {
          this.fetchDocList()
        } else {
          message.error(`更新失败： ${result.data.errmsg}`)
        }
      } else {
        //非兄弟节点
        let option = {
          project_id: dragNodeDataRef.project_id,
          parent_id: dropNodeDataRef.parent_id,
          id: dragNodeDataRef._id,
          title: dragNodeDataRef.title || dragNodeDataRef.name,
        }
        let result = await axios.post('/api/plugin/wiki_action/update', option)
        if (result.data.errcode === 0) {
          // 编辑侧边栏后默认返回回首页
          this.fetchDocList()
        } else {
          message.error(`更新失败： ${result.data.errmsg}`)
        }
      }
    }
  }

  //bt转KB MB GB
  sizeChange = limit => {
    var size = ''
    if (limit < 0.1 * 1024) {
      size = parseInt(limit) + 'B'
    } else if (limit < 0.1 * 1024 * 1024) {
      size = (limit / 1024).toFixed(2) + 'KB'
    } else if (limit < 0.1 * 1024 * 1024 * 1024) {
      size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
    } else {
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    }

    var sizeStr = size + '' //转成字符串
    var index = sizeStr.indexOf('.') //获取小数点处的索引
    var dou = sizeStr.substr(index + 1, 2) //获取小数点后两位的值
    if (dou == '00') {
      return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return size
  }

  render() {
    const { pageList, fileList, title, wikiLoading } = this.state
    const docId = this.props.match.params.wiki_id
    const props = {
      listType: 'picture',
      defaultFileList: [...fileList],
    }
    const { plugins } = this.props

    if (!pageList) {
      return
    }
    const loop = data =>
      data.map(item => {
        if (item.list && item.list.length > 0) {
          return (
            <TreeNode
              key={`${item._id}`}
              className={`interface-item-nav3`}
              dataRef={item}
              title={
                <div
                  className="container-title"
                  onMouseEnter={() => this.enterItem(item._id)}
                  onMouseLeave={this.leaveItem}
                  onClick={e => {
                    this.setState({
                      selectedKeys: [`${item._id}`],
                    })
                    this.props.history.push(`./${item._id}`)
                  }}
                >
                  <Tooltip
                    mouseEnterDelay={3}
                    placement="topLeft"
                    title={item.title}
                  >
                    {item.title}
                  </Tooltip>

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
                    <Tooltip title="编辑">
                      <Icon
                        type="edit"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.editorConfirm(item)
                        }}
                        style={{
                          display:
                            this.state.delIcon == item._id ? 'block' : 'none',
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="新建子文档">
                      <Icon
                        type="plus"
                        className="interface-delete-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.addWikiConfirm(item)
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
            >
              {loop(item.list)}
            </TreeNode>
          )
        }
        return (
          <TreeNode
            className={`interface-item-nav3`}
            dataRef={item}
            title={
              <div
                className="container-title"
                onMouseEnter={() => this.enterItem(item._id)}
                onMouseLeave={this.leaveItem}
                onClick={() => {
                  this.setState({
                    selectedKeys: [`${item._id}`],
                  })
                  this.props.history.push(`./${item._id}`)
                }}
              >
                <Tooltip
                  mouseEnterDelay={3}
                  placement="topLeft"
                  title={item.title}
                >
                  {item.title}
                </Tooltip>
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
                  <Tooltip title="编辑">
                    <Icon
                      type="edit"
                      className="interface-delete-icon"
                      onClick={e => {
                        e.stopPropagation()
                        this.editorConfirm(item)
                      }}
                      style={{
                        display:
                          this.state.delIcon == item._id ? 'block' : 'none',
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="新建子文档">
                    <Icon
                      type="plus"
                      className="interface-delete-icon"
                      onClick={e => {
                        e.stopPropagation()
                        this.addWikiConfirm(item)
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
            key={`${item._id}`}
            isLeaf={true}
          />
        )
      })

    const importUploadProps = {
      accept: '.zip',
      name: 'file',
      multiple: false,
      data: {
        pid: this.props.match.params.id,
      },
      action: '/api/plugin/wiki/import_gitbook',
      onChange: info => {
        const { status } = info.file
        if (status === 'uploading' && this.state.importing === false) {
          this.setState({
            importing: true,
          })
        } else if (status === 'done') {
          let { response } = info.file
          if (response.errcode === 0) {
            message.success(`${info.file.name} 上传成功`)
            this.setState({
              importing: false,
            })
            this.onImportHide()
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          } else {
            message.error(response.errmsg)
            this.setState({
              importing: false,
            })
            this.onImportHide()
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} 上传失败`)
          this.setState({
            importing: false,
          })
        }
      },
    }

    return (
      <div className="ke-wiki-page">
        <div className="left-side left-menu">
          <Dropdown.Button
            placement="bottomLeft"
            overlay={
              <Menu onClick={this.onCreateMenuClick}>
                <Menu.Item key="import">
                  <Icon type="import" />
                  导入 Gitbook
                </Menu.Item>
                {/* <Menu.Item key="editOrder">
                  <Icon type="swap" />
                  调整文档顺序
                </Menu.Item> */}
              </Menu>
            }
            style={{
              marginLeft: '20px',
            }}
            onClick={this.createPage}
            type="primary"
            icon={<Icon type="more" />}
          >
            新建文档
          </Dropdown.Button>

          <div className="guide-container">
            {pageList && pageList.length > 0 ? (
              <Tree
                switcherIcon={<Icon type="down" />}
                className="markdown-guide-directory"
                selectedKeys={this.state.selectedKeys}
                expandedKeys={this.state.expandedKeys}
                onExpand={this.onExpand}
                onDragEnter={this.onDragEnter}
                draggable
                blockNode
                onDrop={this.onDrop}
                onSelect={this.onSelect}
                autoExpandParent
              >
                {loop(pageList)}
              </Tree>
            ) : null}
          </div>
        </div>
        <BackTop />
        <div className="main">
          <Spin
            size="small"
            style={{
              minHeight: '600px',
            }}
            spinning={wikiLoading}
          >
            {!wikiLoading && !title && !(pageList && pageList.length > 0) && (
              <div className="wiki-tooltip">
                <p
                  style={{
                    marginBottom: '16px',
                  }}
                >
                  项目中暂无文档内容
                </p>
                <Dropdown.Button
                  overlay={
                    <Menu onClick={this.onCreateMenuClick}>
                      <Menu.Item key="import">
                        <Icon type="import" />
                        导入 Gitbook
                      </Menu.Item>
                    </Menu>
                  }
                  onClick={this.createPage}
                  type="primary"
                  icon={<Icon type="more" />}
                >
                  新建文档
                </Dropdown.Button>
              </div>
            )}
            <Breadcrumb
              style={{ marginTop: '10px' }}
              list={this.state.pathList}
            ></Breadcrumb>
            <div id="viewContainer">
              <TuiViewer
                ref={this.viewerRef}
                initialValue={this.state.markdown}
              />
            </div>
            {fileList && fileList.length > 0 && (
              <Upload
                {...props}
                fileList={this.state.fileList}
                className="upload-file"
                disabled={true}
              >
                <div>
                  <Icon type="cloud-upload" /> 上传附件列表
                </div>
              </Upload>
            )}
          </Spin>
        </div>

        <div className="right-side">
          <div className="download-link">
            <a href={`/api/plugin/doc/export_pdf?id=${docId}`} target="_blank">
              打印&nbsp;
              <Icon type="printer" />
            </a>
          </div>
          <div className="aside-directory"></div>
        </div>

        <Modal
          title="导入 Gibook(.zip)"
          visible={this.state.importVisible}
          onCancel={this.onImportHide}
          footer={null}
          width={400}
          maskClosable={false}
          destroyOnClose={true}
        >
          <Spin
            tip="上传中..."
            indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
            spinning={this.state.importing}
          >
            <Upload.Dragger {...importUploadProps}>
              <p className="ant-upload-drag-icon">
                <Icon type="codepen" />
              </p>
              <p className="ant-upload-text">选择本地文件</p>
              <p className="ant-upload-hint">
                将 Gitbook 项目文件打包（.zip）上传
              </p>
            </Upload.Dragger>
          </Spin>
        </Modal>
      </div>
    )
  }
}

export default WikiPage
