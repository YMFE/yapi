import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

// $.{id}.params.{path}
// $.{id}.body.{path}

const records = [{
  _id: 1,
  name: 'abc',
  caseList: [{
    _id: 11,
    casename: 'case-test',
    params: {
      id: '123',
      name: '小明'
    },
    body: {
      email: 'weriri@qq.com',
      arr: [{
        pid: 1,
        tt: {
          a: 1
        }
      }]
    }
  }, {
    _id: 12,
    casename: 'case-test1',
    params: {
      id: '123',
      name: '小明'
    },
    body: {
      email: 'weriri@qq.com',
      arr: [{
        pid: 1,
        tt: {
          a: 1
        }
      }]
    }
  }]
},
{
  _id: 2,
  name: 'abc2222',
  caseList: [{
    _id: 13,
    casename: 'case-test222',
    params: {},
    body: [{
      pid: 1,
      tt: {
        a: 1
      }
    }]
  }]
}]

// const x = 3;
// const y = 2;
// const z = 1;
const gData = [];

// const generateData = (_level, _preKey, _tns) => {
//   const preKey = _preKey || '0';
//   const tns = _tns || gData;
//   const children = [];
//   for (let i = 0; i < x; i++) {
//     const key = `${preKey}-${i}`;
//     tns.push({ title: key, key });  // 0-0, 0-1,0-2
//     if (i < y) {
//       children.push(key);     
//     }
//   }
//   if (_level < 0) {
//     return tns;
//   }
//   const level = _level - 1;
//   children.forEach((key, index) => {
//     tns[index].children = [];
//     return generateData(level, key, tns[index].children);
//   });
// };
// generateData(z);

const generateData = (records, _tns) => {
  const tns = _tns || gData;
  records.forEach((item, index) => {
    tns.push({ title: item.name, key: item._id });
    const children = [];
    // let paramsItem = []
    item.caseList.forEach((item, index) => {
      let paramsItemChildren = [];
      let paramsItem = []
      paramsItem.push({ title: 'params', key: `params${index}`, children: [] });
      for (let keys in item.params) {
        paramsItemChildren.push({ title: keys, key: item.params[keys] });
      }
      
      paramsItem[0].children = paramsItemChildren;
      children.push({ title: item.casename, key: item._id, children: paramsItem })
      // children.params
    })

    tns[index].children = children;
  })


}

generateData(records)

class VariablesSelect extends Component {

  componentDidMount() {

  }
  state = {
    gData
    // expandedKeys: ['0-0', '0-0-0', '0-0-0-0']
  }



  render() {
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key={item.key} title={item.title}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key={item.key} title={item.title} />;
    });

    console.log('gDate', this.state.gData);

    return (
      <div className="modal-postman-form-variable">
        <Tree
          className="draggable-tree"
        >
          {loop(this.state.gData)}
        </Tree>
      </div>
    )

  }

}

export default VariablesSelect;