import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
import { Table } from 'antd'
import variable from '../../../../constants/variable';
// import { fetchInterfaceList } from '../../../../reducer/modules/interface.js';

// @connect(
//   state => {
//     return {
//       list: state.inter.list
//     }
//   },
//   {
//     fetchInterfaceList
//   }
// )
export default class ImportInterface extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    selectedRowKeys: [],
    categoryCount: {}
  }

  static propTypes = {
    list: PropTypes.array,
    onChange: PropTypes.func
  }

  render() {
    const { list } = this.props;
    // const { selectedRowKeys } = this.state;
    const data = list.map(item => {
      return {
        key: 'category_' + item._id,
        title: item.name,
        isCategory: true,
        children: item.list ? item.list.map(e => {
          e.key = e._id
          e.categoryKey = 'category_' + item._id
          e.categoryLength = item.list.length
          return e
        }) : []
      }
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
        // console.log(record, selected, selectedRows);
        const oldSelecteds = self.state.selectedRowKeys;
        const categoryCount = self.state.categoryCount;
        const categoryKey = record.categoryKey;
        const categoryLength = record.categoryLength;
        let selectedRowKeys = [];
        if (record.isCategory) {
          selectedRowKeys = record.children.map(item => item._id).concat(record.key)
          if (selected) {
            selectedRowKeys = selectedRowKeys.filter(id => oldSelecteds.indexOf(id) === -1).concat(oldSelecteds)
            categoryCount[categoryKey] = categoryLength;
          } else {
            selectedRowKeys = oldSelecteds.filter(id => selectedRowKeys.indexOf(id) === -1)
            categoryCount[categoryKey] = 0;
          }
        } else {
          if (selected) {
            selectedRowKeys = oldSelecteds.concat(record._id)
            if (categoryCount[categoryKey]) {
              categoryCount[categoryKey] += 1;
            } else {
              categoryCount[categoryKey] = 1;
            }
            if (categoryCount[categoryKey] === record.categoryLength) {
              selectedRowKeys.push(categoryKey)
            }
          } else {
            selectedRowKeys = oldSelecteds.filter(id => id !== record._id)
            if (categoryCount[categoryKey]) {
              categoryCount[categoryKey] -= 1;
            }
            selectedRowKeys = selectedRowKeys.filter(id => id !== categoryKey)
          }
        }
        self.setState({ selectedRowKeys, categoryCount })
        self.props.onChange(selectedRowKeys.filter(id => ('' + id).indexOf('category') === -1));
      },
      onSelectAll: (selected) => {
        // console.log(selected, selectedRows, changeRows);
        let selectedRowKeys = [];
        let categoryCount = self.state.categoryCount;
        if (selected) {
          data.forEach(item => {
            if(item.children) {
              categoryCount['category_' + item._id] = item.children.length;
              selectedRowKeys = selectedRowKeys.concat(item.children.map(item => item._id))
            }
          });
          selectedRowKeys = selectedRowKeys.concat(data.map(item => item.key))
        } else {
          categoryCount = {};
          selectedRowKeys = [];
        }
        self.setState({ selectedRowKeys, categoryCount })
        self.props.onChange(selectedRowKeys.filter(id => ('' + id).indexOf('category') === -1));
      },
      selectedRowKeys: self.state.selectedRowKeys
    };

    const columns = [{
      title: '接口名称',
      dataIndex: 'title',
      width: '30%'
    }, {
      title: '接口路径',
      dataIndex: 'path',
      width: '40%'
    }, {
      title: '请求方法',
      dataIndex: 'method',
      render: (item) => {
        let methodColor = variable.METHOD_COLOR[item ? item.toLowerCase() : 'get'];
        return <span style={{color: methodColor.color, backgroundColor: methodColor.bac, borderRadius: 4}} className="colValue">{item}</span>
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      render: (text) => {
        return text && (text === 'done' ? <span className="tag-status done">已完成</span> : <span className="tag-status undone">未完成</span>)
      }
    }];

    return (
      <div>
        <Table columns={columns} rowSelection={rowSelection} dataSource={data} pagination={false} />
      </div>
    )
  }
}