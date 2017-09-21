import React, { Component } from 'react'
import { Upload, Icon, message, Select } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ProjectData.scss';
import axios from 'axios';
const Dragger = Upload.Dragger;
const Option = Select.Option;

const plugin = require('client/plugin.js');

const importDataModule = {};

@connect(
  state => {
    // console.log(state);
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
      curImportType: null
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
    plugin.emitHook('import_data', importDataModule, this.props);
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

  handleAddInterface(info) {
    if (!this.state.curImportType) {
      return message.error('请选择导入数据的方式');
    }
    if (this.state.selectCatid) {
      // let filename = info.file.name;
      // let filetype = filename.substr(filename.lastIndexOf(".")).toLowerCase();
      // console.log(filename,filetype);
      //if(filetype != ".json") return message.error("文件格式只能为json");
      let reader = new FileReader();
      reader.readAsText(info.file);
      reader.onload = (res) => {
        res = importDataModule[this.state.curImportType].run(res.target.result);
        res = res.apis;
        let len = res.length;
        let count = 0;
        let successNum = len;
        res.forEach(async (item) => {
          let data = {
            ...item,
            project_id: this.props.match.params.id,
            catid: this.state.selectCatid
          }
          if (this.props.basePath) {
            data.path = data.path.indexOf(this.props.basePath) === 0 ? data.path.substr(this.props.basePath.length) : data.path;
          }

          let result = await axios.post('/api/interface/add', data);
          count++;
          if (result.data.errcode) {
            successNum--;
          }
          if (count === len) {
            message.success(`成功导入接口 ${successNum} 个`);
          }

        })
      }
    } else {
      message.error("请选择上传的分类");
    }
  }

  handleImportType = (val) => {
    this.setState({
      curImportType: val
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
              <div ><h3>数据导入&nbsp;<a target="_blank" rel="noopener noreferrer" title="点击查看文档"  href="https://yapi.ymfe.org/data.html" ><Icon type="question-circle-o" /></a></h3></div>
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
                  placeholder="请选择数据导入的接口分类"
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
          </div>
        </div>
      </div>
    )
  }
}

export default ProjectData;
