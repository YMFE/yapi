import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import {Table, Select} from 'antd';
import { connect } from 'react-redux';
const Option = Select.Option;
import axios from 'axios';

@connect(
  state => {
    return {
      projectList: state.project.projectList,
      interfaceColList: state.interfaceCol.interfaceColList,
      list: state.inter.list
    };
  }
)
export default class MoveCase extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    project: this.props.currProjectId,

    list1: [],
    selectProject: {
      key : 99,
      label : "嗨！又要重构优化了？"
    },
    moveToColId: 0
  };

  static propTypes = {
    interfaceColList: PropTypes.array,
    projectList: PropTypes.array,
    currProjectId: PropTypes.number,
    movecallback: PropTypes.func
  };

  // 切换项目
  onChange = async val => {
    this.setState({
      project: val.key
    });
    let result = await axios.get('/api/col/list?project_id=' + val.key);
    this.setState({
      selectProject : val,
      list1 : result.data.data
    });
  //  await this.props.fetchInterfaceListMenu(val);
  };

  render() {
    const {  projectList } = this.props;
    const data = this.state.list1.map(item => {
      console.log(item);
      return {
        key: 'category_' + item._id,
        title: item.name,
        isCategory: true,
        _id: item._id
      };
    });
    const rowRadioSelection = {
      type:'radio',
      onSelect: (record) => {
        console.log(record)
        this.setState({
          moveToColId: record._id
        }, () => {
          const {  moveToColId } = this.state
          this.props.movecallback(moveToColId);
        });



      }
    };

    const columns = [
      {
        title: '用例集合',
        dataIndex: 'title',
        width: '100%'
      }
    ];

    return (
      <div>
        <div className="select-project">
          <span>选择移动到哪个项目： </span>
          <Select value={this.state.selectProject} labelInValue style={{ width: 200 }} onChange={this.onChange}>
            {projectList.map(item => {
              console.log(item);
              console.log("项目："+this.state.project + "this.state.currProjectId:" + this.props.currProjectId +"item._id " + item._id + (item._id == this.props.currProjectId));
              if (item._id != this.props.currProjectId) {
                return (
                  <Option value={`${item._id}`} key={item._id}>
                    {item.name}
                  </Option>
                );
              }else {
                return '';
              }
            })}
          </Select>
        </div>
        <Table columns={columns} rowSelection={rowRadioSelection} dataSource={data} pagination={false} />
      </div>
    );
  }
}
