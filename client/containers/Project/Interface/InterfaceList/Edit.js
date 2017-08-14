import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import InterfaceEditForm from './InterfaceEditForm.js'
import './Edit.scss'

@connect(
  state => {
    return {
      curdata: state.inter.curdata
    }
  }
)

class InterfaceEdit extends Component{
  static propTypes = {
    curdata: PropTypes.object
  }

  onSubmit = (params)=>{
    console.log('edit', params)
  }

  render(){
    return <div className="interface-edit">
      <InterfaceEditForm onSubmit={this.onSubmit} curdata={this.props.curdata} />
    </div>
  }
}

export default InterfaceEdit;