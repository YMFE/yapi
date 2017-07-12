import './Interface.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import InterfaceList from './InterfaceList/InterfaceList.js'
import InterfaceTable from './InterfaceTable/InterfaceTable.js'
import { fetchAuditIcons } from '../../actions/interface.js'

@connect(
  state => {
    return {
      interfaceData: state.data,
    }
  },
  {
    fetchAuditIcons,
  }
)
//
class Interface extends Component {
  static propTypes = {
    fetchAuditIcons: PropTypes.func,
  }

  constructor(props) {
    super(props)
  }

  componentWillMount () {
    this.props.fetchAuditIcons()
  }

  render () {
    const data = this.props.fetchAuditIcons().payload

    return (
      <section className="interface-box">
        <InterfaceList />
        <InterfaceTable data={data} />
      </section>
    )
  }
}

export default Interface