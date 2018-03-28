import React, { Component } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types'




const columns = [
  {
    title: 'Group',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '项目',
    dataIndex: 'project',
    key: 'project'
  },
  {
    title: '分组',
    dataIndex: 'interface',
    key: 'interface'
  },
  {
    title: 'mock数据',
    dataIndex: 'mock',
    key: 'mock'
  }
];

class SchemaTable extends Component {

  static propTypes = {
    dataSource: PropTypes.array
  }

  constructor(props) {
    super(props);
    
  }

  render() {    
    const {dataSource} = this.props;
    
    // dataSource = _.isArray(dataSource) ? dataSource : []
    return ( 
      <div className="m-row-table">
        <h3 className="statis-title">分组数据详情</h3>
        <Table className="statis-table" pagination={false} dataSource={dataSource} columns={columns} />
      </div>
    ) 
    
    ;
  }
}
export default SchemaTable;