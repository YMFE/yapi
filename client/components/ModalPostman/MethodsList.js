import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Input, Radio, Icon } from 'antd';
import common from 'common/power-string.js'
import { autobind } from 'core-decorators';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Search = Input.Search;

const METHODS_LIST = [
  { name: 'md5', type: false },
  { name: 'lower', type: false },
  { name: 'length', type: false },
  { name: 'substr', type: true },
  { name: 'sha', type: false, subname: ['sha1', 'sha224', 'sha256', 'sha384', 'sha512'] },
  { name: 'base64', type: false },
  { name: 'unbase64', type: false },
  { name: 'concat', type: true },
  { name: 'lconcat', type: true },
  { name: 'upper', type: false }

]

// const list = METHODS_LIST.slice(0,4);


class MethodsList extends Component {
  static propTypes = {
    show: PropTypes.bool,
    click: PropTypes.func,
    clickValue: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      list: METHODS_LIST.slice(0, 4),
      moreFlag: true
    }

  }

  componentDidMount() {
    console.log('common', common);
  }

  componentWillReceiveProps(nextProps) {
    // console.log("nextProps",nextProps);
    if(this.props.show !==nextProps.show){
      this.unshowMore();
    }
  }

  @autobind
  onFilter() {


  }

  
  @autobind
  showMore() {
    this.setState({
      list: METHODS_LIST,
      moreFlag: false
    })

  }

  @autobind
  unshowMore() {
    this.setState({
      list: METHODS_LIST.slice(0, 4),
      moreFlag: true
    })
  }

  render() {
    const { list, moreFlag } = this.state;
    const {click, clickValue} =  this.props;
    return (
      <div className="modal-postman-form-method">
        <h3 className="methods-title title">方法</h3>
        <RadioGroup onChange={click} value={clickValue}>
          {
            list.map((item, index) => {
              return <Row key={index} type="flex" align="middle" className="row methods-row" >
                <RadioButton value={item.name}>{item.name}</RadioButton>
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