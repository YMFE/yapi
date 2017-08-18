import React,{Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {
  Table
} from 'antd';
class InterfaceList extends Component{
  constructor(props){
    super(props)
    this.state = {
      data : [],
      sortedInfo: {
        order: 'descend',
        columnKey: 'title'
      }
    }
  }

  static propTypes = {
    match: PropTypes.object
  }

  handleRequest = async (props)=>{
    const {params} = props.match;
    if(!params.actionId){
      let projectId = params.id;
      let r = await axios.get('/api/interface/list?project_id=' + projectId);
      this.setState({
        data: r.data.data
      })
    }else if(isNaN(params.actionId)){
      let catid = params.actionId.substr(4)
      let r = await axios.get('/api/interface/list_cat?catid=' + catid);
      this.setState({
        data: r.data.data
      })
    }
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter
    });
  }

  componentWillMount(){
    this.actionId = this.props.match.params.actionId;
    this.handleRequest(this.props)
  }

  componentWillReceiveProps(nextProps){
    let _actionId = nextProps.match.params.actionId;
    if(this.actionId !== _actionId){
      this.actionId = _actionId;      
      this.handleRequest(nextProps)
    }
  }

  render () {
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    const columns = [{
      title: '接口名称',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => b.title.length - a.title.length,
      sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order
    },{
      title: '接口URL',
      dataIndex: 'path',
      key: 'path'
    },{
      title: '请求方式',
      dataIndex: 'method',
      key: 'method'
    },{
      title: '更新日期',
      dataIndex: 'add_time',
      key: 'add_time'
    }]

    const data = this.state.data.map(item=>{
      item.key = item._id;
      return item;
    });
    
    return (
      <section className="interface-table">
        <Table size="small" pagination={false} bordered={true} columns={columns} onChange={this.handleChange} dataSource={data} />
      </section>
    )
  }
}

export default InterfaceList