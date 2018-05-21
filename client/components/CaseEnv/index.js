// 测试集合中的环境切换

import React from 'react';
import PropTypes from 'prop-types';
import { Select, Row, Col } from 'antd';
const Option = Select.Option;
import './index.scss'
// import { connect } from 'react-redux';

// 数组去重
// function unique(array, compare) {
//   let hash = {};
//   let arr = array.reduce(function(item, next) {
//     hash[next[compare]] ? '' : (hash[next[compare]] = true && item.push(next));
//     // console.log('item',item.project_id)
//     return item;
//   }, []);
//   // 输出去重以后的project_id
//   return arr.map(item => {
//     return item[compare]
//   })
// }

function checkProjectIsExistInArray(project_id, arr) {
  let isRepeat = false;
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    if (item.project_id === project_id) {
      isRepeat = true;
      break;
    }
  }
  return isRepeat;
}

// @connect(
//   state => {
//     return {
//       projectList: state.project.projectList
//     }
//   },
//   {

//   }
// )
export default class CaseEnv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      envList: []
    };
  }

  static propTypes = {
    data: PropTypes.array,
    projectList: PropTypes.array
    // fetchProjectList: PropTypes.func
  };

  // componentDidMount() {
  //   // console.log('group_id', this.props.group_id)
  //   // await this.props.fetchProjectList(this.props.group_id)
  //   this.handleProjectList(this.props.data);
  // }

  componentWillReceiveProps(nextProps) {
    // console.log('next',nextProps.projectList)
    if (nextProps.projectList.length > 0) {
      this.handleProjectList(nextProps.data);
      // console.log('data',nextProps.data)
      // if(this.props.data !== nextProps.data) {
      //   console.log(111)
      //   this.handleProjectList(nextProps.data);
      // }
    }
  }

  handleProjectList = async data => {
    let envList = [];
    this.props.projectList.forEach(item => {
      if (checkProjectIsExistInArray(item._id, data)) {
        envList.push(item);
      }
    });

    console.log('env', envList);
    this.setState({
      envList
    });
  };

  handleChange = () => {
    console.log(111);
  };
  render() {
    // console.log('env1', this.state.envList);
    return (
      <div className="case-env">
        {this.state.envList.length > 0 && (
          <div>
            {this.state.envList.map(item => {
              return (
                <Row key={item._id} type="flex" justify="space-around" align="middle" className="env-item">
                  <Col span={6} className="label">{item.name} :</Col>
                  <Col span={18}>
                    <Select style={{ width: 300 }} onChange={this.handleChange}>
                      <Option key="default" value="">默认环境</Option>

                      {item.env.map(key => {
                        return (
                          <Option value={key.domain} key={key._id}>
                            {key.domain}
                          </Option>
                        );
                      })}
                    </Select>
                  </Col>
                </Row>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
