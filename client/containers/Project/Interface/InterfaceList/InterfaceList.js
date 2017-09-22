import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import axios from 'axios'
import {
  Table, Button, Modal, message, Tooltip, Select
} from 'antd';
import AddInterfaceForm from './AddInterfaceForm';
import { fetchInterfaceList} from '../../../../reducer/modules/interface.js';
import { Link } from 'react-router-dom';
import variable from '../../../../constants/variable';
import './Edit.scss';
const Option = Select.Option;

@connect(
  state => {
    return {
      curData: state.inter.curdata,
      curProject: state.project.currProject,
      catList: state.inter.list
    }
  },{
    fetchInterfaceList
  })
class InterfaceList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      data: [],
      sortedInfo: {
        order: 'ascend',
        columnKey: 'title'
      },
      catid: null
    }
  }

  static propTypes = {
    curData: PropTypes.object,
    catList: PropTypes.array,
    match: PropTypes.object,
    curProject: PropTypes.object,
    history: PropTypes.object,
    fetchInterfaceList: PropTypes.func
  }

  handleRequest = async (props) => {
    const { params } = props.match;
    if (!params.actionId) {
      let projectId = params.id;
      this.setState({
        catid: null
      })
      let r = await axios.get('/api/interface/list?project_id=' + projectId);
      this.setState({
        data: r.data.data
      })
    } else if (isNaN(params.actionId)) {
      let catid = params.actionId.substr(4)
      this.setState({ catid: +catid })
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

  componentWillMount() {
    this.actionId = this.props.match.params.actionId;
    this.handleRequest(this.props)
  }

  componentWillReceiveProps(nextProps) {
    let _actionId = nextProps.match.params.actionId;
    if (this.actionId !== _actionId) {
      this.actionId = _actionId;
      this.handleRequest(nextProps)
    }
  }

  handleAddInterface =(data)=> {
    data.project_id = this.props.curProject._id;
    axios.post('/api/interface/add', data).then((res) => {
      if (res.data.errcode !== 0) {
        return message.error(res.data.errmsg);
      }
      message.success('接口添加成功')
      let interfaceId = res.data.data._id;
      this.props.history.push("/project/" + data.project_id + "/interface/api/" + interfaceId)
      this.props.fetchInterfaceList(data.project_id)
    })
  }

  changeInterfaceStatus = (e) => {
    console.log(e);
    // this.props.changeMemberRole({ id, member_uid, role }).then((res) => {
    //   if (!res.payload.data.errcode) {
    //     message.success(res.payload.data.errmsg);
    //     this.reFetchList(); // 添加成功后重新获取分组成员列表
    //   }
    // });
  }

  render() {
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    const columns = [{
      title: '接口名称',
      dataIndex: 'title',
      key: 'title',
      width: 30,
      sorter: (a, b) => {
        return a.title.localeCompare(b.title) === 1
      },
      sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
      render: (text, item)=>{
        return <Link to={"/project/" + item.project_id + "/interface/api/" + item._id} ><span className="path">{text}</span></Link>
      }
    }, {
      title: '接口路径',
      dataIndex: 'path',
      key: 'path',
      width: 50,
      render: (item) => {
        const path = this.props.curProject.basepath + item;
        return <Tooltip title={path} placement="topLeft" overlayClassName="toolTip"><span className="path">{path}</span></Tooltip>
      }
    }, {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      width: 12,
      render: (item) => {
        let methodColor = variable.METHOD_COLOR[item ? item.toLowerCase() : 'get'];
        return <span style={{color:methodColor.color,backgroundColor:methodColor.bac}} className="colValue">{item}</span>
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 14,
      render: (item) => {
        console.log(item);
        return <Select value={item} className="select" onChange={this.changeInterfaceStatus}>
          <Option value={'done'}><span className="tag-status done">已完成</span></Option>
          <Option value={'undone'}><span className="tag-status undone">未完成</span></Option>
        </Select>
      },
      filters: [{
        text: '已完成',
        value: 'done'
      }, {
        text: '未完成',
        value: 'undone'
      }],
      onFilter: (value, record) => record.status.indexOf(value) === 0
    }]
    let intername = '';
    if(this.props.curProject.cat){
      for(let i = 0;i<this.props.curProject.cat.length;i++){
        if(this.props.curProject.cat[i]._id === this.state.catid){
          intername = this.props.curProject.cat[i].name;
        }
      }
    }
    const data = this.state.data.map(item => {
      item.key = item._id;
      return item;
    });
    return (
      <div style={{ padding: '24px' }}>
        <h2 className="interface-title" style={{ display: 'inline-block', margin: 0}}>{intername?intername:'全部接口'}</h2>
        <Button style={{float: 'right'}} type="primary" onClick={() => this.setState({ visible: true })}>添加接口</Button>
        <Table className="table-interfacelist"  pagination={false} columns={columns} onChange={this.handleChange} dataSource={data} />
        <Modal
          title="添加接口"
          visible={this.state.visible}
          onCancel={() => this.setState({ 'visible': false })}
          footer={null}
        >
          <AddInterfaceForm catid={this.state.catid} catdata={this.props.curProject.cat} onCancel={() => this.setState({ 'visible': false })} onSubmit={this.handleAddInterface} />
        </Modal>
      </div>
    )
  }
}

export default InterfaceList
