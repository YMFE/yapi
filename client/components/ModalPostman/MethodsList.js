import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Radio, Icon, Input, Select } from 'antd';
// import common from 'common/power-string.js'
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


const inputComponent = (props) => {
  let index = props.index
  return <Input size="small" placeholder="请输入参数" disabled={!props.disabled} onChange={(e) => props.paramsInput(e.target.value, index)} />
}

inputComponent.propTypes = {
  paramsInput: PropTypes.func,
  index: PropTypes.number,
  disabled: PropTypes.bool
}

const selectComponent = (props) => {
  const subname = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512'];
  let index = props.index;
  return <Select placeholder="请选择" style={{ width: 150 }} size="small" disabled={!props.disabled} onChange={(e) => props.paramsInput(e, index)}>
    {
      subname.map((item, index) => {
        return <Option value={item} key={index}>{item}</Option>
      })
    }
  </Select>
}
selectComponent.propTypes = {
  paramsInput: PropTypes.func,
  index: PropTypes.number,
  disabled: PropTypes.bool
}


// const handleChange = (v) => {
//   console.log('value', v);
// }

const METHODS_LIST = [
  { name: 'md5', type: false },
  { name: 'lower', type: false },
  { name: 'length', type: false },
  { name: 'substr', type: true },
  { name: 'sha', type: true, component: selectComponent, subname: ['sha1', 'sha224', 'sha256', 'sha384', 'sha512'] },
  { name: 'base64', type: false },
  { name: 'unbase64', type: false },
  { name: 'concat', type: true, component: inputComponent },
  { name: 'lconcat', type: true, component: inputComponent },
  { name: 'upper', type: false }

]

const MethodsListSource = (props) => {
  // console.log("disabled",props.disabled);
  return <div>
    {props.component && <props.component disabled={props.disabled} paramsInput={props.paramsInput} index={props.paramsIndex} />}
  </div>
}


MethodsListSource.propTypes = {
  component: PropTypes.any,
  paramsInput: PropTypes.func,
  paramsIndex: PropTypes.number,
  disabled: PropTypes.bool

}

class MethodsList extends Component {
  static propTypes = {
    show: PropTypes.bool,
    click: PropTypes.func,
    clickValue: PropTypes.string,
    paramsInput: PropTypes.func,
    clickIndex: PropTypes.number
  }

  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      list: METHODS_LIST.slice(0, 4),
      moreFlag: true
    }
  }




  showMore = () => {
    this.setState({
      list: METHODS_LIST,
      moreFlag: false
    })

  }

  // handleSelectMethod = (methodName)=>{
  //   return ()=>{

  //   }
  // }


  // unshowMore = () => {
  //   this.setState({
  //     list: METHODS_LIST.slice(0, 4),
  //     moreFlag: true
  //   })
  // }

  render() {
    const { list, moreFlag } = this.state;
    const { click, paramsInput, clickValue, clickIndex } = this.props;
    console.log('click', clickValue);

    return (
      <div className="modal-postman-form-method">
        <h3 className="methods-title title">方法</h3>
        <RadioGroup onChange={click} value={clickValue}>
          {
            list.map((item, index) => {
              return <Row key={index} type="flex" align="middle" className="row methods-row">
                <RadioButton value={item.name}>
                  <span>{item.name}</span>
                  <span className="input-component">
                    {item.type &&
                      <MethodsListSource
                        disabled={item.name === clickValue}
                        paramsInput={paramsInput}
                        component={item.component}
                        paramsIndex={clickIndex} />
                    }
                  </span>
                </RadioButton>

              </Row>
            })
          }
        </RadioGroup>
        {
          moreFlag && <div className="show-more" onClick={this.showMore}><Icon type="down" /><span style={{ paddingLeft: '4px' }}>更多</span></div>
        }

      </div>
    )

  }

}

export default MethodsList;