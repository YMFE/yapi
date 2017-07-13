import './Interface.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import InterfaceList from './InterfaceList/InterfaceList.js'
import InterfaceTable from './InterfaceTable/InterfaceTable.js'
import InterfaceMode from './InterfaceMode/InterfaceMode.js'
import { 
  fetchInterfaceData, 
  projectMember,
  closeProjectMember,
} from '../../actions/interfaceAction.js'

@connect(
  state => {
    return {
      interfaceData: state.Interface.interfaceData,
      modalVisible: state.Interface.modalVisible,
      closeProjectMember: state.Interface.closeProjectMember,
    }
  },
  {
    fetchInterfaceData,
    projectMember,
    closeProjectMember,
  }
)

class Interface extends Component {
  static propTypes = {
    fetchInterfaceData: PropTypes.func,
    interfaceData: PropTypes.array,
    projectMember: PropTypes.func,
    closeProjectMember: PropTypes.func,
    modalVisible: PropTypes.bool,
  }

  constructor(props) {
    super(props)
  }

  componentWillMount () {
    this.props.fetchInterfaceData()
  }

  render () {
    const { interfaceData, projectMember, modalVisible } = this.props

    return (
      <section className="interface-box">
        <InterfaceList projectMember={projectMember} />
        <InterfaceMode modalVisible={modalVisible} closeProjectMember={this.props.closeProjectMember} />
        <InterfaceTable data={interfaceData} />
      </section>
    )
  }
}

export default Interface
