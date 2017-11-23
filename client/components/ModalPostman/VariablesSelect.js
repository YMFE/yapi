import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;


const records = [{
  _id: 11,
  casename: 'case-test',
  params: {
    id1: '123',
    name: '小明'
  },
  body: {
    email: 'weriri@qq.com',
    arr: [
      {
        email: 'weriri@qq.com',
        arr: [{
          pid: 1,
          tt: {
            a: 1
          }
        }]
      },
      {
        email: 'weriri@qq.com',
        arr: [{
          pid: 1,
          tt: {
            a: 1
          }
        }]
      },
      {
        email: 'weriri@qq.com',
        arr: [{
          pid: 1,
          tt: {
            a: 1
          }
        }]
      },
      {
        email: 'weriri@qq.com',
        arr: [{
          pid: 1,
          tt: {
            a: 1
          }
        }]
      }
    ],

    body: {
      email: 'weriri@qq.com',
      body: {
        email: 'weriri@qq.com',
        body: {
          email: 'weriri@qq.com',
          body: {
            email: 'weriri@qq.com',
            arr: [{
              pid: 1,
              tt: {
                a: 1
              }
            }]
          },
          arr: [{
            pid: 1,
            tt: {
              a: 1
            }
          }]
        },
        arr: [{
          pid: 1,
          tt: {
            a: 1
          }
        }]
      },
      arr: [{
        pid: 1,
        tt: {
          a: 1
        }
      }]
    }
  }
},
{
  _id: 12,
  casename: 'case-test222',
  params: {
    id1: '123333',
    name: '小明3333'
  },
  body: {
    email: 'weri333ri@qq.com',
    arr: [{
      pid: 12,
      tt: {
        a: '122222'
      }
    }]
  }
}

]

const CanSelectPathPrefix = 'CanSelectPath-';

class VariablesSelect extends Component {

  componentDidMount() {

  }

  static propTypes = {
    click: PropTypes.func

  }
  state = {
    records: records,
    expandedKeys: []
  }

  handleSelect = (key) => {
    if (key && key.indexOf(CanSelectPathPrefix) === 0) {
      key = key.substr(CanSelectPathPrefix.length)
      console.log(key)
      this.props.click(key);
    } else {
      this.setState({
        expandedKeys: [key]
      })
    }

  }

  onExpand = (keys) => {
    this.setState({ expandedKeys: keys })
  }

  render() {
    const pathSelctByTree = (data, elementKeyPrefix = '$', deepLevel = 0) => {
      let keys = Object.keys(data);
      let TreeComponents = keys.map((key) => {
        let item = data[key], casename;
        if (deepLevel === 0) {
          elementKeyPrefix = '$'
          elementKeyPrefix = elementKeyPrefix + '.' + item._id;
          casename = item.casename;
          item = {
            params: item.params,
            body: item.body
          }
        } else if (Array.isArray(data)) {
          elementKeyPrefix = elementKeyPrefix + '[' + key + ']';
        } else {
          elementKeyPrefix = elementKeyPrefix + '.' + key
        }

        if (item && typeof item === 'object') {
          return <TreeNode key={elementKeyPrefix} title={casename || key}>{pathSelctByTree(item, elementKeyPrefix, deepLevel + 1)}</TreeNode>;
        }
        return <TreeNode key={CanSelectPathPrefix + elementKeyPrefix} title={key} />;
      })

      return TreeComponents
    }

    return (
      <div className="modal-postman-form-variable">
        <Tree
          expandedKeys={this.state.expandedKeys}
          onSelect={([key]) => this.handleSelect(key)}
          onExpand={this.onExpand}
        >
          {pathSelctByTree(this.state.records)}
        </Tree>
      </div>
    )

  }

}

export default VariablesSelect;