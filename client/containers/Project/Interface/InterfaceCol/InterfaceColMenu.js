import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { fetchInterfaceColList, fetchInterfaceCaseList, setColData } from '../../../../reducer/modules/interfaceCol'
import { autobind } from 'core-decorators';
import axios from 'axios';
import { Input, Icon, Tag, Modal, Row, Col, message, Tooltip, Tree } from 'antd';

const TextArea = Input.TextArea;
const TreeNode = Tree.TreeNode;

import './InterfaceColMenu.scss'

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
    addColModalVisible: false,
    addColName: '',
    addColDesc: '',
    expandedKeys: []
  }

  constructor(props) {
    super(props)
  }

  // async componentWillMount() {
  //   const result = await this.props.fetchInterfaceColList(this.props.match.params.id)
  //   let params = this.props.match.params;
  //   if(!params.actionId){
  //     this.props.history.push('/project/'+params.id + '/interface/col/' + result.payload.data.data[0]._id)
  //   }
  // }

  // async componentWillReceiveProps(nextProps) {
  //   const result = await nextProps.fetchInterfaceColList(nextProps.match.params.id)
  //   let params = nextProps.match.params;
  //   if(!params.actionId){
  //     nextProps.history.replace('/project/'+params.id + '/interface/col/' + result.payload.data.data[0]._id)
  //   }
  // }

  @autobind
  async addCol() {
    const { addColName: name, addColDesc: desc } = this.state;
    const project_id = this.props.match.params.id
    const res = await axios.post('/api/col/add_col', { name, desc, project_id })
    if (!res.data.errcode) {
      this.setState({
        addColModalVisible: false
      });
      message.success('添加集合成功');
      await this.props.fetchInterfaceColList(project_id);
    } else {
      message.error(res.data.errmsg);
    }
  }

  onSelect = (keys) => {
    const type = keys[0].split('_')[0];
    const id = keys[0].split('_')[1];
    if (type === 'col') {
      this.props.setColData({
        isShowCol: true,
        currColId: +id
      })
    } else {
      this.props.setColData({
        isShowCol: false,
        currCaseId: +id
      })
    }
  }

  render() {
    const { currColId, currCaseId, isShowCol } = this.props;

    return (
      <div>
        <div className="interface-filter">
          <Input placeholder="Filter by name" style={{ width: "70%" }} />
          <Tooltip placement="bottom" title="添加集合">
            <Tag color="#108ee9" style={{ marginLeft: "15px" }} onClick={() => this.setState({addColModalVisible: true})} ><Icon type="plus" /></Tag>
          </Tooltip>
        </div>
        <Tree
          className="col-list-tree"
          expandedKeys={this.state.expandedKeys}
          selectedKeys={[isShowCol ? 'col_'+currColId : 'case_'+currCaseId]}
          onSelect={this.onSelect}
          autoExpandParent
          onExpand={keys => this.setState({expandedKeys: keys})}
        >
          {
            this.props.interfaceColList.map((col) => (
              <TreeNode
                key={'col_' + col._id}
                title={<span><Icon type="folder-open" style={{marginRight: 5}} /><span>{col.name}</span></span>}
              >
                {
                  col.caseList && col.caseList.map((interfaceCase) => (
                    <TreeNode
                      style={{width: '100%'}}
                      key={'case_' + interfaceCase._id}
                      title={interfaceCase.casename}
                    ></TreeNode>
                  ))
                }
              </TreeNode>
            ))
          }
        </Tree>
        <Modal
          title="添加集合"
          visible={this.state.addColModalVisible}
          onOk={this.addCol}
          onCancel={() => { this.setState({ addColModalVisible: false }) }}
          className="add-col-modal"
        >
          <Row gutter={6} className="modal-input">
            <Col span="5"><div className="label">集合名：</div></Col>
            <Col span="15">
              <Input
                placeholder="请输入集合名称"
                value={this.state.addColName}
                onChange={e => this.setState({addColName: e.target.value})}></Input>
            </Col>
          </Row>
          <Row gutter={6} className="modal-input">
            <Col span="5"><div className="label">简介：</div></Col>
            <Col span="15">
              <TextArea
                rows={3}
                placeholder="请输入集合描述"
                value={this.state.addColDesc}
                onChange={e => this.setState({addColDesc: e.target.value})}></TextArea>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}
