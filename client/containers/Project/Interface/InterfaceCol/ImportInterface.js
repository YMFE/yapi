import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Select, Tooltip, Icon } from 'antd';
import variable from '../../../../constants/variable';
import { connect } from 'react-redux';
const Option = Select.Option;
import { fetchInterfaceListMenu } from '../../../../reducer/modules/interface.js';

@connect(
  state => {
    return {
      projectList: state.project.projectList,
      list: state.inter.list
    };
  },
  {
    fetchInterfaceListMenu
  }
)
export default class ImportInterface extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    selectedRowKeys: [],
    categoryCount: {},
    project: this.props.currProjectId,
    list: []
  };

  static propTypes = {
    list: PropTypes.array,
    selectInterface: PropTypes.func,
    projectList: PropTypes.array,
    currProjectId: PropTypes.string,
    fetchInterfaceListMenu: PropTypes.func
  };

  async componentDidMount() {
    const r = await this.props.fetchInterfaceListMenu(this.props.currProjectId);
    this.setState({
      list: r.payload.data.data
    })
  }

  // 切换项目
  onChange = async val => {
    this.setState({
      project: val,
      selectedRowKeys: [],
      categoryCount: {}
    });
    const r = await this.props.fetchInterfaceListMenu(val);
    this.setState({
      list: r.payload.data.data
    })
  };

  // 点击展开图标
  onExpandCat = async(expanded, record, list) => {
    if (expanded && !record.ischild) {
    // const parentCatId = record.key.slice(9) ;
    const parentCatId = record._id || record.key.slice(9) ;
    let newList = list ? list : this.state.list;
    // 展开一级目录递归展开下一级目录
    const result = await this.props.fetchInterfaceListMenu(this.state.project, Number(parentCatId));
    const childList = result.payload.data.data;
    for(let i = 0; i < newList.length; i++) {
      if(newList[i]._id === Number(parentCatId)) {
        newList[i].children = childList;
        for(let j = 0; j < childList.length; j++) {
          childList[j].isChild = true;
          childList[j].categoryKey = 'category_' + childList[j].parent_id;
          childList[j].title = childList[j].name;
          if(childList[j].children) {
            childList[j].isCategory = true;
            childList[j].categoryLength = childList.length;
            this.onExpandCat(true, childList[j], childList);
            childList[j].key = "category_" + childList[j]._id;
          } else {
            childList[j].key = childList[j]._id;
          }
        }
      }
    }
    }
    this.setState({
      list: this.state.list
    })
  };

  render() {
    const { projectList } = this.props;
    const list = this.state.list;
    // const { selectedRowKeys } = this.state;
    const data = list.map(item => {
      return {
        key: 'category_' + item._id,
        title: item.name,
        isCategory: true,
        children: item.children
          ? item.children.map(e => {
              e.key = e.children ? "category_" + e._id : e._id;
              e.title = e.name;
              if(e.child_type === 0) {
                e.isCategory = true;
              }
              e.categoryKey = 'category_' + item._id;
              e.categoryLength = item.children.length;
              return e;
            })
          : []
      };
    });
    const self = this;
    const rowSelection = {
      // onChange: (selectedRowKeys) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // if (selectedRows.isCategory) {
      //   const selectedRowKeys = selectedRows.children.map(item => item._id)
      //   this.setState({ selectedRowKeys })
      // }
      // this.props.onChange(selectedRowKeys.filter(id => ('' + id).indexOf('category') === -1));
      // },
      onSelect: (record, selected) => {
        const oldSelecteds = self.state.selectedRowKeys;
        const categoryCount = self.state.categoryCount;
        const categoryKey = record.categoryKey;
        const categoryLength = record.categoryLength;
        let selectedRowKeys = [];
        if (record.isCategory) {
          // selectedRowKeys = record.children.map(item => item._id).concat(record.key);
          selectedRowKeys = record.children.map(item => {
            return  item.children ? 'category_' + item._id : item._id;
          }).concat(record.key);
          if (selected) {
            selectedRowKeys = selectedRowKeys
              .filter(id => oldSelecteds.indexOf(id) === -1)
              .concat(oldSelecteds);
            categoryCount[categoryKey] = categoryLength;
          } else {
            selectedRowKeys = oldSelecteds.filter(id => selectedRowKeys.indexOf(id) === -1);
            categoryCount[categoryKey] = 0;
          }

        } else {

          if (selected) {
            selectedRowKeys = oldSelecteds.concat(record._id);
            if (categoryCount[categoryKey]) {
              categoryCount[categoryKey] += 1;
            } else {
              categoryCount[categoryKey] = 1;
            }
            if (categoryCount[categoryKey] === record.categoryLength) {
              selectedRowKeys.push(categoryKey);
            }
          } else {
            selectedRowKeys = oldSelecteds.filter(id => id !== record._id);
            if (categoryCount[categoryKey]) {
              categoryCount[categoryKey] -= 1;
            }
            selectedRowKeys = selectedRowKeys.filter(id => id !== categoryKey);
          }

        }

        self.setState({ selectedRowKeys, categoryCount });
        self.props.selectInterface(
          selectedRowKeys.filter(id => ('' + id).indexOf('category') === -1),
          self.state.project
        );
      },
      onSelectAll: selected => {
        let selectedRowKeys = [];
        let categoryCount = self.state.categoryCount;
        let selectChild = (data) => {
          data.forEach(item => {
            if (item.children) {
              categoryCount['category_' + item._id] = item.children.length;
              selectedRowKeys = selectedRowKeys.concat(item.children.map(item => {
                return  item.children ? 'category_' + item._id : item._id;
              }));
              selectChild(item.children)
            }
          });
        }
        if (selected) {
          selectChild(data);
          selectedRowKeys = selectedRowKeys.concat(data.map(item => item.key));
        } else {
          categoryCount = {};
          selectedRowKeys = [];
        }
        self.setState({ selectedRowKeys, categoryCount });
        self.props.selectInterface(
          selectedRowKeys.filter(id => ('' + id).indexOf('category') === -1),
          self.state.project
        );
      },
      selectedRowKeys: self.state.selectedRowKeys
    };

    const columns = [
      {
        title: '接口名称',
        dataIndex: 'title',
        width: '30%'
      },
      {
        title: '接口路径',
        dataIndex: 'path',
        width: '40%'
      },
      {
        title: '请求方法',
        dataIndex: 'method',
        render: item => {
          let methodColor = variable.METHOD_COLOR[item ? item.toLowerCase() : 'get'];
          return (
            <span
              style={{
                color: methodColor.color,
                backgroundColor: methodColor.bac,
                borderRadius: 4
              }}
              className="colValue"
            >
              {item}
            </span>
          );
        }
      },
      {
        title: (
          <span>
            状态{' '}
            <Tooltip title="筛选满足条件的接口集合">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        ),
        dataIndex: 'status',
        render: text => {
          return (
            text &&
            (text === 'done' ? (
              <span className="tag-status done">已完成</span>
            ) : (
              <span className="tag-status undone">未完成</span>
            ))
          );
        },
        filters: [
          {
            text: '已完成',
            value: 'done'
          },
          {
            text: '未完成',
            value: 'undone'
          }
        ],
        onFilter: (value, record) => {
          let arr = record.children.filter(item => {
            return item.status.indexOf(value) === 0;
          });
          return arr.length > 0;
          // record.status.indexOf(value) === 0
        }
      }
    ];

    return (
      <div>
        <div className="select-project">
          <span>选择要导入的项目： </span>
          <Select value={this.state.project} style={{ width: 200 }} onChange={this.onChange}>
            {projectList.map(item => {
              return item.projectname ? (
                ''
              ) : (
                <Option value={`${item._id}`} key={item._id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </div>
        <Table columns={columns} rowSelection={rowSelection} dataSource={data} onExpand={this.onExpandCat} pagination={false} />
      </div>
    );
  }
}
