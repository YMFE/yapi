import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import InterfaceEditForm from './InterfaceEditForm.js'
import { updateInterfaceData } from '../../../../reducer/modules/interface.js';
import axios from 'axios'
import {message} from 'antd'
import './Edit.scss'

@connect(
  state => {
    return {
      curdata: state.inter.curdata,
      currProject: state.project.currProject
    }
  },{
    updateInterfaceData
  }
)

class InterfaceEdit extends Component{
  static propTypes = {
    curdata: PropTypes.object,
    currProject:PropTypes.object,
    updateInterfaceData: PropTypes.func
  }

  constructor(props){
    super(props)
    const {curdata, currProject} = this.props;
    this.state = {
      mockUrl: location.protocol + '//' + location.hostname + (location.port !== "" ? ":" + location.port : "") + `/mock/${currProject._id}${currProject.basepath}${curdata.path}`
    }
  }

  onSubmit =async (params)=>{
    params.id = params._id = this.props.curdata._id;
    let result =await  axios.post('/api/interface/up', params);
    if(result.data.errcode === 0){
      this.props.updateInterfaceData(params);
      message.success('保存成功');
    }else{
      message.success(result.data.errmsg)
    }    
  }

  componentWillMount(){
    let s = new WebSocket('ws://yapi.local.qunar.com:3000/api/interface/solve_conflict?id=1');
    s.onopen = (e)=>{
      console.log('open',e)
      s.send('abc')
      //s.close()
      s.send('aaaaa')
    }

    s.onclose = (e)=>{
      console.log('close',e)
    }

    s.onmessage = (e)=>{
      console.log('message',e)
    }

    s.onerror = (e)=>{
      console.log('error',e)
    }


  }

  render(){
    return <div className="interface-edit">
      <InterfaceEditForm mockUrl={this.state.mockUrl} basepath={this.props.currProject.basepath} onSubmit={this.onSubmit} curdata={this.props.curdata} />
    </div>
  }
}

export default InterfaceEdit;