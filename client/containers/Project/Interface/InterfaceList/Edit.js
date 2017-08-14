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
      curdata: state.inter.curdata
    }
  },{
    updateInterfaceData
  }
)

class InterfaceEdit extends Component{
  static propTypes = {
    curdata: PropTypes.object,
    updateInterfaceData: PropTypes.func
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

  render(){
    return <div className="interface-edit">
      <InterfaceEditForm onSubmit={this.onSubmit} curdata={this.props.curdata} />
    </div>
  }
}

export default InterfaceEdit;