import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { fetchInterfaceColList, setColData, fetchCaseData } from '../../../../reducer/modules/interfaceCol'
import { Postman } from '../../../../components'
// import Run from

@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currColId: state.interfaceCol.currColId,
      currCaseId: state.interfaceCol.currCaseId,
      currCase: state.interfaceCol.currCase,
      isShowCol: state.interfaceCol.isShowCol,
      currProject: state.project.currProject
    }
  },
  {
    fetchInterfaceColList,
    fetchCaseData,
    setColData
  }
)
@withRouter
export default class InterfaceCaseContent extends Component {

  static propTypes = {
    match: PropTypes.object,
    interfaceColList: PropTypes.array,
    fetchInterfaceColList: PropTypes.func,
    fetchCaseData: PropTypes.func,
    setColData: PropTypes.func,
    history: PropTypes.object,
    currColId: PropTypes.number,
    currCaseId: PropTypes.number,
    currCase: PropTypes.object,
    isShowCol: PropTypes.bool,
    currProject: PropTypes.object
  }

  constructor(props) {
    super(props)
  }

  getColId(colList, currCaseId) {
    let currColId = 0;
    colList.forEach(col => {
      col.caseList.forEach(caseItem => {
        if (+caseItem._id === currCaseId) {
          currColId = col._id;
        }
      })
    })
    return currColId;
  }

  async componentWillMount() {
    const result = await this.props.fetchInterfaceColList(this.props.match.params.id)
    let { currCaseId } = this.props;
    const params = this.props.match.params;
    const { actionId } = params;
    currCaseId = +actionId || +currCaseId || result.payload.data.data[0].caseList[0]._id;
    let currColId = this.getColId(result.payload.data.data, currCaseId);
    this.props.history.push('/project/' + params.id + '/interface/case/' + currCaseId)
    this.props.fetchCaseData(currCaseId)
    this.props.setColData({currCaseId: +currCaseId, currColId, isShowCol: false})
  }

  componentWillReceiveProps(nextProps) {
    const oldCaseId = this.props.match.params.actionId
    const newCaseId = nextProps.match.params.actionId
    if (oldCaseId !== newCaseId) {
      let currColId = this.getColId(this.props.interfaceColList, newCaseId);
      this.props.fetchCaseData(newCaseId);
      this.props.setColData({currCaseId: +newCaseId, currColId, isShowCol: false})
    }
  }

  render() {
    const { currCase } = this.props;
    const data = currCase;
    return (
      <div>
        <h1 style={{marginLeft: 8}}>{currCase.casename}</h1>
        <div>
          <Postman data={data} />
        </div>
      </div>
    )
  }
}
