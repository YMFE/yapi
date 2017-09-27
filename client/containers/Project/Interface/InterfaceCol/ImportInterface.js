import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
// import { Table } from 'antd'
// import { fetchInterfaceList } from '../../../../reducer/modules/interface.js';

// @connect(
//   state => {
//     return {
//       list: state.inter.list
//     }
//   },
//   {
//     fetchInterfaceList
//   }
// )
export default class ImportInterface extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    // colId: PropTypes.number,
    // fetchInterfaceList: PropTypes.func,
    // projectId: PropTypes.number,
    list: PropTypes.array
  }

  // componentWillMount() {
  //   this.props.fetchInterfaceList(this.props.projectId);
  // }

  render() {
    console.log(this.props.list)
    return (
      <div>
        <div>{this.props.list}</div>
      </div>
    )
  }
}