import './index.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Header from '../../components/Header/Header.js'


@connect(
  state => {
    return {
      
    }
  },
  {
    // fetchInterfaceData,
    // projectMember,
    // closeProjectMember
  }
)

class user extends Component {
  static propTypes = {
    fetchInterfaceData: PropTypes.func,
    interfaceData: PropTypes.array,
    projectMember: PropTypes.func,
    closeProjectMember: PropTypes.func,
    modalVisible: PropTypes.bool
  }

  constructor(props) {
    super(props)
  }

  componentWillMount () {
    
  }

  render () {
    

    return (
      <div>
        <Header />

        <section className="user-box">
          <InterfaceList projectMember={projectMember} />
          <InterfaceMode modalVisible={modalVisible} closeProjectMember={this.props.closeProjectMember} />
          <InterfaceTable data={interfaceData} />
        </section>
      </div>
    )
  }
}

export default Interface