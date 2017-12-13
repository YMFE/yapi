import React, { PureComponent as Component } from 'react'
import { Timeline, Spin,Row, Col,Tag, Avatar, Button, Modal, AutoComplete } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { formatTime, json5_parse } from '../../common.js';
import variable from '../../constants/variable';
import { Link } from 'react-router-dom'
import { fetchNewsData, fetchMoreNews } from '../../reducer/modules/news.js'
import ErrMsg from '../ErrMsg/ErrMsg.js';
import axios from 'axios'

import './TimeLine.scss'
import 'jsondiffpatch/public/formatters-styles/annotated.css'
import 'jsondiffpatch/public/formatters-styles/html.css'

const jsondiffpatch= require('jsondiffpatch/public/build/jsondiffpatch-full.js')
const formattersHtml = require('jsondiffpatch/public/build/jsondiffpatch-formatters.js').html;


const instanceDiff = jsondiffpatch.create({});
const Option = AutoComplete.Option;

const AddDiffView = (props)=>{
  const {title, content, className} = props;
  if(!content){
    return null;
  }
  return <div className={className}>
    <h3 className="title">{title}</h3>
    <div dangerouslySetInnerHTML={{__html: content}}></div>
  </div>
}

AddDiffView.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.string
}

const diffText = (left, right)=>{
  left = left || '';
  right = right || '';
  if(left == right){
    return null;
  }
  var delta = instanceDiff.diff(left, right);
  return formattersHtml.format(delta, left)
}

const diffJson = (left, right)=>{
  left = json5_parse(left);
  right = json5_parse(right);
  var delta = instanceDiff.diff(left, right);
  return formattersHtml.format(delta, left)
}

const valueMaps = {
  '1': '必需',
  '0': '非必需',
  'text': '文本',
  'file': '文件',
  'undone': '未完成',
  'done': '已完成'
}

const handleParams = (item)=>{
  delete item._id;
  Object.keys(item).forEach(key=>{
    switch(key){
      case 'required' : item[key] = valueMaps[item[key]]; break;
      case 'type' : item[key] = valueMaps[item[key]] ;break;
    }
  })
  return item;
}

const diffArray = (arr1, arr2)=>{
  arr1 = arr1 || [];
  arr2 = arr2 || [];
  arr1 = arr1.map(handleParams);
  arr2 = arr2.map(handleParams);
  return diffJson(arr1, arr2);
}

function timeago(timestamp) {
  let minutes, hours, days, seconds, mouth, year;
  const timeNow = parseInt(new Date().getTime() / 1000);
  seconds = timeNow - timestamp;
  if (seconds > 86400 * 30 * 12) {
    year = parseInt(seconds / (86400 * 30 * 12));
  } else {
    year = 0;
  }
  if (seconds > 86400 * 30) {
    mouth = parseInt(seconds / (86400 * 30));
  } else {
    mouth = 0;
  }
  if (seconds > 86400) {
    days = parseInt(seconds / (86400));
  } else {
    days = 0;
  }
  if (seconds > 3600) {
    hours = parseInt(seconds / (3600));
  } else {
    hours = 0;
  }
  minutes = parseInt(seconds / 60);
  if (year > 0) {
    return year + "年前";
  } else if (mouth > 0 && year <= 0) {
    return mouth + "月前";
  } else if (days > 0 && mouth <= 0) {
    return days + "天前";
  } else if (days <= 0 && hours > 0) {
    return hours + "小时前";
  } else if (hours <= 0 && minutes > 0) {
    return minutes + "分钟前";
  } else if (minutes <= 0 && seconds > 0) {
    if (seconds < 30) {
      return "刚刚";
    } else {
      return seconds + "秒前";
    }

  } else {
    return "刚刚";
  }
}
// timeago(new Date().getTime() - 40);

@connect(

  state => {
    return {
      newsData: state.news.newsData,
      curpage: state.news.curpage,
      curUid: state.user.uid
    }
  },
  {
    fetchNewsData: fetchNewsData,
    fetchMoreNews: fetchMoreNews
  }
)

class TimeTree extends Component {
  static propTypes = {
    newsData: PropTypes.object,
    fetchNewsData: PropTypes.func,
    fetchMoreNews: PropTypes.func,
    setLoading: PropTypes.func,
    loading: PropTypes.bool,
    curpage: PropTypes.number,
    typeid: PropTypes.number,
    curUid: PropTypes.number,
    type: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      bidden: "",
      loading: false,
      visible: false,
      curDiffData: {},
      apiList: []
    }
    this.curInterfaceId = '';
  }


  getMore() {
    const that = this;

    if (this.props.curpage <= this.props.newsData.total) {

      this.setState({ loading: true });
      this.props.fetchMoreNews(this.props.typeid, this.props.type, this.props.curpage+1, 10, this.curInterfaceId).then(function () {
        that.setState({ loading: false });
        if (that.props.newsData.total === that.props.curpage) {
          that.setState({ bidden: "logbidden" })
        }
      })
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  }

  componentWillMount() {
    this.props.fetchNewsData(this.props.typeid, this.props.type, 1, 10)
    if(this.props.type === 'project'){
      this.getApiList()
    }
  }

  openDiff = (data)=>{
    this.setState({
      curDiffData: data,
      visible: true
    });
  }

  async getApiList(){
    let result = await axios.get('/api/interface/list?project_id=' + this.props.typeid);
    this.setState({
      apiList: result.data.data
    })
  }

  handleSelectApi = (interfaceId)=>{
    this.curInterfaceId = interfaceId;
    this.props.fetchNewsData(this.props.typeid, this.props.type, 1, 10, interfaceId)
  }

  render() {
    let data = this.props.newsData ? this.props.newsData.list : [];
    const curDiffData = this.state.curDiffData;
    let logType = {
      project: "项目",
      group: "分组",
      interface: "接口",
      interface_col: "接口集",
      user: "用户",
      other: "其他"
    };

    const children = this.state.apiList.map((item) => {
      let methodColor = variable.METHOD_COLOR[item.method ? item.method.toLowerCase() : 'get'];
      return <Option title={item.title} value={item._id+''} path={item.path} key={item._id}>{ item.path } <Tag style={{ color: methodColor.color, backgroundColor: methodColor.bac }} >get</Tag></Option>;
    });

    children.unshift(
      <Option value='' key='all' >选择全部</Option>
    )
    
    
    if (data && data.length) {
      data = data.map( (item, i)=> {
        let interfaceDiff = false;
        if(item.data && typeof item.data === 'object' && item.data.interface_id){
          interfaceDiff = true;
          
        }
        return (<Timeline.Item dot={<Link to={`/user/profile/${item.uid}`}><Avatar src={`/api/user/avatar?uid=${item.uid}`} /></Link>} key={i}>
          <div className="logMesHeade">
            <span className="logoTimeago">{timeago(item.add_time)}</span>
            {/*<span className="logusername"><Link to={`/user/profile/${item.uid}`}><Icon type="user" />{item.username}</Link></span>*/}
            <span className="logtype">{logType[item.type]}动态</span>
            <span className="logtime">{formatTime(item.add_time)}</span>
          </div>
          <span className="logcontent" dangerouslySetInnerHTML={{__html: item.content}}></span>
          <div style={{padding: "10px 0 0 10px"}}>{interfaceDiff && 
            <Button onClick={()=>this.openDiff(item.data)}>改动详情</Button>
          }</div>
        </Timeline.Item>);
      });
    } else {
      data = "";
    }
    let pending = this.props.newsData.total <= this.props.curpage ? <a className= "logbidden">以上为全部内容</a> : <a className="loggetMore" onClick={this.getMore.bind(this)}>查看更多</a>;
    if (this.state.loading) {
      pending = <Spin />
    }
    let diffView = [];
    if(curDiffData && typeof curDiffData === 'object' && curDiffData.current){
      const {current, old} = curDiffData;
      if(current.path != old.path){
        diffView.push({
          title: 'Api 路径',
          content: diffText(old.path, current.path)
        })
      }
      if(current.title != old.title){
        diffView.push({
          title: 'Api 名称',
          content: diffText(old.title, current.title)
        })
      }

      if(current.method != old.method){
        diffView.push({
          title: 'Method',
          content: diffText(old.method, current.method)
        })
      }

      if(current.catid != old.catid){
        diffView.push({
          title: '分类 id',
          content: diffText(old.catid, current.catid)
        })
      }

      if(current.status != old.status){
        diffView.push({
          title: '接口状态',
          content: diffText(valueMaps[old.status], valueMaps[current.status])
        })
      }
      diffView.push({
        title: 'Request Path Params',
        content: diffArray(old.req_params, current.req_params)
      })

      diffView.push({
        title: 'Request Query',
        content: diffArray(old.req_query, current.req_query)
      })

      diffView.push({
        title: 'Request Header',
        content: diffArray(old.req_headers, current.req_headers)
      })

      let oldValue = current.req_body_type === 'form' ? old.req_body_form : old.req_body_other;
      if(current.req_body_type !== old.req_body_type){
        diffView.push({
          title: 'Request Type',
          content: diffText(old.req_body_type, current.req_body_type)
        })
        oldValue = null;
        
      }
      
      if(current.req_body_type === 'json'){
        diffView.push({
          title: 'Response Body',
          content: diffJson(oldValue, current.req_body_other)
        })
      }else if(current.req_body_type === 'form'){
        diffView.push({
          title: 'Response Form Body',
          content: diffArray(oldValue, current.req_body_form)
        })
      }else{
        diffView.push({
          title: 'Response Raw Body',
          content: diffText(oldValue, current.req_body_other)
        })
      }

      let oldResValue = old.res_body;
      if(current.res_body_type !== old.res_body_type){
        diffView.push({
          title: 'Response Type',
          content: diffText(old.res_body_type, current.res_body_type)
        })
        oldResValue = '';
      }
      
      if(current.res_body_type === 'json'){
        diffView.push({
          title: 'Response Body',
          content: diffJson(oldResValue, current.res_body)
        })
      }else{
        diffView.push({
          title: 'Response Body',
          content: diffText(oldResValue, current.res_body)
        })
      }      
    }

    diffView = diffView.filter(item=>item.content)
    

    return (
      <section className="news-timeline">
        <Modal          
          style={{minWidth: '800px'}}
          title="Api 改动日志"
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <i>注： 绿色代表新增内容，红色代表删除内容</i>
          <div className="project-interface-change-content">
            {diffView.map((item, index)=>{
              return <AddDiffView className="item-content" title={item.title} key={index} content={item.content} />
            })}
            {diffView.length === 0 && 
              <ErrMsg type="noChange" />
            }
          </div>
        </Modal>
        {this.props.type === 'project' && 
          <Row className="news-search">
            <Col span="3">选择查询的 Api：</Col>
            <Col span="10">
              <AutoComplete
                onSelect={this.handleSelectApi}
                style={{width: '100%'}}                
                placeholder="Select Api"
                optionLabelProp="path"
                filterOption={(inputValue, options)=>{
                  if(options.props.value == '') return true;
                  if(options.props.path.indexOf(inputValue) !== -1 || options.props.title.indexOf(inputValue) !== -1){
                    return true;
                  }
                  return false;
                }}
              >
                {children}
              </AutoComplete>
            </Col>

          </Row>        
        }
        {data ? <Timeline className="news-content" pending={pending}>{data}</Timeline> : <ErrMsg type="noData"/>}
      </section>
    )
  }
}

export default TimeTree
