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

// 
function deepEqual(state){
  return JSON.parse(JSON.stringify(state))
}

function closeRightTabsAndAddNewTab(arr,index){
  let newParamsList = [].concat(arr);
  return newParamsList.splice(index, newParamsList.length - index);

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
      clickValue: [],
      methodsShow: false,
      methodsShowMore: false,
      methodsList: [],
      methodsParamsList: [{
        name:'',
        params:[],
        component:''
      }
      ]
    }

  }

  mockClick(index) {
    return (e) => {
      if (index === 0) {
        // let firstParamsItem = {};
        let firstParamsItem = Object.assign({},
          {
            name: e.target.value,
            params: [],
            component: this.createArrList([])
          });
        this.setState({
          clickValue: [].concat([], e.target.value),
          methodsList: [],
          methodsParamsList: [].concat([], firstParamsItem)
        })
        this.createArrList([]);

      } else {
        let newArr = [].concat(this.state.methodsList);
        let newValue = [].concat(this.state.clickValue);
        newArr.splice(index, newArr.length - index)
        newValue.splice(index, newValue.length - index)

        let newParamsList = [].concat(this.state.methodsParamsList);
        newParamsList.splice(index, newParamsList.length - index);

        let paramsItem = Object.assign({},
          {
            name: e.target.value,
            params: [],
            component: this.createArrList([])
          });

        var a = JSON.parse(JSON.stringify(this.state.methodsParamsList))
          a[index].name = 1
          this.

        this.setState({
          clickValue: [].concat(newValue, e.target.value),
          methodsList: newArr,
          methodsParamsList: [].concat(newParamsList, paramsItem)
        })
        this.createArrList(newArr)

      }
    }

  }

  handleParamsInput =(e)=>{
    console.log('input',e);

  }


  createArrList(arr) {
    const ListSource = (props) => {
      return <MethodsList
        show={this.state.methodsShowMore}
        click={this.mockClick(props.index)}
        clickValue={this.state.clickValue[props.index]}
        paramsInput={this.handleParamsInput}
      />
    }

    this.setState({
      methodsList: [].concat(arr, ListSource)
    })

    return ListSource;

  }


  render() {
    const { visible, handleCancel, handleOk } = this.props
    const { clickValue, methodsParamsList } = this.state;
    console.log('state', this.state);
    const {name} = methodsParamsList[0];
    console.log('list',name);
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
            <MockList click={this.mockClick(0)} clickValue={name}></MockList>
            <h3>变量</h3>
          </Col>
          {
            methodsParamsList.map((ListSourceComponent, index) => {
              return <Col span={8} className="modal-postman-col" key={index}>
                {ListSourceComponent.component&&
                <ListSourceComponent.component index={index + 1} />}
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