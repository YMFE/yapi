import React, { Component } from 'react'
import { Card } from 'antd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Mock from 'mockjs'


function regexp_parse(p,c) {
  c = c || {}; 
  for (let i in p) {  
    if(! p.hasOwnProperty(i)){  
      continue;  
    }  
    if (typeof p[i] === 'object') {  
      c[i] = (p[i].constructor === Array) ? [] : {};  
      regexp_parse(p[i], c[i]);  
    } else {  
      if(/^\/.+\/$/.test(p[i])){
        try{
          let regexpStr = p[i].substring(1,p[i].length-1);
          // for(let i = 0;i<regexpStr.length;i++){
          //   if("* . ? + $ ^ [ ] ( ) { } | \ /".indexOf(regexpStr[i])>-1){
          //     regexpStr[i] = "\\"+regexpStr[i];
          //   }
          // }
          
          c[i] = new RegExp(regexpStr);
        }
        catch(e)
        {
          c[i] = p[i];
        }
      }else{
        c[i] = p[i]; 
      }
      
    }  
  }  
  return c;  
}
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
      json = regexp_parse(json);
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
