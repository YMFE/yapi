import React, { Component } from 'react';
import { Table } from 'antd';
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

const product = {
  title: 'Product',
  type: 'object',
  properties: {
    id: {
      description: 'The unique identifier for a product',
      type: 'number'
    },
    name: {
      type: 'string'
    },
    price: {
      type: 'number',
      minimum: 0,
      exclusiveMinimum: true
    },
    arr: {
      type: 'array',
      items: {
        type: 'string',
        description: 'bbbbb'
      },
      description: 'sdfsdf'
    },
    tags: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          length: { type: 'number' },
          width: { type: 'number' },
          height: { type: 'number' }
        }
      },
      minItems: 1,
      uniqueItems: true
    },
    dimensions: {
      type: 'object',
      properties: {
        length: { type: 'number' },
        width: { type: 'number' },
        height: { type: 'number' }
      },
      required: ['length', 'width', 'height']
    }
  },
  required: ['id', 'name', 'price']
};

export default class SchemaTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.setState({
      data: schemaTransformToTable(product)
    });
  }

  render() {
    console.log('data', this.state.data);
    return <Table dataSource={this.state.data} columns={columns} />;
  }
}
