import React, { Component } from 'react'
import { Upload, Icon, message, Select } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ProjectData.scss';
import axios from 'axios';
const Dragger = Upload.Dragger;
const Option = Select.Option;

@connect(
  state=>{
    console.log(state);
    return {
      curCatid: state.inter.curdata.catid
    }
  },{

  }
)

class ProjectData extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectCatid:"",
      menuList:[]
    }
  }
  static propTypes = {
    match: PropTypes.object,
    projectId: PropTypes.number,
    curCatid: PropTypes.number
  }

  componentWillMount(){
    axios.get(`/api/interface/getCatMenu?project_id=${this.props.projectId}`).then((data)=>{
      let menuList = data.data.data;
      this.setState({
        menuList: menuList
      })
      // if(menuList&menuList.length){
      //   for(let item in menuList){

      //   }
      // }
      // console.log(data.data.data);
    });
  }
  selectChange(value){
    // this.setState();
    console.log(value);
    this.setState({
      selectCatid: +value
    })
  }

  parseUrl(url){
    let parser = document.createElement('a');
    parser.href = url;
    return {
      protocol: parser.protocol,
      hostname: parser.hostname,
      port: parser.port,
      pathname: parser.pathname,
      search: parser.search,
      host: parser.host
    }
  }

  importPostman(data){
    var a = {
      path: '/api/aa',
      queryParams: []
    }

    a.path = a.path.indexOf('/api') === 0 ? a.path.substr('/api'.length) :  a.path

    return {
      path: a.path,
      query: queryParams
    }
  }

  async handleAddInterface(){
    let data = await axios.post('/api/')
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
      customRequest: (info)=>{
        if(this.state.selectCatid){
          let reader = new FileReader();
          reader.readAsText(info.file);
          reader.onload = (res)=>{
            res = res.target.result;
            res = JSON.parse(res);
            axios.post('/api/interface/interUpload',{interData: res,project_id: this.props.projectId,catid: this.state.selectCatid}).then((res)=>{
              console.log(res);
              message.success(`成功导入接口 ${res.data.data} 个`)
            });
          }
        }else{
          message.error("请选择上传的分类");
        }
        
      },
      onChange(info) {
        
        const status = info.file.status;
        console.log(status);
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} 文件上传成功`);
        } else if (status === 'error') {
          message.error(`${info.file.name} 文件上传失败`);
        }
      }
    }
    return (
      <div className="m-panel">
        <div className="postman-dataImport">

          <div className="dataImportCon">
            <h3 className="dataImportTile">Postman 数据导入</h3>
            <div className="catidSelect">
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="请选择数据导入的接口分类"
                optionFilterProp="children"
                onChange={this.selectChange.bind(this)}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {this.state.menuList.map((item,key)=>{
                  return <Option key = {key} value={item._id+""}>{item.name}</Option>;
                })}
                
              </Select>
            </div>
            <div style={{ marginTop: 16, height: 180 }}>
              <Dragger {...uploadMess}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或者拖拽文件到上传区域</p>
                <p className="ant-upload-hint">注意：只支持json格式数据</p>
              </Dragger>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProjectData;