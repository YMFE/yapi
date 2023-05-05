import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { message, Button, Input, Popconfirm, Table, Modal, Form } from 'antd'
import {
  fetchInterfaceChainList,
  addInterfaceChain,
  updateInterfaceChain,
  removeInterfaceChain,
} from '../../../../reducer/modules/interface.js'
import UsernameAutoComplete from '../../../../components/UsernameAutoComplete/UsernameAutoComplete.js'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    lg: { span: 3 },
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    lg: { span: 20 },
    xs: { span: 24 },
    sm: { span: 14 },
  },
  className: 'form-item',
}
class chainForm extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    form: PropTypes.object,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
  }
  componentDidMount() {
    this.props.form.setFieldsValue({
      manager: ['51'],
    })
  }

  onSubmit = e => {
    e.preventDefault()
    const form = this.props.form
    form.validateFields((err, val) => {
      if (!err) {
        this.props.onSubmit(val)
      }
    })
  }

  onUserSelect = (user, info) => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({
      manager: info,
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.onSubmit}>
        <FormItem {...formItemLayout} label="项目名">
          {getFieldDecorator('proj_info', {
            rules: [
              {
                required: true,
                message: '请输入项目名',
              },
            ],
          })(<Input placeholder="请输入下游项目名" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="接口名">
          {getFieldDecorator('api_info', {
            rules: [
              {
                required: true,
                message: '请输入项目名',
              },
            ],
          })(<Input placeholder="请输入下游接口名" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="管理员">
          {getFieldDecorator('manager', {
            rules: [
              {
                required: true,
                message: '请选择接口变更接收通知的管理员',
              },
            ],
            initialValue: ['51'],
          })(<UsernameAutoComplete callbackState={this.onUserSelect} />)}
        </FormItem>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button htmlType="submit" type="primary">
            确认
          </Button>
          <Button type="default" onClick={() => this.props.onCancel()}>
            取消
          </Button>
        </div>
      </Form>
    )
  }
}

const ChainForm = Form.create()(chainForm)

@connect(
  state => ({
    list: state.inter.chainList,
  }),
  {
    fetchInterfaceChainList,
  },
)
export default class EditInterfaceChain extends Component {
  static propTypes = {
    list: PropTypes.array,
    interId: PropTypes.string,
    fetchInterfaceChainList: PropTypes.func,
    addInterfaceChain: PropTypes.func,
    updateInterfaceChain: PropTypes.func,
    removeInterfaceChain: PropTypes.func,
  }
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }
  componentDidMount() {
    this.loadChainList()
  }

  onShowModal() {
    this.setState({
      visible: true,
    })
  }

  onHideModal = () => {
    this.setState({
      visible: false,
    })
  }

  loadChainList = () => {
    const { interId } = this.props
    this.props.fetchInterfaceChainList({
      id: interId,
    })
  }

  removeChain = async id => {

    let res = await removeInterfaceChain({ id })
    if (res.data.errcode === 0) {
      message.success('删除成功')
      this.loadChainList()
    } else {
      message.error(res.data.errmsg)
    }
  }

  addChain = async data => {
    const { interId } = this.props

    let res = await addInterfaceChain({
      ...data,
      interface_id: interId,
    })
    if (res.data.errcode === 0) {
      message.success('创建成功')
      this.onHideModal()
      this.loadChainList()
    } else {
      message.error(res.data.errmsg)
    }
  }

  updateChain = () => {}

  render() {
    let { visible } = this.state
    let { list } = this.props
    let columns = [
      {
        title: '服务名称',
        dataIndex: 'proj_info',
      },
      {
        title: '接口名称',
        dataIndex: 'api_info',
      },
      {
        title: '管理员',
        dataIndex: 'manager',
        render: (text, record) => {
          return record.manager.map((item, idx) => item.email).join(', ')
        },
      },
      {
        title: '操作',
        dataIndex: '_id',
        render: (text, record, index) => {
          return (
            <Popconfirm
              placement="topLeft"
              title="删除后无法恢复，确认删除？"
              onConfirm={() => this.removeChain(record._id)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="danger">删除</Button>
            </Popconfirm>
          )
        },
      },
    ]
    return (
      <div>
        <Button
          type="primary"
          style={{ marginBottom: '10px' }}
          onClick={() => this.onShowModal()}
        >
          新增下游接口
        </Button>
        <Table rowKey="_id" columns={columns} dataSource={list}></Table>
        <Modal
          title="新增下游"
          onCancel={() => this.onHideModal()}
          destroyOnClose
          visible={visible}
          footer={null}
          width={600}
        >
          <ChainForm onCancel={this.onHideModal} onSubmit={this.addChain} />
        </Modal>
      </div>
    )
  }
}
