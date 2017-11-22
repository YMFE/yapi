import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import axios from 'axios'
import PropTypes from 'prop-types'
import './index.scss'
// import { withRouter } from 'react-router-dom';
import { Modal, Row, Col, Icon, Collapse, Input } from 'antd'
import MockList from './MockList.js'
import MethodsList from './MethodsList.js'
import VariablesSelect from './VariablesSelect.js'
import { handleParamsValue } from '../../common.js'
const Panel = Collapse.Panel;

// 深拷贝
function deepEqual(state) {
  return JSON.parse(JSON.stringify(state))
}

function closeRightTabsAndAddNewTab(arr, index, curname, params) {
  // console.log(params);
  let newParamsList = [].concat(arr);
  newParamsList.splice(index + 1, newParamsList.length - index);
  newParamsList.push({
    name: '', params: []
  })

  let curParams = params || [];
  newParamsList[index] = {
    ...newParamsList[index],
    name: curname,
    params: curParams
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
      }],
      result: ''
    }

  }

  mockClick(index) {
    return (curname, params) => {
      console.log('value', params);
      // let curname = e;
      console.log('curname', curname);
      let newParamsList = closeRightTabsAndAddNewTab(this.state.methodsParamsList, index, curname, params)
      this.setState({
        methodsParamsList: newParamsList
      })
    }
  }
  //  处理常量输入 
  handleConstantsInput = (val, index) => {
    this.mockClick(index)(val);
  }

  handleParamsInput = (e, clickIndex, paramsIndex) => {
    let newParamsList = deepEqual(this.state.methodsParamsList);
    // newParamsList[index].params.push(e);
    newParamsList[clickIndex].params[paramsIndex] = e
    this.setState({
      methodsParamsList: newParamsList
    })
  }

  // 方法
  MethodsListSource = (props) => {
    return <MethodsList
      click={this.mockClick(props.index)}
      clickValue={props.value}
      paramsInput={this.handleParamsInput}
      clickIndex={props.index}
    />
  }


  //  处理表达式
  handleValue(val) {
    // let val = '{@string |length}'
    return handleParamsValue(val, {});
  }

  render() {
    const { visible, handleCancel, handleOk } = this.props
    const { methodsParamsList } = this.state;
    // const { name } = methodsParamsList[0];
    // console.log('common', common);

    const outputParams = () => {
      let str = '';
      let length = methodsParamsList.length;
      methodsParamsList.forEach((item, index) => {
        let isShow = item.name && length - 2 !== index;
        str += item.name;
        item.params.forEach((item, index) => {
          let isParams = index > 0;
          str += isParams ? ' , ' : ' : ';
          str += item
        })
        str += isShow ? ' | ' : '';
      })
      return str
    }

    return (
      <Modal
        title={<p><Icon type="edit" /> 高级参数设置</p>}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName="modal-postman"
        width={1000}
        maskClosable={false}
        okText="插入"
      >

        <Row className="modal-postman-form" type="flex">
          {
            methodsParamsList.map((item, index) => {
              return item.type === 'dataSource' ?
                <Col span={8} className="modal-postman-col" key={index}>
                  <Collapse className="modal-postman-collapse" defaultActiveKey={['1']} bordered={false} accordion>
                    <Panel header={<h3 className="mock-title">常量</h3>} key="1">
                      <Input placeholder="基础参数值" onChange={(e) => this.handleConstantsInput(e.target.value, index)} />
                    </Panel>
                    <Panel header={<h3 className="mock-title">mock数据</h3>} key="2">
                      <MockList click={this.mockClick(index)} clickValue={item.name}></MockList>
                    </Panel>
                    <Panel header={<h3 className="mock-title">变量</h3>} key="3">
                      <VariablesSelect />
                    </Panel>
                  </Collapse>
                </Col>
                :
                <Col span={8} className="modal-postman-col" key={index}>
                  <this.MethodsListSource index={index} value={item.name} />
                </Col>
            })
          }
        </Row>
        <Row className="modal-postman-expression">
          <Col span={6}><h3 className="title">表达式</h3></Col>
          <Col span={18}>
            <span className="expression">{'{'}</span>
            <span className="expression-item">{outputParams()}</span>
            <span className="expression">{'}'}</span>
          </Col>
        </Row>
        <Row className="modal-postman-preview">
          <Col span={6}><h3 className="title">预览</h3></Col>
          <Col span={18}>
            <h3>
              {this.handleValue(outputParams())}
            </h3>
          </Col>
        </Row>
      </Modal>
    )
  }
}

export default ModalPostman;