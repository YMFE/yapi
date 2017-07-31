import React, { Component } from 'react'
import { Card } from 'antd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Mock from 'mockjs'

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
    }catch(e){
      json = false;
    }
    if(json !== false){
      j = JSON.stringify(Mock.mock(json), null, "   ");
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
