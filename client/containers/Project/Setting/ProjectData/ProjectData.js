import React, { PureComponent as Component } from 'react'
import { Upload, Icon, message, Select, Tooltip, Button } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ProjectData.scss';
import axios from 'axios';
import _ from 'underscore';
const Dragger = Upload.Dragger;
const Option = Select.Option;

const plugin = require('client/plugin.js');

const importDataModule = {};
const exportDataModule = {};
// exportDataModule.pdf = {
//   name: 'Pdf',
//   route: '/api/interface/download_crx',
//   desc: '导出项目接口文档为 pdf 文件'
// }
@connect(
  state => {
    return {
      curCatid: -(-state.inter.curdata.catid),
      basePath: state.project.currProject.basepath
    }
  }, {

  }
)

class ProjectData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectCatid: "",
      menuList: [],
      curImportType: null,
      curExportType: null
    }
  }
  static propTypes = {
    match: PropTypes.object,
    curCatid: PropTypes.number,
    basePath: PropTypes.string
  }

  componentWillMount() {
    axios.get(`/api/interface/getCatMenu?project_id=${this.props.match.params.id}`).then((data) => {
      let menuList = data.data.data;
      this.setState({
        menuList: menuList
      })
    });
    plugin.emitHook('import_data', importDataModule);
    plugin.emitHook('export_data', exportDataModule, this.props.match.params.id);
  }
  selectChange(value) {
    this.setState({
      selectCatid: +value
    })
  }



  uploadChnange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  }

  async handleAddCat(cats) {
    let menuList = this.state.menuList;
    let catsObj = {};
    if (cats && Array.isArray(cats)) {
      for (let i = 0; i < cats.length; i++) {
        let cat = cats[i];
        let findCat = _.find(menuList, menu => menu.name === cat.name)
        catsObj[cat.name] = cat;
        if (findCat) {
          cat.id = findCat._id;
        } else {
          let result = await axios.post('/api/interface/add_cat', {
            name: cat.name,
            project_id: this.props.match.params.id,
            desc: cat.desc
          })
          if(result.data.errcode){
            message.error(result.data.errmsg);
            return false;
          }
          cat.id = result.data.data._id;
        }
      }
    }
    return catsObj;
  }

  handleAddInterface(info) {
    if (!this.state.curImportType) {
      return message.error('请选择导入数据的方式');
    }
    if (this.state.selectCatid) {
      let reader = new FileReader();
      reader.readAsText(info.file);
      reader.onload = async res => {
        res = importDataModule[this.state.curImportType].run(res.target.result);
        const cats = await this.handleAddCat(res.cats);
        if(cats === false){
          return;
        }
        res = res.apis;
        let len = res.length;
        let count = 0;
        let successNum = len;
        let existNum = 0;
 
        for(let index=0; index< res.length; index++){
          let item = res[index];
          let data = {
            ...item,
            project_id: this.props.match.params.id,
            catid: this.state.selectCatid
          }
          if (this.props.basePath) {
            data.path = data.path.indexOf(this.props.basePath) === 0 ? data.path.substr(this.props.basePath.length) : data.path;
          }
          if (data.catname && cats[data.catname] && typeof cats[data.catname] === 'object' && cats[data.catname].id) {
            data.catid = cats[data.catname].id;
          }
          let result = await axios.post('/api/interface/add', data);
          count++;
          if (result.data.errcode) {
            successNum--;
            if(result.data.errcode == 40022){
              existNum++;
            }
            if(result.data.errcode == 40033){
              message.error('没有权限')
              break;
            }
          }
          if (count === len) {
            message.success(`成功导入接口 ${successNum} 个, 已存在的接口 ${existNum} 个`);
          }

        }
      }
    } else {
      message.error("请选择上传的默认分类");
    }
  }

  handleImportType = (val) => {
    this.setState({
      curImportType: val
    })
  }

  handleExportType = (val) => {
    this.setState({
      curExportType: val
    })
  }

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
      customRequest: this.handleAddInterface.bind(this),
      onChange: this.uploadChnange.bind(this)
    }
    return (
      <div className="g-row">
        <div className="m-panel">
          <div className="postman-dataImport">
            <div className="dataImportCon">
              <div ><h3>数据导入&nbsp;<a target="_blank" rel="noopener noreferrer" href="http://yapi.qunar.com/data.html" >
                <Tooltip title="点击查看文档"><Icon type="question-circle-o" /></Tooltip>
              </a></h3></div>
              <div className="dataImportTile">
                <Select placeholder="请选择导入数据的方式" onChange={this.handleImportType}>
                  {Object.keys(importDataModule).map((name) => {
                    return <Option key={name} value={name}>{importDataModule[name].name}</Option>
                  })}
                </Select>
              </div>
              <div className="catidSelect">
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="请选择数据导入的默认分类"
                  optionFilterProp="children"
                  onChange={this.selectChange.bind(this)}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.state.menuList.map((item, key) => {
                    return <Option key={key} value={item._id + ""}>{item.name}</Option>;
                  })}
                </Select>
              </div>
              <div style={{ marginTop: 16, height: 180 }}>
                <Dragger {...uploadMess}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或者拖拽文件到上传区域</p>
                  <p className="ant-upload-hint">{this.state.curImportType ? importDataModule[this.state.curImportType].desc : null}</p>
                </Dragger>
              </div>
            </div>

            <div className="dataImportCon" style={{ marginLeft: '20px', display: Object.keys(exportDataModule).length > 0 ? '' : 'none' }}>
              <div ><h3>数据导出</h3></div>
              <div className="dataImportTile">
                <Select placeholder="请选择导出数据的方式" onChange={this.handleExportType}>
                  {Object.keys(exportDataModule).map((name) => {
                    return <Option key={name} value={name}>{exportDataModule[name].name}</Option>
                  })}
                </Select>
              </div>
              <div className="export-content">
                {this.state.curExportType ?
                  <div>
                    <p className="export-desc">{exportDataModule[this.state.curExportType].desc}</p>
                    <a target="_blank" href={this.state.curExportType && exportDataModule[this.state.curExportType] && exportDataModule[this.state.curExportType].route} >
                      <Button className="export-button" type="primary" size="large"> 导出 </Button>

                    </a>
                  </div>
                  :
                  <Button disabled className="export-button" type="primary" size="large"> 导出 </Button>
                }


              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProjectData;
