import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import axios from 'axios'
import PropTypes from 'prop-types'
import './index.scss'
// import { withRouter } from 'react-router-dom';
import { Modal, Row, Col, Icon } from 'antd';
// import { autobind } from 'core-decorators';
import MockList from './MockList.js';
import MethodsList from './MethodsList.js'


class ModalPostman extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    handleCancel: PropTypes.func,
    handleOk: PropTypes.func

  }

  constructor(props) {
    super(props)
    this.state = {
      clickValue: [],
      methodsShow: false,
      methodsShowMore: false,
      methodsList: [],
      count: []
    }

  }

  mockClick(index) {
  
    return (e) => {
      if (index === 0) {
        this.setState({
          clickValue: [].concat([], e.target.value ),
          // arr: [{
          //   name: 'substr',
          //   params: []
          // }]
          methodsList:[]
        })
        this.createArrList([]);
      } else {
        let newArr = [].concat(this.state.methodsList);
        let newValue = [].concat(this.state.clickValue);
        newArr.splice(index, newArr.length - index)
        newValue.splice(index, newValue.length - index)
        this.setState({
          clickValue: [].concat(newValue, e.target.value ),
          methodsList:  newArr
        })
        this.createArrList(newArr)

      }
    }

  }


  createArrList(arr) {
   
    const ListSource = (props) => {
      return <MethodsList
        show={this.state.methodsShowMore}
        click={this.mockClick(props.index)}
        clickValue={this.state.clickValue[props.index]}
      />
    }
   
    this.setState({
      methodsList: [].concat(arr, ListSource)
    })

  }


  render() {
    const { visible, handleCancel, handleOk } = this.props
    const { clickValue } = this.state;
    console.log('clickValue', clickValue);
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
          <Col span={8} className="modal-postman-col">
            <MockList click={this.mockClick(0)} clickValue={clickValue[0]}></MockList>
            <h3>变量</h3>
          </Col>
          {
            this.state.methodsList.map((ListSourceComponent, index) => {
              return <Col span={8} className="modal-postman-col" key={index}>
                <ListSourceComponent index={index+1} />
              </Col>
            })
          }
        </Row>
        <Row className="modal-postman-expression">
          <Col span={6}><h3 className="title">输入值</h3></Col>
          <Col span={18}><h3>{clickValue}</h3></Col>
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