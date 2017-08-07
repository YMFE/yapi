import React, { Component } from 'react'
import { Card } from 'antd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Mock from 'mockjs'
import parseCommon from '../../../parseCommon';
@connect(
  state => {
    return {
      resParams: state.addInterface.resParams,
      reqParams: state.addInterface.reqParams
    }
  }
)
class Result extends Component {
  static propTypes = {
    resParams: PropTypes.string,
    reqParams: PropTypes.string,
    isSave: PropTypes.bool,
    mockJson: PropTypes.string
  }

  constructor(props) {
    super(props)
  }

  render () { 
    const { mockJson, resParams } = this.props
    let json, j;
    try{
      json = JSON.parse(resParams);
      json = parseCommon.regexp_parse(json);
    }catch(e){
      json = false;
    }
    if(json !== false){
      try{
        j = JSON.stringify(Mock.mock(json), null, "   ");
      }catch(e){
        j = ""
      }
      
    }else{
      j = mockJson
    }
    

    return (
      <div className="result">
        <Card title="Mock 结果" style={{ width: 500 }}>
          <pre>{j}</pre>
        </Card>
      </div>
    )
  }
}

export default Result
