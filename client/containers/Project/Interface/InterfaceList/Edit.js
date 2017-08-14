import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import InterfaceEditForm from './InterfaceEditForm.js'


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

  render(){
    
    return <div>
      <h3>Edit</h3>
      <InterfaceEditForm />
    </div>
  }
}

export default InterfaceEdit;