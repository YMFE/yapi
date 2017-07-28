import './Interface.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import InterfaceList from './InterfaceList/InterfaceList.js'
import InterfaceTable from './InterfaceTable/InterfaceTable.js'
import InterfaceMode from './InterfaceMode/InterfaceMode.js'
import moment from 'moment'
import {
  fetchInterfaceData,
  projectMember,
  closeProjectMember,
  saveInterfaceProjectId
} from '../../actions/interfaceAction.js'

@connect(
  state => {
    return {
      interfaceData: state.Interface.interfaceData,
      modalVisible: state.Interface.modalVisible,
      closeProjectMember: state.Interface.closeProjectMember
    }
  },
  {
    fetchInterfaceData,
    projectMember,
    closeProjectMember,
    saveInterfaceProjectId
  }
)

class Interface extends Component {
  static propTypes = {
    fetchInterfaceData: PropTypes.func,
    interfaceData: PropTypes.array,
    projectMember: PropTypes.func,
    saveInterfaceProjectId: PropTypes.func,
    closeProjectMember: PropTypes.func,
    modalVisible: PropTypes.bool
  }

  constructor(props) {
    super(props)
  }

  componentWillMount () {
    const interfaceId = this.getInterfaceId()
    const params = {
      params: {
        project_id: interfaceId
      }
    }

    this.props.saveInterfaceProjectId(interfaceId)
    console.log(params);
    axios.get('/interface/list', params)
      .then(result => {
        result = result.data.data
        result.map(value => {
          value.add_time = moment(value.add_time*1000).format('YYYY-MM-DD HH:mm:ss')
          return value
        })
        this.props.fetchInterfaceData(result)
      })
      .catch(e => {
        console.log(e)
      })
  }

  getInterfaceId () {
    const reg = /project\/(\d+)/g
    const url = location.href
    url.match(reg)
    console.log(url.match(reg));
    console.log(RegExp.$1);
    return RegExp.$1
  }

  render () {
    console.log('==================');
    const { interfaceData, projectMember, modalVisible } = this.props
    return (
      <div className="g-doc">
        <section className="interface-box">
          <InterfaceList projectMember={projectMember} />
          <InterfaceMode modalVisible={modalVisible} closeProjectMember={this.props.closeProjectMember} />
          <InterfaceTable data={interfaceData} />
        </section>
      </div>
    )
  }
}

export default Interface
