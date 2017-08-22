import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { fetchInterfaceColList, fetchInterfaceCaseList, setColData } from '../../../../reducer/modules/interfaceCol'
import { autobind } from 'core-decorators';
import axios from 'axios';
import { Input, Icon, Tag, Modal, message, Tooltip, Tree, Dropdown, Menu, Form } from 'antd';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

import './InterfaceColMenu.scss'

const ColModalForm = Form.create()((props) => {
  const { visible, onCancel, onCreate, form, title } = props;
  const { getFieldDecorator } = form;
  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={onCancel}
      onOk={onCreate}
    >
      <Form layout="vertical">
        <FormItem label="集合名">
          {getFieldDecorator('colName', {
            rules: [{ required: true, message: '请输入集合命名！' }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="简介">
          {getFieldDecorator('colDesc')(<Input type="textarea" />)}
        </FormItem>
      </Form>
    </Modal>
  )
});

@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currColId: state.interfaceCol.currColId,
      currCaseId: state.interfaceCol.currCaseId,
      isShowCol: state.interfaceCol.isShowCol
    }
  },
  {
    fetchInterfaceColList,
    fetchInterfaceCaseList,
    setColData
  }
)
@withRouter
export default class InterfaceColMenu extends Component {

  static propTypes = {
    match: PropTypes.object,
    interfaceColList: PropTypes.array,
    fetchInterfaceColList: PropTypes.func,
    fetchInterfaceCaseList: PropTypes.func,
    setColData: PropTypes.func,
    history: PropTypes.object,
    currColId: PropTypes.number,
    currCaseId: PropTypes.number,
    isShowCol: PropTypes.bool
  }

  state = {
    expandedKeys: [],
    colModalType: '',
    colModalVisible: false,
    editColId: 0
  }

  constructor(props) {
    super(props)
  }

  async componentWillMount() {
    const { isShowCol, currColId, currCaseId } = this.props;
    const action = isShowCol ? 'col' : 'case';
    const actionId = isShowCol ? currColId : currCaseId;
    this.setState({expandedKeys: [action+'_'+actionId]})
  }

  async componentWillReceiveProps(nextProps) {
    const { currColId } = nextProps;
    let expandedKeys = this.state.expandedKeys;
    if (expandedKeys.indexOf('col_'+currColId) === -1) {
      expandedKeys = expandedKeys.concat(['col_'+currColId])
    }
    this.setState({expandedKeys})
  }

  @autobind
  async addorEditCol() {
    const { colName: name, colDesc: desc } = this.form.getFieldsValue();
    const { colModalType, editColId: col_id } = this.state;
    const project_id = this.props.match.params.id;
    let res = {};
    if (colModalType === 'add') {
      res = await axios.post('/api/col/add_col', { name, desc, project_id })
    } else if (colModalType === 'edit') {
      res = await axios.post('/api/col/up_col', { name, desc, col_id })
    }
    if (!res.data.errcode) {
      this.setState({
        colModalVisible: false
      });
      message.success(colModalType === 'edit' ? '修改集合成功' : '添加集合成功');
      await this.props.fetchInterfaceColList(project_id);
    } else {
      message.error(res.data.errmsg);
    }
  }

  onExpand = (keys) => {
    this.setState({expandedKeys: keys})
  }

  onSelect = (keys) => {
    if (keys.length) {
      const type = keys[0].split('_')[0];
      const id = keys[0].split('_')[1];
      const project_id = this.props.match.params.id
      if (type === 'col') {
        this.props.setColData({
          isShowCol: true,
          currColId: +id
        })
        this.props.history.push('/project/' + project_id + '/interface/col/' + id)
      } else {
        this.props.setColData({
          isShowCol: false,
          currCaseId: +id
        })
        this.props.history.push('/project/' + project_id + '/interface/case/' + id)
      }
    }
  }
  showColModal = (type, col) => {
    const editCol = type === 'edit' ? {colName: col.name, colDesc: col.desc} : {colName: '', colDesc: ''};
    this.setState({
      colModalVisible: true,
      colModalType: type || 'add',
      editColId: col._id
    })
    this.form.setFieldsValue(editCol)
  }
  saveFormRef = (form) => {
    this.form = form;
  }

  render() {
    const { currColId, currCaseId, isShowCol } = this.props;
    const { colModalType, colModalVisible } = this.state;

    const menu = (col) => {
      return (
        <Menu>
          <Menu.Item>
            <span onClick={() => this.showColModal('edit', col)}>修改集合</span>
          </Menu.Item>
          <Menu.Item>
            <span onClick={() => {
              this.showDelColConfirm(col._id)
            }}>删除集合</span>
          </Menu.Item>
        </Menu>
      )
    };

    return (
      <div>
        <div className="interface-filter">
          <Input placeholder="Filter by name" style={{ width: "70%" }} />
          <Tooltip placement="bottom" title="添加集合">
            <Tag color="#108ee9" style={{ marginLeft: "15px" }} onClick={() => this.showColModal('add')} ><Icon type="plus" /></Tag>
          </Tooltip>
        </div>
        <Tree
          className="col-list-tree"
          expandedKeys={this.state.expandedKeys}
          selectedKeys={[isShowCol ? 'col_'+currColId : 'case_'+currCaseId]}
          onSelect={this.onSelect}
          autoExpandParent
          onExpand={this.onExpand}
        >
          {
            this.props.interfaceColList.map((col) => (
              <TreeNode
                key={'col_' + col._id}
                title={
                  <div className="menu-title">
                    <span><Icon type="folder-open" style={{marginRight: 5}} /><span>{col.name}</span></span>
                    <Dropdown overlay={menu(col)}>
                      <Icon type='bars'/>
                    </Dropdown>
                  </div>
                }
              >
                {
                  col.caseList && col.caseList.map((interfaceCase) => (
                    <TreeNode
                      style={{width: '100%'}}
                      key={'case_' + interfaceCase._id}
                      title={
                        <div className="menu-title">
                          <span>{interfaceCase.casename}</span>
                          <Icon type='delete' className="case-delete-icon" onClick={() => { this.showConfirm(interfaceCase._id) }} />
                        </div>
                      }
                    ></TreeNode>
                  ))
                }
              </TreeNode>
            ))
          }
        </Tree>
        <ColModalForm
          ref={this.saveFormRef}
          type={colModalType}
          visible={colModalVisible}
          onCancel={() => { this.setState({ colModalVisible: false }) }}
          onCreate={this.addorEditCol}
        ></ColModalForm>
      </div>
    )
  }
}
