/**
 * 项目数据管理
 * 包括 数据导出/数据倒入
 * */

import React, { PureComponent as Component } from 'react'
import {
  Upload,
  Icon,
  message,
  Select,
  Tooltip,
  Button,
  Spin,
  Switch,
  Modal,
  Radio,
  Input,
  Checkbox,
  Tree,
} from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './ProjectData.scss'
import axios from 'axios'

import {
  saveImportData,
  fetchInterfaceListMenu,
} from '../../../../reducer/modules/interface'
import { fetchUpdateLogData } from '../../../../reducer/modules/news.js'
import { handleSwaggerUrlData } from '../../../../reducer/modules/project'
import variable from '../../../../constants/variable'

const Dragger = Upload.Dragger
const Option = Select.Option
const confirm = Modal.confirm
const { TreeNode } = Tree
const plugin = require('client/plugin.js')
const RadioGroup = Radio.Group
const importDataModule = {}
const exportDataModule = {}
const HandleImportData = require('common/HandleImportData')
const HandleImportJson = require('common/HandleImportJson')

// exportDataModule.pdf = {
//   name: 'Pdf',
//   route: '/api/interface/download_crx',
//   desc: '导出项目接口文档为 pdf 文件'
// }
@connect(
  state => {
    return {
      treeList: state.inter.list,
      curCatid: -(-state.inter.curdata.catid),
      basePath: state.project.currProject.basepath,
      updateLogList: state.news.updateLogList,
      swaggerUrlData: state.project.swaggerUrlData,
    }
  },
  {
    saveImportData,
    fetchUpdateLogData,
    handleSwaggerUrlData,
    fetchInterfaceListMenu,
  },
)
class ProjectData extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectCatid: '',
      menuList: [],
      selectedMenuList: [],
      curImportType: 'swagger',
      curExportType: null,
      showLoading: false,
      dataSync: 'good',
      exportContent: 'all',
      isSwaggerUrl: false,
      swaggerUrl: '',
      isWiki: false,
      //接口导入后数据类型选择
      resImportType: 'real',
      exportPartDataModalVisible: false,
      exportPartDataTreeCheckedKeys: [],
      treeList: [],
      exportBtnLoaded: false,
    }
  }
  static propTypes = {
    treeList: PropTypes.array,
    fetchInterfaceListMenu: PropTypes.func,
    match: PropTypes.object,
    curCatid: PropTypes.number,
    basePath: PropTypes.string,
    saveImportData: PropTypes.func,
    fetchUpdateLogData: PropTypes.func,
    updateLogList: PropTypes.array,
    handleSwaggerUrlData: PropTypes.func,
    swaggerUrlData: PropTypes.string,
  }

  UNSAFE_componentWillMount() {
    axios
      .get(`/api/interface/getCatMenu?project_id=${this.props.match.params.id}`)
      .then(data => {
        if (data.data.errcode === 0) {
          let menuList = data.data.data
          this.setState(
            {
              menuList: menuList,
              selectCatid: menuList[0]._id,
            },
            () => {
              this.getSelectId(menuList[0]._id)
            },
          )
        }
      })
    plugin.emitHook('import_data', importDataModule)
    plugin.emitHook('export_data', exportDataModule, this.props.match.params.id)
    this.getList()
  }
  async getList() {
    let r = await this.props.fetchInterfaceListMenu(this.props.match.params.id)
    this.setState({
      treeList: r.payload.data.data || [],
    })
  }

  getSelectId = value => {
    axios
      .get(`/api/interface/list_cat?page=1&limit=200&catid=${value}`)
      .then(data => {
        if (data.data.errcode === 0) {
          let menuList = data.data.data
          this.setState({
            selectedMenuList: menuList.list,
          })
        }
      })
  }
  selectChange(value) {
    this.setState(
      {
        selectCatid: +value,
      },
      () => {
        this.getSelectId(+value)
      },
    )
  }

  uploadChange = info => {
    const status = info.file.status
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功`)
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败`)
    }
  }

  /**
   * 解析完成的 JSON 开始上传
   *
   * @memberof ProjectData
   */
  handleAddInterface = async (res, type = '') => {
    if (type && type === 'json') {
      return await HandleImportJson(
        res,
        this.props.match.params.id,
        this.state.selectCatid,
        this.state.menuList,
        this.state.selectedMenuList,
        this.props.basePath,
        this.state.dataSync,
        this.state.resImportType,
        message.error,
        message.success,
        () => this.setState({ showLoading: false }),
      )
    } else {
      return await HandleImportData(
        res,
        this.props.match.params.id,
        this.state.selectCatid,
        this.state.menuList,
        this.state.selectedMenuList,
        this.props.basePath,
        this.state.dataSync,
        this.state.resImportType,
        message.error,
        message.success,
        () => this.setState({ showLoading: false }),
      )
    }
  }

  /**
   * postman、swagger、har 数据进行解析为 JSON
   *
   * @memberof ProjectData
   */
  handleFile = info => {
    if (!this.state.curImportType) {
      return message.error('请选择导入数据的方式')
    }
    if (this.state.selectCatid) {
      this.setState({ showLoading: true })
      let reader = new FileReader()
      reader.readAsText(info.file)
      reader.onload = async res => {
        let xhrArr = []
        let urlList = []
        let unhandleResArr = []
        //单独处理har方式真实数据导入功能
        if (this.state.curImportType === 'har') {
          unhandleResArr = JSON.parse(res.target.result).log.entries
          unhandleResArr.map(u => {
            //判断是否为接口返回的信息
            if (u.response.content.mimeType === 'application/json') {
              let tempUrl = u.request.url.split('?')[0]
              //去除存在的重复接口
              if (urlList.indexOf(tempUrl) === -1) {
                urlList.push(tempUrl)
                xhrArr.push(u)
              }
            }
          })
        }
        //单独处理postman方式导入的数据
        //接口名称和返回值的存储列表
        let responsesMap = []
        if (this.state.curImportType === 'postman') {
          try {
            unhandleResArr = JSON.parse(res.target.result).requests
            unhandleResArr.map(u => {
              if (u.responses && u.responses.length > 0) {
                responsesMap.push({
                  name: u.name,
                  responseText: u.responses[0].text,
                })
              }
            })
          } catch (error) {
            console.log('error', error)
          }
        }

        res = await importDataModule[this.state.curImportType].run(
          res.target.result,
        )
        if (this.state.dataSync === 'merge') {
          // 覆盖模式
          this.showConfirm(res)
        } else {
          // 非完全覆盖模式
          if (this.state.curImportType === 'har') {
            let tempApisPath = []
            let tempApisArr = []
            //去除重复接口
            res.apis.map(item => {
              if (tempApisPath.indexOf(item.path) === -1) {
                tempApisPath.push(item.path)
                tempApisArr.push(item)
              }
            })
            //处理最终数据 增加接口真实返回数据
            tempApisArr.map((t, index) => {
              t.res_body_text = xhrArr[index].response.content.text
            })
            res.apis = tempApisArr
          }
          if (this.state.curImportType === 'postman') {
            try {
              res.apis.map(item => {
                responsesMap.map(r => {
                  if (item.title === r.name) {
                    item.res_body_text = r.responseText
                  } else {
                    item.res_body_text = ''
                  }
                })
              })
            } catch (error) {}
          }
          await this.handleAddInterface(res, this.state.curImportType)
        }
      }
    } else {
      message.error('请选择上传的默认分类')
    }
  }

  showConfirm = async res => {
    let that = this
    let typeid = this.props.match.params.id
    let apiCollections =
      res && res.apis && res.apis.length > 0
        ? res.apis.map(item => {
            return {
              method: item.method,
              path: item.path,
            }
          })
        : []
    let result = await this.props.fetchUpdateLogData({
      type: 'project',
      typeid,
      apis: apiCollections,
    })
    let domainData = result.payload.data.data
    const ref = confirm({
      title: '您确认要进行数据覆盖 ？',
      width: 600,
      okType: 'danger',
      iconType: 'exclamation-circle',
      className: 'dataImport-confirm',
      okText: '确认',
      cancelText: '取消',
      content: (
        <div className="postman-dataImport-modal">
          <div className="postman-dataImport-modal-content">
            {domainData.map((item, index) => {
              return (
                <div key={index} className="postman-dataImport-show-diff">
                  <span
                    className="logcontent"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
              )
            })}
          </div>
          <p className="info">
            温馨提示： 数据覆盖后，可能会造成原本的修改数据丢失
          </p>
        </div>
      ),
      async onOk() {
        await that.handleAddInterface(res, that.state.curImportType)
      },
      onCancel() {
        that.setState({ showLoading: false, dataSync: 'normal' })
        ref.destroy()
      },
    })
  }

  handleImportType = val => {
    this.setState({
      curImportType: val,
      isSwaggerUrl: false,
      resImportType: 'real',
    })
  }

  handleResImportType = val => {
    this.setState({
      resImportType: val,
    })
  }

  handleExportType = val => {
    this.setState({
      curExportType: val,
      isWiki: false,
    })
  }

  // 处理导入信息同步
  onChange = checked => {
    this.setState({
      dataSync: checked,
    })
  }

  // 处理swagger URL 导入
  handleUrlChange = checked => {
    this.setState({
      isSwaggerUrl: checked,
    })
  }

  // 记录输入的url
  swaggerUrlInput = url => {
    this.setState({
      swaggerUrl: url,
    })
  }

  // url导入上传
  onUrlUpload = async () => {
    if (!this.state.curImportType) {
      return message.error('请选择导入数据的方式')
    }

    if (!this.state.swaggerUrl) {
      return message.error('url 不能为空')
    }
    if (this.state.selectCatid) {
      this.setState({ showLoading: true })
      try {
        // 处理swagger url 导入
        await this.props.handleSwaggerUrlData(this.state.swaggerUrl)
        // let result = json5_parse(this.props.swaggerUrlData)
        let res = await importDataModule[this.state.curImportType].run(
          this.props.swaggerUrlData,
        )
        if (
          this.state.dataSync === 'merge' &&
          this.state.curImportType !== 'json'
        ) {
          // merge
          this.showConfirm(res)
        } else {
          // 未开启同步
          await this.handleAddInterface(res)
        }
      } catch (e) {
        this.setState({ showLoading: false })
        message.error(e.message)
      }
    } else {
      message.error('请选择上传的默认分类')
    }
  }

  // 全部、部分、公开
  handleChange = e => {
    const value = e.target.value
    if (value === 'part') {
      this.setState({
        exportContent: value,
        exportPartDataModalVisible: true,
      })
    } else {
      this.setState({
        exportContent: value,
        exportPartDataTreeCheckedKeys: [],
      })
    }
  }

  //  处理是否开启wiki导出
  handleWikiChange = e => {
    this.setState({
      isWiki: e.target.checked,
    })
  }

  handleExportPartDataModalOk = e => {
    this.setState({
      exportPartDataModalVisible: false,
    })
  }

  handleExportPartDataModalCancel = e => {
    this.setState({
      exportPartDataModalVisible: false,
    })
  }

  getTitle = data => {
    if (data.itemType === 'cat' || data.record_type === 2) {
      return (
        <div>
          {data.list && data.list.length > 0 ? (
            <Icon type="folder-open" style={{ marginRight: 5 }} />
          ) : (
            <Icon type="folder" style={{ marginRight: 5 }} />
          )}
          {data.name || data.title}
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
            <Icon type="api" style={{ marginRight: 5 }} />
            <span style={{ color: methodColor.color }}>{data.method}</span>{' '}
            {data.title || data.name}
          </div>
        )
      } else {
        methodColor = variable.METHOD_COLOR['dubbo']
        return (
          <div>
            <Icon type="api" style={{ marginRight: 5 }} />
            <span style={{ color: methodColor.color }}>DUBBO</span>{' '}
            {data.title || data.name}
          </div>
        )
      }
    }
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.itemType === 'cat') {
        // 一级目录，cat 目录
        return (
          <TreeNode title={this.getTitle(item)} key={'cat_' + item._id}>
            {this.renderTreeNodes(item.list)}
          </TreeNode>
        )
      } else if (item.record_type === 2) {
        // 文件夹类型
        return (
          <TreeNode
            title={this.getTitle(item)}
            key={'dir_' + item.catid + '-' + item._id}
          >
            {item.list && this.renderTreeNodes(item.list)}
          </TreeNode>
        )
      } else if (item.record_type === 0) {
        // api 类型
        return (
          <TreeNode
            title={this.getTitle(item)}
            key={'api_' + item.catid + '-' + item._id}
          />
        )
      } else {
        // 文档类型
        return (
          <TreeNode
            title={this.getTitle(item)}
            key={'doc_' + item.catid + '-' + item._id}
          />
        )
      }
    })

  onExportPartDataTreeCheck = checkedKeys => {
    this.setState({
      exportPartDataTreeCheckedKeys: checkedKeys,
    })
  }

  onClickExportData = () => {
    this.setState({
      exportBtnLoaded: true,
    })
    const {
      curExportType,
      exportContent,
      isWiki,
      exportPartDataTreeCheckedKeys,
    } = this.state
    let exportUrl =
      curExportType &&
      exportDataModule[curExportType] &&
      exportDataModule[curExportType].route
    let params =
      curExportType &&
      exportDataModule[curExportType] &&
      exportDataModule[curExportType].data
    let data = {
      status: exportContent,
      isWiki: isWiki,
      list: exportPartDataTreeCheckedKeys,
    }
    data = Object.assign(data, params)
    if (exportUrl) {
      axios.post(exportUrl, data).then(res => {
        const resData = res.data
        const tp = resData.tp
        const fileName = resData.fileName
        if (resData && tp) {
          if (curExportType === 'pdf') {
            const buf = Buffer.from(tp.data, 'binary')
            this.downloadData(buf, fileName, '')
          } else {
            this.downloadData(tp, fileName, '')
          }
        }
      })
    }
  }

  downloadData = (data, filename, mime) => {
    // 关于 MIME: https://www.w3school.com.cn/media/media_mimeref.asp
    let blobData = [data]
    let blob = new Blob(blobData, { type: mime || 'application/octet-stream' })
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      // IE workaround for "HTML7007: One or more blob URLs were
      // revoked by closing the blob for which they were created.
      // These URLs will no longer resolve as the data backing
      // the URL has been freed."
      window.navigator.msSaveBlob(blob, filename)
    } else {
      let blobURL = window.URL.createObjectURL(blob)
      let tempLink = document.createElement('a')
      tempLink.style.display = 'none'
      tempLink.href = blobURL
      tempLink.setAttribute('download', filename)

      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank')
      }

      document.body.appendChild(tempLink)
      tempLink.click()

      setTimeout(function() {
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(blobURL)
      }, 0)
    }
    this.setState({
      exportBtnLoaded: false,
    })
  }

  /**
   *
   *
   * @returns
   * @memberof ProjectData
   */
  render() {
    const {
      exportPartDataModalVisible,
      exportPartDataTreeCheckedKeys,
      treeList,
      exportBtnLoaded,
    } = this.state

    const uploadMess = {
      name: 'interfaceData',
      multiple: true,
      showUploadList: false,
      action: '/api/interface/interUpload',
      customRequest: this.handleFile,
      onChange: this.uploadChange,
    }

    const exportDataModal = (
      <Modal
        title="部分数据导出"
        visible={exportPartDataModalVisible}
        onOk={this.handleExportPartDataModalOk}
        onCancel={this.handleExportPartDataModalCancel}
      >
        {treeList && treeList.length > 0 ? (
          <div>
            <Tree
              checkable
              onCheck={this.onExportPartDataTreeCheck}
              checkedKeys={exportPartDataTreeCheckedKeys}
            >
              {this.renderTreeNodes(treeList)}
            </Tree>
          </div>
        ) : null}
      </Modal>
    )

    return (
      <div className="g-row">
        <div className="m-panel">
          <div className="postman-dataImport">
            <div className="dataImportCon">
              <div>
                <h3>
                  数据导入&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    // 文档预留
                  >
                    <Tooltip title="点击查看文档">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </a>
                </h3>
              </div>
              <div className="dataImportTile">
                <Select
                  placeholder="请选择导入数据的方式"
                  value={this.state.curImportType}
                  onChange={this.handleImportType}
                >
                  {Object.keys(importDataModule).map(name => {
                    return (
                      <Option key={name} value={name}>
                        {importDataModule[name].name}
                      </Option>
                    )
                  })}
                </Select>
              </div>
              <div className="catidSelect">
                <Select
                  value={this.state.selectCatid + ''}
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="请选择数据导入的默认分类"
                  optionFilterProp="children"
                  onChange={this.selectChange.bind(this)}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.menuList.map((item, key) => {
                    return (
                      <Option key={key} value={item._id + ''}>
                        {`【分类】${item.name}`}
                      </Option>
                    )
                  })}
                </Select>
              </div>
              <div className="dataImportTile">
                <Select
                  onChange={this.handleResImportType}
                  value={this.state.resImportType}
                >
                  <Option key="mock" value="mock">
                    随机生成MOCK数据
                  </Option>
                  <Option key="real" value="real">
                    导入接口返回数据
                  </Option>
                  {this.state.curImportType !== 'swagger' ? null : (
                    <Option key="example" value="example">
                      接口 example 聚合定制 Mock
                    </Option>
                  )}
                </Select>
              </div>
              <div className="dataSync">
                <span className="label">
                  数据同步&nbsp;
                  <Tooltip
                    title={
                      <div>
                        <h3 style={{ color: 'white' }}>普通模式</h3>
                        <p>不导入已存在的接口</p>
                        <br />
                        <h3 style={{ color: 'white' }}>合并模式</h3>
                        <p>
                          已存在的接口，将合并返回数据的 response，适用于导入了
                          swagger 数据，保留对数据结构的改动
                        </p>
                        <br />
                        <h3 style={{ color: 'white' }}>覆盖模式</h3>
                        <p>
                          不保留旧数据，完全使用新数据，适用于接口定义完全交给后端定义
                        </p>
                      </div>
                    }
                  >
                    <Icon type="question-circle-o" />
                  </Tooltip>{' '}
                </span>
                <Select value={this.state.dataSync} onChange={this.onChange}>
                  <Option value="normal">普通模式</Option>
                  <Option value="good">智能合并</Option>
                  <Option value="merge">完全覆盖</Option>
                </Select>
              </div>
              {this.state.curImportType === 'swagger' && (
                <div className="dataSync">
                  <span className="label">Swagger url导入</span>
                  <Switch
                    checked={this.state.isSwaggerUrl}
                    onChange={this.handleUrlChange}
                  />
                </div>
              )}
              {this.state.isSwaggerUrl ? (
                <div className="import-content url-import-content">
                  <Input
                    placeholder="http://demo.swagger.io/v2/swagger.json"
                    onChange={e => this.swaggerUrlInput(e.target.value)}
                  />
                  <Button
                    type="primary"
                    className="url-btn"
                    onClick={this.onUrlUpload}
                    loading={this.state.showLoading}
                  >
                    上传
                  </Button>
                </div>
              ) : (
                <div className="import-content">
                  <Spin spinning={this.state.showLoading} tip="上传中...">
                    <Dragger {...uploadMess}>
                      <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                      </p>
                      <p className="ant-upload-text">
                        点击或者拖拽文件到上传区域
                      </p>
                      <p
                        className="ant-upload-hint"
                        onClick={e => {
                          e.stopPropagation()
                        }}
                        dangerouslySetInnerHTML={{
                          __html: this.state.curImportType
                            ? importDataModule[this.state.curImportType].desc
                            : null,
                        }}
                      />
                    </Dragger>
                  </Spin>
                </div>
              )}
            </div>

            <div
              className="dataImportCon"
              style={{
                marginLeft: '20px',
                display: Object.keys(exportDataModule).length > 0 ? '' : 'none',
              }}
            >
              <div>
                <h3>数据导出</h3>
              </div>
              <div className="dataImportTile">
                <Select
                  placeholder="请选择导出数据的方式"
                  onChange={this.handleExportType}
                >
                  {Object.keys(exportDataModule).map(name => {
                    return (
                      <Option key={name} value={name}>
                        {exportDataModule[name].name}
                      </Option>
                    )
                  })}
                </Select>
              </div>

              <div className="dataExport">
                <RadioGroup defaultValue="all" onChange={this.handleChange}>
                  <Radio value="all">全部接口</Radio>
                  <Radio value="part">部分接口</Radio>
                  <Radio value="open">公开接口</Radio>
                </RadioGroup>
              </div>
              {exportDataModal}
              <div className="export-content">
                {this.state.curExportType ? (
                  <div>
                    <p className="export-desc">
                      {exportDataModule[this.state.curExportType].desc}
                    </p>
                    <Button
                      className="export-button"
                      type="primary"
                      onClick={this.onClickExportData}
                      loading={exportBtnLoaded}
                    >
                      导出
                    </Button>
                    <Checkbox
                      checked={this.state.isWiki}
                      onChange={this.handleWikiChange}
                      className="wiki-btn"
                      disabled={this.state.curExportType === 'json'}
                    >
                      添加wiki&nbsp;
                      <Tooltip title="开启后 html 和 markdown 数据导出会带上wiki数据">
                        <Icon type="question-circle-o" />
                      </Tooltip>{' '}
                    </Checkbox>
                  </div>
                ) : (
                  <Button disabled className="export-button" type="primary">
                    导出
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProjectData
