import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Radio, Icon, Input, Select } from 'antd';
import common from 'common/power-string.js'
const Option = Select.Option;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


// const list = METHODS_LIST.slice(0,4);
const inputComponent = () => {
  return <Input size="small" placeholder="small size" />
}

const selectComponent = (value) => {
  // console.log('props', props);
  // const subname = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512'];
  return <Select defaultValue="sha1" style={{ width: 150 }} size="small" >
    {
      value.map((item, index) => {
        return <Option value={item} key={index}>{item}</Option>
      })
    }
  </Select>
}

const METHODS_LIST = [
  { name: 'md5', type: false },
  { name: 'lower', type: false },
  { name: 'length', type: false },
  { name: 'substr', type: true },
  { name: 'sha', type: true, component: selectComponent(['sha1', 'sha224', 'sha256', 'sha384', 'sha512']), subname: ['sha1', 'sha224', 'sha256', 'sha384', 'sha512'] },
  { name: 'base64', type: false },
  { name: 'unbase64', type: false },
  { name: 'concat', type: true, component: inputComponent() },
  { name: 'lconcat', type: true, component: inputComponent() },
  { name: 'upper', type: false }

]


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
    if (this.props.show !== nextProps.show) {
      this.unshowMore();
    }
  }



  showMore = () => {
    this.setState({
      list: METHODS_LIST,
      moreFlag: false
    })

  }


  unshowMore = () => {
    this.setState({
      list: METHODS_LIST.slice(0, 4),
      moreFlag: true
    })
  }

  render() {
    const { list, moreFlag } = this.state;
    const { click } = this.props;
    return (
      <div className="modal-postman-form-method">
        <h3 className="methods-title title">方法</h3>
        <RadioGroup onChange={click}>
          {
            list.map((item, index) => {
              return <Row key={index} type="flex" align="middle" className="row methods-row" >
                <RadioButton value={item.name}>
                  <span>{item.name}</span>
                  <span className="input-component">
                    {item.type && item.component}
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