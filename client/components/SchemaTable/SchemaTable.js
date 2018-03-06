import React, { Component } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types'
import { schemaTransformToTable } from '../../../common/shema-transformTo-table.js';
import _ from 'underscore';

const messageMap = {
  desc: '备注',
  default: '实例',
  maximum: '最大值',
  minimum: '最小值',
  maxItems: '最大数量',
  minItems: '最小数量',
  maxLength: '最大长度',
  minLength: '最小长度',
  enum: '枚举',
  uniqueItems: '元素是否都不同',
  itemType: 'item 类型',
  format: '版本'
};

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: (text, item) => {
      // console.log('text',item.sub);
      return text === 'array' ? <span>{item.sub.itemType || ''} []</span> : <span>{text}</span>;
    }
  },
  {
    title: '是否必须',
    dataIndex: 'required',
    key: 'required',
    render: text => {
      return <div>{text ? '必须' : '非必须'}</div>;
    }
  },
  {
    title: '默认值',
    dataIndex: 'default',
    key: 'default'
  },
  {
    title: '备注',
    dataIndex: 'desc',
    key: 'desc',
    render: (text, item) => {
      // console.log('text',item.sub);
      return _.isUndefined(item.childrenDesc) ? (
        <span>{text}</span>
      ) : (
        <span>{item.childrenDesc}</span>
      );
    }
  },
  {
    title: '其他信息',
    dataIndex: 'sub',
    key: 'sub',
    render: text => {
      return Object.keys(text || []).map((item, index) => {
        let name = messageMap[item];
        let value = text[item];

        return (
          !_.isUndefined(text[item]) && (
            <p key={index}>
              <span style={{ fontWeight: '700' }}>{name}: </span>
              <span>{value.toString()}</span>
            </p>
          )
        );
      });
    }
  }
];


class SchemaTable extends Component {

  static propTypes = {
    dataSource: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    let product = JSON.parse(this.props.dataSource)  
    
    this.setState({
      data: schemaTransformToTable(product)
    });
  }

  render() {
    
    return <Table bordered size="small" pagination={false} dataSource={this.state.data} columns={columns} />;
  }
}
export default SchemaTable;