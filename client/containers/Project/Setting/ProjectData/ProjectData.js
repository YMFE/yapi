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
    // console.log(state);
    return {
      curCatid: state.inter.curdata.catid,
      basePath: state.project.currProject.basepath
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
    curCatid: PropTypes.number,
    basePath: PropTypes.string
  }

  componentWillMount(){
    axios.get(`/api/interface/getCatMenu?project_id=${this.props.projectId}`).then((data)=>{
      let menuList = data.data.data;
      this.setState({
        menuList: menuList
      })
    });
  }
  selectChange(value){
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

  checkInterRepeat(interData){
    let obj = {};
    let arr = [];
    for(let item in interData){
      // console.log(interData[item].url + "-" + interData[item].method);
      if(!obj[interData[item].url + "-" + interData[item].method+ "-"+interData[item].method]){
        arr.push(interData[item]);
        obj[interData[item].url + "-" + interData[item].method+ "-"+interData[item].method] = true;
      }
    }
    return arr;
  }

  handleReq_query(query){
    let res = [];
    if(query&&query.length){
      for(let item in query){
        res.push({
          name: query[item].key,
          desc: query[item].description,
          required: query[item].enable
        });
      }
    }
    return res;
  }
  handleReq_headers(headers){
    let res = [];
    if(headers&&headers.length){
      for(let item in headers){
        res.push({
          name: headers[item].key,
          desc: headers[item].description,
          value: headers[item].value,
          required: headers[item].enable
        });
      }
    }
    return res;
  }

  handleReq_body_form(body_form){
    let res = [];
    if(body_form&&body_form.length){
      for(let item in body_form){
        res.push({
          name: body_form[item].key,
          value: body_form[item].value,
          type: body_form[item].type
        });
      }
    }
    return res;
  }

  handlePath(path){
    path = path.replace(/{{(\w*)}}/,"");
    path = this.parseUrl(path).pathname;
    if(path.indexOf(this.props.basePath)>-1){
      path = path.substr(this.props.basePath.length);
    }
    if(path.charAt(0) != "/"){
      path = "/" + path;
    }
    if(path.charAt(path.length-1) === "/"){
      path = path.substr(0,path.length-1);
    }
    return path;
  }

  importPostman(data,key){
    let reflect = {//数据字段映射关系
      title: "name",
      path: "url",
      method: "method",
      desc: "description",
      req_query: "queryParams",
      req_headers: "headerData",
      req_params: "",
      req_body_type: "dataMode",
      req_body_form: "data",
      req_body_other: "rawModeData"
    };
    let allKey = ["title","path","method","desc","req_query","req_headers","req_body_type","req_body_form","req_body_other"];
    key = key || allKey;
    let res = {};
    for(let item in key){
      item = key[item];
      if(item === "req_query"){
        res[item] = this.handleReq_query.bind(this)(data[reflect[item]]);
      }else if(item === "req_headers"){
        res[item] = this.handleReq_headers.bind(this)(data[reflect[item]]);
      }else if(item === "req_body_form"){
        res[item] = this.handleReq_body_form.bind(this)(data[reflect[item]]);
      }else if(item === "req_body_type"){
        if(data.headers.indexOf('application/json')>-1){
          res[item] = "json";
        }else{
          res[item] = "raw";
        }
      }else if(item === "path"){
        res[item] = this.handlePath.bind(this)(data[reflect[item]]);
        if(res[item] && res[item].indexOf("/:") > -1){
          let params = res[item].substr(res[item].indexOf("/:")+2).split("/:");
          // res[item] = res[item].substr(0,res[item].indexOf("/:"));
          let arr = [];
          for(let i in params){
            arr.push({
              name: params[i],
              desc: ""
            });
          }
          res["req_params"] = arr;
        }
      }else if(item === "title"){
        let path = this.handlePath.bind(this)(data[reflect["path"]]);
        if(data[reflect[item]].indexOf(path) > -1){
          res[item] = path;
          if(res[item] && res[item].indexOf("/:") > -1){
            res[item] = res[item].substr(0,res[item].indexOf("/:"));
          }
        }else{
          res[item] = data[reflect[item]];
        }
      }else{
        res[item] = data[reflect[item]];
      }
    }
    return res;
  }

  uploadChnange(info){
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

  handleAddInterface(info){
    if(this.state.selectCatid){
      let filename = info.file.name;
      let filetype = filename.substr(filename.lastIndexOf(".")).toLowerCase();
      // console.log(filename,filetype);
      if(filetype != ".json") return message.error("文件格式只能为json");
      let reader = new FileReader();
      reader.readAsText(info.file);
      reader.onload = (res)=>{
        
        res = res.target.result;
        try{
          res = JSON.parse(res);
          let interData = res.requests;
          interData = this.checkInterRepeat.bind(this)(interData);

          if(interData && interData.length){
            let len = interData.length;
            let count = 0;
            let successNum = len;
            for(let item in interData){
              let data = this.importPostman.bind(this)(interData[item]);
              data = {
                ...data,
                project_id: this.props.projectId,
                catid: this.state.selectCatid
              }
              axios.post('/api/interface/add',data).then((res)=>{
                count++;
                if(res.data.errcode){
                  successNum--;
                }
                if(count === len){
                  message.success(`成功导入接口 ${successNum} 个`);
                }
              });
            }
          }
          
        }catch(e){
          message.error("文件格式必须为JSON");
        }
        
      }
    }else{
      message.error("请选择上传的分类");
    }
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