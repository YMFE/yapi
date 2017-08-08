// import React, { Component } from 'react'
// import { Select, Input } from 'antd'
// import PropTypes from 'prop-types'
// import { autobind } from 'core-decorators'
// import { connect } from 'react-redux'
// import { deleteReqParams } from '../../../reducer/modules/addInterface.js'
// import json2html from 'json2html'

// @connect(
//   state => {
//     return {
//       reqParams: state.addInterface.reqParams
//     }
//   },
//   {
//     deleteReqParams
//   }
// )

// class ParamsList extends Component {
//   static propTypes = {
//     reqParams: PropTypes.array,
//     dataNum: PropTypes.number,
//     deleteReqParams: PropTypes.func
//   }

//   constructor(props) {
//     super(props)
//   }

//   @autobind
//   deleteReqParams (e) {
//     let newSeqParams = []
//     let reqParams = this.props.reqParams
//     let dataNum = e.target.getAttribute('data-num')
//     reqParams.map(value => {
//       if (+dataNum !== value.id) {
//         newSeqParams.push(value)
//       }
//     })
//     this.props.deleteReqParams(newSeqParams)
//   }

//   render () {
//     const Option = Select.Option
//     const dataNum = this.props.dataNum

//     return (
//       <li>
//         <Select defaultValue="选填" style={{ width: 'auto' }} onChange={this.handleChange} size="large" className="required">
//           <Option value="必填">必填</Option>
//           <Option value="选填">选填</Option>
//         </Select>
//         <em className="title">参数名称</em>
//         <Input placeholder="参数名称" className="name" size="large" />
//         <em className="title">参数说明</em>
//         <Input placeholder="参数说明" className="name" size="large" />
//         <span className="close" onClick={this.deleteReqParams} data-num={dataNum}>×</span>
//       </li>
//     )
//   }
// }

// export default ParamsList
