import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import axios from 'axios'
import PropTypes from 'prop-types'
import './index.scss'
// import { withRouter } from 'react-router-dom';
import { Modal, Row, Col, Icon } from 'antd';
import MockList from './MockList.js';
import MethodsList from './MethodsList.js'

// 深拷贝
function deepEqual(state) {
  return JSON.parse(JSON.stringify(state))
}

function closeRightTabsAndAddNewTab(arr, index, curname) {
  let newParamsList = [].concat(arr);
  newParamsList.splice(index + 1, newParamsList.length - index);
  newParamsList.push({
    name: '', params: []
  })
  newParamsList[index] = {
    ...newParamsList[index],
    name: curname,
    params: []
  }
  return newParamsList;

}


class ModalPostman extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    handleCancel: PropTypes.func,
    handleOk: PropTypes.func

  }

  constructor(props) {
    super(props)
    this.state = {
      methodsShow: false,
      methodsShowMore: false,
      methodsList: [],
      methodsParamsList: [{
        name: '',
        params: [],
        type: 'dataSource'
      }]
    }

  }

  mockClick(index) {
    return (e) => {
      let curname = e.target.value;
      let newParamsList = closeRightTabsAndAddNewTab(this.state.methodsParamsList, index, curname)
      this.setState({
        methodsParamsList: newParamsList
      })
    }
  }

  handleParamsInput = (e, index, ...params) => {
    let newParamsList = deepEqual(this.state.methodsParamsList);
    // newParamsList[index].params.push(e);
    newParamsList[index].params[0] = e
    this.setState({
      methodsParamsList: newParamsList
    })
  }

  MethodsListSource = (props) => {

    return <MethodsList
      click={this.mockClick(props.index)}
      clickValue={props.value}
      paramsInput={this.handleParamsInput}
      clickIndex={props.index}
    />
  }


  render() {
    const { visible, handleCancel, handleOk } = this.props
    const {  methodsParamsList } = this.state;
    const { name } = methodsParamsList[0];
    console.log('list', this.state.methodsParamsList);
    return (
      <Modal
        title={<p><Icon type="edit" /> 高级参数设置</p>}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName="modal-postman"
        width={800}
      >

        <Row className="modal-postman-form" type="flex">
          {
            methodsParamsList.map((item, index) => {
              return item.type === 'dataSource' ?
                <Col span={8} className="modal-postman-col" key={index}>
                  <MockList click={this.mockClick(index)} clickValue={name}></MockList>
                  <h3>变量</h3>
                </Col>
                :
                <Col span={8} className="modal-postman-col" key={index}>
                  <this.MethodsListSource index={index} value={item.name} />
                </Col>
            })
          }
        </Row>
        <Row className="modal-postman-expression">
          <Col span={6}><h3 className="title">输入值</h3></Col>
          <Col span={18}>
            <span>${'{'}</span>
            {
              methodsParamsList.map((item, index) => {
                return item.name && 
                <span className="expression-item" key={index}>{item.name}({item.params})</span>
              })
            }
            <span>{'}'}</span>
          </Col>
        </Row>
        <Row className="modal-postman-preview">
          <Col span={6}><h3 className="title">预览</h3></Col>
          <Col span={18}><h3>输入值</h3></Col>
        </Row>
      </Modal>
    )
  }
}

export default ModalPostman;