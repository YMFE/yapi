import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { fetchInterfaceColList, fetchInterfaceCaseList, setColData } from '../../../../reducer/modules/interfaceCol'

@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currColId: state.interfaceCol.currColId,
      currCaseId: state.interfaceCol.currCaseId,
      isShowCol: state.interfaceCol.isShowCol
    }
  },
  {
    fetchInterfaceColList,
    fetchInterfaceCaseList,
    setColData
  }
)
@withRouter
export default class InterfaceColContent extends Component {

  static propTypes = {
    match: PropTypes.object,
    interfaceColList: PropTypes.array,
    fetchInterfaceColList: PropTypes.func,
    fetchInterfaceCaseList: PropTypes.func,
    setColData: PropTypes.func,
    history: PropTypes.object,
    currColId: PropTypes.number,
    currCaseId: PropTypes.number,
    isShowCol: PropTypes.bool
  }

  constructor(props) {
    super(props)
  }

  async componentWillMount() {
    const result = await this.props.fetchInterfaceColList(this.props.match.params.id)
    let { currColId, currCaseId, isShowCol } = this.props;
    const params = this.props.match.params;
    const { actionId } = params;
    currColId = +actionId || +currColId || result.payload.data.data[0]._id;
    currCaseId = currCaseId || result.payload.data.data[0].caseList[0]._id;
    if (isShowCol) {
      this.props.history.push('/project/' + params.id + '/interface/col/' + currColId)
    } else {
      this.props.history.push('/project/' + params.id + '/interface/case/' + currCaseId)
    }
    this.props.setColData({currColId, currCaseId})
  }

  render() {
    return <h1>hello colContent</h1>
  }
}
