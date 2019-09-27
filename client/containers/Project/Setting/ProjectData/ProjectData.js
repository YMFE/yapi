import React, { PureComponent as Component } from 'react';
import _ from 'underscore';
import mm from 'moment';
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
  Table,
  Popconfirm
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ProjectData.scss';
import axios from 'axios';

import URL from 'url';

const Dragger = Upload.Dragger;
import { saveImportData } from '../../../../reducer/modules/interface';
import { fetchUpdateLogData } from '../../../../reducer/modules/news.js';
import { handleSwaggerUrlData, saveImportDataCronJob, getImportDataCronJobList, deleteImportDataCronJob, updateImportDataCronJobDisabled } from '../../../../reducer/modules/project';
const Option = Select.Option;
const confirm = Modal.confirm;
const plugin = require('client/plugin.js');
const RadioGroup = Radio.Group;
const importDataModule = {};
const exportDataModule = {};
const HandleImportData = require('common/HandleImportData');
function handleExportRouteParams(url, status, isWiki) {
  if (!url) {
    return;
  }
  let urlObj = URL.parse(url, true),
    query = {};
  query = Object.assign(query, urlObj.query, { status, isWiki });
  return URL.format({
    pathname: urlObj.pathname,
    query
  });
}

// exportDataModule.pdf = {
//   name: 'Pdf',
//   route: '/api/interface/download_crx',
//   desc: '导出项目接口文档为 pdf 文件'
// }
@connect(
  state => {
    return {
      curCatid: -(-state.inter.curdata.catid),
      basePath: state.project.currProject.basepath,
      updateLogList: state.news.updateLogList,
      swaggerUrlData: state.project.swaggerUrlData,
      cronJobList: state.project.importDataCronJobList
    };
  },
  {
    saveImportData,
    fetchUpdateLogData,
    handleSwaggerUrlData,
    saveImportDataCronJob,
    getImportDataCronJobList,
    deleteImportDataCronJob,
    updateImportDataCronJobDisabled
  }
)
class ProjectData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectCatid: '',
      menuList: [],
      curImportType: 'swagger',
      curExportType: null,
      showLoading: false,
      dataSync: 'merge',
      exportContent: 'all',
      isSwaggerUrl: false,
      swaggerUrl: '',
      isWiki: false,

      // 定时任务相关
      /** 是否保存为定时任务 */
      isCronJob: false,
      /** 定时任务间隔时间 */
      cronJobInterval: 1,
      /** 定时任务间隔时间的单位，秒到天依次为: s, m, h, d */
      cronJobIntervalUnit: 'm'
    };
  }
  static propTypes = {
    match: PropTypes.object,
    curCatid: PropTypes.number,
    basePath: PropTypes.string,
    saveImportData: PropTypes.func,
    fetchUpdateLogData: PropTypes.func,
    updateLogList: PropTypes.array,
    handleSwaggerUrlData: PropTypes.func,
    saveImportDataCronJob: PropTypes.func,
    getImportDataCronJobList: PropTypes.func,
    deleteImportDataCronJob: PropTypes.func,
    updateImportDataCronJobDisabled: PropTypes.func,
    swaggerUrlData: PropTypes.string,
    cronJobList: PropTypes.array
  };

  componentWillMount() {
    const project_id = Number(this.props.match.params.id);
    axios.get(`/api/interface/getCatMenu?project_id=${project_id}`).then(data => {
      if (data.data.errcode === 0) {
        let menuList = data.data.data;
        this.setState({
          menuList: menuList,
          selectCatid: menuList[0]._id
        });
      }
    });
    this.props.getImportDataCronJobList({ project_id })
    plugin.emitHook('import_data', importDataModule);
    plugin.emitHook('export_data', exportDataModule, project_id);
  }

  selectChange(value) {
    this.setState({
      selectCatid: +value
    });
  }

  uploadChange = info => {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  handleAddInterface = async res => {
    return await HandleImportData(
      res,
      this.props.match.params.id,
      this.state.selectCatid,
      this.state.menuList,
      this.props.basePath,
      this.state.dataSync,
      message.error,
      async msg => {
        message.success(msg)
        if (this.state.isSwaggerUrl && this.state.isCronJob) {
          await this.props.saveImportDataCronJob({
            mode: this.state.dataSync,
            source: {
              type: 'swagger',
              url: this.state.swaggerUrl
            },
            target: {
              project_id: Number(this.props.match.params.id),
              cat_id: Number(this.state.selectCatid)
            },
            interval: (() => {
              const { cronJobInterval, cronJobIntervalUnit } = this.state;
              const cronJobIntervalInSeconds = cronJobInterval * (
                cronJobIntervalUnit === 'm' ? 60 :
                cronJobIntervalUnit === 'h' ? 60 * 60 :
                cronJobIntervalUnit === 'd' ? 60 * 60 * 24 :
                1
              );
              return cronJobIntervalInSeconds;
            })(),
            interval_human: (() => {
              const { cronJobInterval, cronJobIntervalUnit } = this.state;
              return `每隔${cronJobInterval}${
                cronJobIntervalUnit === 'm' ? '分钟' :
                cronJobIntervalUnit === 'h' ? '小时' :
                cronJobIntervalUnit === 'd' ? '天' :
                '秒'
              }`
            })()
          });
          message.success('定时数据导入任务添加成功');
          await this.props.getImportDataCronJobList({
            project_id: Number(this.props.match.params.id)
          });
        }
      },
      () => this.setState({ showLoading: false })
    );
  };

  // 本地文件上传
  handleFile = info => {
    if (!this.state.curImportType) {
      return message.error('请选择导入数据的方式');
    }
    if (this.state.selectCatid) {
      this.setState({ showLoading: true });
      let reader = new FileReader();
      reader.readAsText(info.file);
      reader.onload = async res => {
        res = await importDataModule[this.state.curImportType].run(res.target.result);
        if (this.state.dataSync === 'merge') {
          // 开启同步
          this.showConfirm(res);
        } else {
          // 未开启同步
          await this.handleAddInterface(res);
        }
      };
    } else {
      message.error('请选择上传的默认分类');
    }
  };

  showConfirm = async res => {
    let that = this;
    let typeid = this.props.match.params.id;
    let apiCollections = res.apis.map(item => {
      return {
        method: item.method,
        path: item.path
      };
    });
    let result = await this.props.fetchUpdateLogData({
      type: 'project',
      typeid,
      apis: apiCollections
    });
    let domainData = result.payload.data.data;
    const ref = confirm({
      title: '您确认要进行数据同步????',
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
                  <span className="logcontent" dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
              );
            })}
          </div>
          <p className="info">温馨提示： 数据同步后，可能会造成原本的修改数据丢失</p>
        </div>
      ),
      async onOk() {
        await that.handleAddInterface(res);
      },
      onCancel() {
        that.setState({ showLoading: false, dataSync: 'normal' });
        ref.destroy();
      }
    });
  };

  handleImportType = val => {
    this.setState({
      curImportType: val,
      isSwaggerUrl: false
    });
  };

  handleExportType = val => {
    this.setState({
      curExportType: val,
      isWiki: false
    });
  };

  // 处理导入信息同步
  onChange = checked => {
    this.setState({
      dataSync: checked
    });
  };

  // 处理swagger URL 导入
  handleUrlChange = checked => {
    this.setState({
      isSwaggerUrl: checked
    });
  };

  // 记录输入的url
  swaggerUrlInput = url => {
    this.setState({
      swaggerUrl: url
    });
  };

  // url导入上传
  onUrlUpload = async () => {
    if (!this.state.curImportType) {
      return message.error('请选择导入数据的方式');
    }

    if (!this.state.swaggerUrl) {
      return message.error('url 不能为空');
    }

    if (this.state.isCronJob && (_.isNaN(this.state.cronJobInterval) || this.state.cronJobInterval <= 0)) {
      return message.error('定时间隔有误');
    }

    if (this.state.selectCatid) {
      this.setState({ showLoading: true });
      try {
        // 处理swagger url 导入
        await this.props.handleSwaggerUrlData(this.state.swaggerUrl);
        // let result = json5_parse(this.props.swaggerUrlData)
        let res = await importDataModule[this.state.curImportType].run(this.props.swaggerUrlData);
        if (this.state.dataSync === 'merge') {
          // merge
          this.showConfirm(res);
        } else {
          // 未开启同步
          await this.handleAddInterface(res);
        }
      } catch (e) {
        this.setState({ showLoading: false });
        message.error(e.message);
      }
    } else {
      message.error('请选择上传的默认分类');
    }
  };

  // 处理导出接口是全部还是公开
  handleChange = e => {
    this.setState({ exportContent: e.target.value });
  };

  //  处理是否开启wiki导出
  handleWikiChange = e => {
    this.setState({
      isWiki: e.target.checked
    });
  };

  /**
   *
   *
   * @returns
   * @memberof ProjectData
   */
  render() {
    const uploadMess = {
      name: 'interfaceData',
      multiple: true,
      showUploadList: false,
      action: '/api/interface/interUpload',
      customRequest: this.handleFile,
      onChange: this.uploadChange
    };

    let exportUrl =
      this.state.curExportType &&
      exportDataModule[this.state.curExportType] &&
      exportDataModule[this.state.curExportType].route;
    let exportHref = handleExportRouteParams(
      exportUrl,
      this.state.exportContent,
      this.state.isWiki
    );

    // console.log('inter', this.state.exportContent);
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
                    href="https://hellosean1025.github.io/yapi/documents/data.html"
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
                    );
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
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.menuList.map((item, key) => {
                    return (
                      <Option key={key} value={item._id + ''}>
                        {item.name}
                      </Option>
                    );
                  })}
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
                        <h3 style={{ color: 'white' }}>智能合并</h3>
                        <p>
                          已存在的接口，将合并返回数据的 response，适用于导入了 swagger
                          数据，保留对数据结构的改动
                        </p>
                        <br />
                        <h3 style={{ color: 'white' }}>完全覆盖</h3>
                        <p>不保留旧数据，完全使用新数据，适用于接口定义完全交给后端定义</p>
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

                {/* <Switch checked={this.state.dataSync} onChange={this.onChange} /> */}
              </div>
              {this.state.curImportType === 'swagger' && (
                <div className="dataSync">
                  <span className="label">
                    通过url导入
                  </span>
                  <Switch checked={this.state.isSwaggerUrl} onChange={this.handleUrlChange} />
                </div>
              )}
              {this.state.isSwaggerUrl ? (
                <div className="import-content url-import-content">
                  <Input
                    placeholder="http://demo.swagger.io/v2/swagger.json"
                    value={this.state.swaggerUrl}
                    onChange={e => this.swaggerUrlInput(e.target.value.trim())}
                  />
                  <div className="dataSync withPaddingBottom">
                    <span className="label">
                      保存为定时任务
                    </span>
                    <Switch checked={this.state.isCronJob} onChange={isCronJob => this.setState({ isCronJob })} />
                  </div>
                  {this.state.isCronJob && (
                    <div className='import-content-block-field'>
                      <Input
                        type="number"
                        placeholder="请输入间隔时间"
                        addonBefore="每隔"
                        value={_.isNaN(this.state.cronJobInterval) ? '' : this.state.cronJobInterval}
                        addonAfter={
                          <Select style={{width: 70}} value={this.state.cronJobIntervalUnit} onChange={cronJobIntervalUnit => this.setState({ cronJobIntervalUnit })}>
                            <Option value="m">分钟</Option>
                            <Option value="h">小时</Option>
                            <Option value="d">天</Option>
                          </Select>
                        }
                        onChange={e => this.setState({ cronJobInterval: e.target.valueAsNumber })}
                      />
                    </div>
                  )}
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
                      <p className="ant-upload-text">点击或者拖拽文件到上传区域</p>
                      <p
                        className="ant-upload-hint"
                        onClick={e => {
                          e.stopPropagation();
                        }}
                        dangerouslySetInnerHTML={{
                          __html: this.state.curImportType
                            ? importDataModule[this.state.curImportType].desc
                            : null
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
                display: Object.keys(exportDataModule).length > 0 ? '' : 'none'
              }}
            >
              <div>
                <h3>数据导出</h3>
              </div>
              <div className="dataImportTile">
                <Select placeholder="请选择导出数据的方式" onChange={this.handleExportType}>
                  {Object.keys(exportDataModule).map(name => {
                    return (
                      <Option key={name} value={name}>
                        {exportDataModule[name].name}
                      </Option>
                    );
                  })}
                </Select>
              </div>

              <div className="dataExport">
                <RadioGroup defaultValue="all" onChange={this.handleChange}>
                  <Radio value="all">全部接口</Radio>
                  <Radio value="open">公开接口</Radio>
                </RadioGroup>
              </div>
              <div className="export-content">
                {this.state.curExportType ? (
                  <div>
                    <p className="export-desc">{exportDataModule[this.state.curExportType].desc}</p>
                    <a 
                      target="_blank"
                      rel="noopener noreferrer"
                      href={exportHref}>
                      <Button className="export-button" type="primary" size="large">
                        {' '}
                        导出{' '}
                      </Button>
                    </a>
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
                  <Button disabled className="export-button" type="primary" size="large">
                    {' '}
                    导出{' '}
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="postman-dataImport">
            <div className="dataImportCon" style={{marginTop: 20, width: '100%'}}>
              <div>
                <h3>
                  {'定时数据导入 '}
                  <Tooltip title="从上面的「数据导入」模块的「通过url导入」可新增定时数据导入任务">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </h3>
              </div>

              <Table 
                style={{background: 'white'}}
                pagination={false}
                dataSource={this.props.cronJobList}
                rowKey="_id"
                columns={[
                  {
                    title: '数据类型',
                    dataIndex: 'source.type'
                  },
                  {
                    title: '数据地址',
                    dataIndex: 'source.url',
                    width: 250,
                    render: url => (
                      <a href={url} target="_blank">
                        <Icon type="link" />
                        {' '}
                        {url}
                      </a>
                    )
                  },
                  {
                    title: '导入目录',
                    dataIndex: 'target.cat_id',
                    render: catId => {
                      const cat = _.find(this.state.menuList, cat => cat._id === catId);
                      return cat ? cat.name : '-';
                    }
                  },
                  {
                    title: '数据同步模式',
                    dataIndex: 'mode',
                    render: mode => {
                      return (
                        mode === 'good' ? '智能合并' :
                        mode === 'merge' ? '完全覆盖' :
                        '普通模式'
                      );
                    }
                  },
                  {
                    title: '定时',
                    dataIndex: 'interval_human'
                  },
                  {
                    title: '下次执行时间',
                    dataIndex: 'next_run_at',
                    render: nextRunAt => mm.unix(nextRunAt).format('YYYY-MM-DD HH:mm:ss')
                  },
                  {
                    title: '是否启用',
                    dataIndex: 'disabled',
                    render: (disabled, job) => (
                      <Switch 
                        defaultChecked={!disabled}
                        onChange={async available => {
                          await this.props.updateImportDataCronJobDisabled({
                            id: job._id,
                            disabled: !available
                          });
                          await this.props.getImportDataCronJobList({
                            project_id: Number(this.props.match.params.id)
                          });
                        }}
                      />
                    )
                  },
                  {
                    title: '操作',
                    key: 'actions',
                    render: (_, job) => (
                      <Popconfirm
                        title="删除不可恢复！确定删除？"
                        onConfirm={async () => {
                          await this.props.deleteImportDataCronJob({
                            id: job._id
                          });
                          await this.props.getImportDataCronJobList({
                            project_id: Number(this.props.match.params.id)
                          });
                        }}>
                        <a>删除</a>
                      </Popconfirm>
                    )
                  }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectData;
