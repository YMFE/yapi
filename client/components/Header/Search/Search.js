import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Input, AutoComplete, Tooltip } from 'antd';
import _ from 'underscore';
import './Search.scss';
import { withRouter } from 'react-router';
import axios from 'axios';
import { setCurrGroup, fetchGroupMsg } from '../../../reducer/modules/group';
import { changeMenuItem } from '../../../reducer/modules/menu';

import { fetchInterfaceListMenu } from '../../../reducer/modules/interface';
const Option = AutoComplete.Option;

@connect(
  state => ({
    groupList: state.group.groupList,
    projectList: state.project.projectList
  }),
  {
    setCurrGroup,
    changeMenuItem,
    fetchGroupMsg,
    fetchInterfaceListMenu
  }
)
@withRouter
export default class Srch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    };
    this.handleSearch = _.debounce(this.handleSearch, 500);
  }

  static propTypes = {
    groupList: PropTypes.array,
    projectList: PropTypes.array,
    router: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    setCurrGroup: PropTypes.func,
    changeMenuItem: PropTypes.func,
    fetchInterfaceListMenu: PropTypes.func,
    fetchGroupMsg: PropTypes.func
  };

  onSelect = async (value, option) => {
    // console.log("option.props.type:"+option.props.type);
    if (option.props.type === '分组') {
      this.props.changeMenuItem('/group');
      this.props.history.push('/group/' + option.props['id']);
      this.props.setCurrGroup({ group_name: value, _id: option.props['id'] - 0 });
    } else if (option.props.type === '项目') {
      await this.props.fetchGroupMsg(option.props['groupId']);
      this.props.history.push('/project/' + option.props['id']);
    } else if (option.props.type === '接口') {
      await this.props.fetchInterfaceListMenu(option.props['projectId']);
      this.props.history.push(
        '/project/' + option.props['projectId'] + '/interface/api/' + option.props['id']
      );
    } else if (option.props.type === '路径') {
      await this.props.fetchInterfaceListMenu(option.props['projectId']);
      this.props.history.push('/project/' + option.props['projectId'] + '/interface/api/' + option.props['id']);
    }
  };

  handleSearch = value => {
    axios
      .get('/api/project/search?q=' + value)
      .then(res => {
        if (res.data && res.data.errcode === 0) {
          const dataSource = [];
          for (let title in res.data.data) {
            res.data.data[title].map(item => {
              switch (title) {
                case 'group':
                  dataSource.push(
                    <Option
                      key={`分组${item._id}`}
                      type="分组"
                      id={`${item._id}`}
                      text={`分组: ${item.groupName}`}
                    >
                      <Tooltip placement="left" title={`分组: ${item.groupName}`}>
                        {`分组: ${item.groupName}`}
                      </Tooltip>
                    </Option>
                  );
                  break;
                case 'project':
                  dataSource.push(
                    <Option
                      key={`项目${item._id}`}
                      type="项目"
                      id={`${item._id}`}
                      groupId={`${item.groupId}`}
                      text={`项目: ${item.name}`}
                    >
                      <Tooltip placement="left" title={`项目: ${item.name}`}>
                        {`项目: ${item.name}`}
                      </Tooltip>
                    </Option>
                  );
                  break;
                case 'interface':
                  dataSource.push(
                    <Option
                      key={`接口${item._id}`}
                      type="接口"
                      id={`${item._id}`}
                      projectId={`${item.projectId}`}
                      text={`接口: ${item.title}`}
                    >
                      <Tooltip placement="left" title={`接口: ${item.title}`}>
                        {`接口: ${item.title}`}
                      </Tooltip>
                    </Option>
                  );
                  break;
                case 'interface2':
                  dataSource.push(
                    <Option
                      key={`路径${item._id}`}
                      type="路径"
                      id={`${item._id}`}
                      projectId={`${item.projectId}`}
                      text={`路径: ${item.path}`}
                    >
                      <Tooltip placement="left" title={`路径: ${item.path}`}>
                        {`路径: ${item.path}`}
                      </Tooltip>
                    </Option>
                  );
                  break;
                default:
                  break;
              }
            });
          }
          this.setState({
            dataSource: dataSource
          });
        } else {
          console.log('查询项目或分组失败');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // getDataSource(groupList){
  //   const groupArr =[];
  //   groupList.forEach(item =>{
  //     groupArr.push("group: "+ item["group_name"]);
  //   })
  //   return groupArr;
  // }

  render() {
    const { dataSource } = this.state;

    return (
      <div className="search-wrapper">
        <AutoComplete
          className="search-dropdown"
          dataSource={dataSource}
          style={{ width: '100%' }}
          defaultActiveFirstOption={false}
          onSelect={this.onSelect}
          onSearch={this.handleSearch}
          optionLabelProp="text"
          filterOption={(inputValue, option) => {
            if (typeof option.props.children !== 'string' ) {
              return option.props.children.props.title.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
            }
              return option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          }
        >
          <Input
            prefix={<Icon type="search" className="srch-icon" />}
            placeholder="搜索分组/项目/接口/路径"
            className="search-input"
          />
        </AutoComplete>
      </div>
    );
  }
}
