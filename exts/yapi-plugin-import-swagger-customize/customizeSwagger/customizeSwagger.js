import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Radio, Select, Input, message } from 'antd';
import axios from 'axios';
import './customizeSwagger.scss';

const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(
  state => {
    return {
      projectMsg: state.project.currProject
    };
  },
  {}
)
export default class ProjectInterfaceSync extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 项目所有接口list
      interfaceList: [],
      // 导入接口的方式
      importType: 'add',
      // 项目的swagger json地址
      swaggerUrl: '',
      // 新增或更新接口arr
      interfaceName: []
    };
  }
   
  static propTypes = {
    projectId: PropTypes.number,
    handleSwaggerUrlData: PropTypes.func,
    projectMsg: PropTypes.object,
    swaggerUrlData: PropTypes.string
  };

  componentDidMount() {
    axios.get(`/api/interface/list_menu?project_id=${this.props.projectId}`).then(res => {
      if (res.data.errcode === 0) {
        let interfaceList = [];
        res.data.data.forEach(controller => {
          controller.list.forEach(item => {
            interfaceList.push(item.path)
          })
        });
        this.setState({
          interfaceList
        });
      }
    });
  }

  importTypeChange = e => {
    this.setState({
      importType: e.target.value
    });
  };

  swaggerUrlInput = e => {
    this.setState({
      swaggerUrl: String(e.target.value).trim()
    });
  };

  interfaceNameInput = e => {
    this.setState({
      interfaceName: [e.target.value]
    });
  };

  interfaceSelect = value => {
    this.setState({
      interfaceName: value
    });
  };

  importData = async () => {
    const { importType, swaggerUrl, interfaceName } = this.state
    const { projectId, projectMsg } = this.props 
    
    if (!swaggerUrl) {
      return message.error('swagger url 不能为空!');
    }
    const params = {
      importType,
      projectId,
      cat: projectMsg.cat,
      interfaceName,
      swaggerUrl
    }
    await axios.post('/api/plugin/customizeSwagger/updateData', params).then(res => {
      if (res.data.errcode === 0) {
        message.success(res.data.errmsg);
      } else {
        message.error(res.data.errmsg);
      }
    });
  };

  render() {
    const { importType, interfaceList } = this.state
    return (
      <div className="appiont-swagger-data">
        <div className="card">
          <h3>swagger接口自定义导入</h3>
          <RadioGroup onChange={this.importTypeChange} value={importType}>
            <Radio value="add">添加接口</Radio>
            <Radio value="update">更新接口</Radio>
          </RadioGroup>
          <div className="label">项目的swagger json地址:</div>
          <Input
            placeholder="http://demo.swagger.io/v2/swagger.json"
            onChange={this.swaggerUrlInput}
          />
          <div className="label">接口名称：</div>
          {importType === 'add' ? (
            <Input
              placeholder="/api/interface/add"
              onChange={this.interfaceNameInput}
            /> 
          ) : (
            <Select
              className="select"
              mode="multiple"
              onChange={this.interfaceSelect}
              placeholder="/api/interface/add"
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {interfaceList.map((item, key) => <Option key={key} value={item}>{item}</Option>)}
            </Select>
          )}
          <Button className="button" type="primary" onClick={this.importData}>导入</Button>
        </div>
      </div>
    );
  }
}
