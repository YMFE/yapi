import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

@connect(
  state => {
    return {
      curdata: state.inter.curdata
    }
  }
)

class InterfaceView extends Component{
  static propTypes = {
    curdata: PropTypes.object
  }

  render(){
    console.log(this.props.curdata)
    let view = JSON.stringify(this.props.curdata, null, "   ");
    return <pre>
      {view}
    </pre>
  }
}

export default InterfaceView;