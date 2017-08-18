import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { fetchInterfaceColList, fetchCaseList, setColData } from '../../../../reducer/modules/interfaceCol'

@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currColId: state.interfaceCol.currColId,
      currCaseId: state.interfaceCol.currCaseId,
      isShowCol: state.interfaceCol.isShowCol,
      currCaseList: state.interfaceCol.currCaseList
    }
  },
  {
    fetchInterfaceColList,
    fetchCaseList,
    setColData
  }
)
@withRouter
export default class InterfaceColContent extends Component {

  static propTypes = {
    match: PropTypes.object,
    interfaceColList: PropTypes.array,
    fetchInterfaceColList: PropTypes.func,
    fetchCaseList: PropTypes.func,
    setColData: PropTypes.func,
    history: PropTypes.object,
    currCaseList: PropTypes.array,
    currColId: PropTypes.number,
    currCaseId: PropTypes.number,
    isShowCol: PropTypes.bool
  }

  constructor(props) {
    super(props)
  }

  async componentWillMount() {
    const result = await this.props.fetchInterfaceColList(this.props.match.params.id)
    let { currColId } = this.props;
    const params = this.props.match.params;
    const { actionId } = params;
    currColId = +actionId || +currColId || result.payload.data.data[0].caseList[0]._id;
    this.props.history.push('/project/' + params.id + '/interface/col/' + currColId)
    this.props.fetchCaseList(currColId)
    this.props.setColData({currColId: +currColId, isShowCol: true})
  }

  componentWillReceiveProps(nextProps) {
    const oldCaseId = this.props.match.params.actionId
    const newCaseId = nextProps.match.params.actionId
    if (oldCaseId !== newCaseId) {
      this.props.fetchCaseList(newCaseId);
      this.props.setColData({currColId: +newCaseId, isShowCol: true})
    }
  }

  render() {
    return (
      <div>
        <h1>hello colContent</h1>
        {JSON.stringify(this.props.currCaseList, null, 2)}
      </div>
    )
  }
}
