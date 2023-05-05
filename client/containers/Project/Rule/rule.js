import './rule.scss'
import React, { PureComponent as Component } from 'react'
import List from './list'
import CreateRules from './create_rule.js'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Button, Drawer, message, Input } from 'antd'

class Interfacerule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      visible: false,
      ruleItem: {},
      isEdit: true
    }
  }
  static propTypes = {
    match: PropTypes.object
  };
  UNSAFE_componentWillMount() {
    this.getList()
  }
  onCancel = () => {
    this.setState({ visible: false })
  }
  onOk = () => {
    this.setState({ visible: true })
  }
  getList = async() => {
    let result = await axios.get(`/api/rule/list?project_id=${this.props.match.params.id}`)
    if (result.data.errcode == 0) {
      this.setState({ list: result.data.data })
    } else {
      return message.error(result.data.errmsg)
    }
  }
  newrule = () => {
    this.onOk()
    this.setState({ruleItem: {}, isEdit: false})
  }
  editrule = (record) => {
    this.onOk()
    this.setState({ ruleItem: record, isEdit: true })
  }
  deleterule = async (record) => {
    const param = {
      id: record._id
    }
    let result = await axios.post(`/api/rule/del?`, param)
    if (result.data.errcode == 0) {
      this.getList()
      return message.success(result.data.errmsg)
    } else {
      return message.error(result.data.errmsg)
    }
  }
  handleSearch = async (e) => {
    let result = await axios.get(`/api/rule/search?key=${e.target.value}`)
    if (result.data.errcode == 0) {
      this.setState({list: result.data.data})
    }
  }
  render() {
    const { list } = this.state
    return (
      <div className="g-row">
        <section className="news-box m-panel">
          <div className="search-box">
            <Input
              type="search"
              placeholder="搜索规则"
              onChange={this.handleSearch}
              className="search-input"
            />
            <Button className="ant-btn-primary create-btn" onClick={this.newrule}>新增规则</Button>
          </div>
          <List 
            list={list}
            editrule={this.editrule}
            deleterule={this.deleterule}
          />
          <Drawer
            title="规则操作"
            placement="right"
            closable={true}
            onClose={this.onCancel}
            visible={this.state.visible}
            maskClosable={false}
            width={'60%'}
            destroyOnClose={true}
          >
            <CreateRules
              projectId={this.props.match.params.id}
              onCancel={this.onCancel}
              getList={this.getList}
              ruleItem={this.state.ruleItem}
              isEdit={this.state.isEdit}
            /> 
          </Drawer>
        </section>
      </div>
    )
  }
}

export default Interfacerule
