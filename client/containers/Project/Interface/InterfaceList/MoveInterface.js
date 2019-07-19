import React, {PureComponent as Component} from 'react';
import PropTypes from 'prop-types';
import {Select, Table} from 'antd';
import {connect} from 'react-redux';
import axios from 'axios';

const Option = Select.Option;

@connect(
  state => {
    return {
      projectList: state.project.projectList,
      list: state.inter.list
    };
  }
)
export default class MoveInterface extends Component {
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
    moveToProjectId: 0,
    moveToCatId: 0
  };

  static propTypes = {
    projectList: PropTypes.array,
    currProjectId: PropTypes.number,
    movecallback: PropTypes.func
  };

  // 切换项目
  onChange = async val => {
    this.setState({
      project: val.key
    });
    let result = await axios.get('/api/interface/list_menu?project_id=' + val.key);
    this.setState({
      selectProject : val,
      list1 : result.data.data,
      moveToProjectId : val.key
    });
  //  await this.props.fetchInterfaceListMenu(val);
  };
  reinit = data => {
    let reinitdata = data => {
      return data.map(item => {
          let node = {
            key: 'category_' + item._id,
            title: item.name,
            isCategory: true,
            _id: item._id
          };
          if (item.children) {
            node.children = reinitdata(item.children);
          }
          return node;
        }
      )
    }
    return reinitdata(data);
  }


  render() {

    const {  projectList } = this.props;
    const data = this.reinit(this.state.list1);
    const rowRadioSelection = {
      type:'radio',
      onSelect: (record) => {
        console.log(record)
        this.setState({
          moveToCatId: record._id
        }, () => {
          const { moveToProjectId, moveToCatId } = this.state
          this.props.movecallback(moveToProjectId,moveToCatId);
        });



      }
    };

    const columns = [
      {
        title: '接口分类',
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
