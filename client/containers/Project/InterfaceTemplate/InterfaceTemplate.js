import './InterfaceTemplate.scss'
import React, { PureComponent as Component } from 'react'
import TemplateList from './templateList'
import CreateTemplate from './createTemplate'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Button, Drawer, message, Input } from 'antd'

class InterfaceTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      visible: false,
      templateItem: {},
      isEdit: 1
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
    let result = await axios.get(`/api/interface_template/list?project_id=${this.props.match.params.id}`)
    if (result.data.errcode == 0) {
      this.setState({ list: result.data.data })
    } else {
      return message.error(result.data.errmsg)
    }
  }
  newTemplate = () => {
    this.onOk()
    this.setState({templateItem: {}, isEdit: 0})
  }
  editTemplate = (record) => {
    this.onOk()
    this.setState({ templateItem: record, isEdit: 1 })
  }
  deleteTemplate = async (record) => {
    let result = await axios.get(`/api/interface_template/del?id=${record._id}`)
    if (result.data.errcode == 0) {
      this.getList()
      return message.success(result.data.errmsg)
    } else {
      return message.error(result.data.errmsg)
    }
  }
  handleSearch = async (e) => {
    let result = await axios.get(`/api/interface_template/search?key=${e.target.value}`)
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
              placeholder="搜索模版"
              onChange={this.handleSearch}
              className="search-input"
            />
            <Button className="ant-btn-primary create-btn" onClick={this.newTemplate}>新增模版</Button>
          </div>
          <TemplateList 
            list={list}
            editTemplate={this.editTemplate}
            deleteTemplate={this.deleteTemplate}
          />
          <Drawer
            title="模版操作"
            placement="right"
            closable={true}
            onClose={this.onCancel}
            visible={this.state.visible}
            maskClosable={false}
            width={'60%'}
            destroyOnClose={true}
          >
            <CreateTemplate 
              projectId={this.props.match.params.id}
              onCancel={this.onCancel}
              getList={this.getList}
              templateItem={this.state.templateItem}
              isEdit={this.state.isEdit}
            />
          </Drawer>
        </section>
      </div>
    )
  }
}

export default InterfaceTemplate
