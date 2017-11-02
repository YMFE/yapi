/**
 * Created by gxl.gao on 2017/10/25.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import './index.scss'
// import { withRouter } from 'react-router-dom';
import { Row, Col, Tooltip, Icon } from 'antd';
import { setBreadcrumb } from 'client/reducer/modules/user';
import StatisChart from './StatisChart';

const CountOverview = (props) => (
  <Row type="flex" justify="space-start" className="m-row">
    <Col className="gutter-row" span={6}>
      <span>
        分组总数
        <Tooltip placement="rightTop" title="统计yapi中一共开启了多少可见的公共分组">
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.date.groupCount}</h2>

    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        项目总数
        <Tooltip placement="rightTop" title="统计yapi中建立的所有项目总数">
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.date.projectCount}</h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        接口总数
        <Tooltip placement="rightTop" title="统计yapi所有项目中的所有接口总数">
          {/*<a href="javascript:void(0)" className="m-a-help">?</a>*/}
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.date.interfaceCount}</h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        测试接口总数
        <Tooltip placement="rightTop" title="统计yapi所有项目中的所有测试接口总数">
          {/*<a href="javascript:void(0)" className="m-a-help">?</a>*/}
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.date.interfaceCaseCount}</h2>
    </Col>
  </Row>
);

CountOverview.propTypes = {
  date: PropTypes.object
};


@connect(
  null, {
    setBreadcrumb
  }
)
class statisticsPage extends Component {
  static propTypes = {
    setBreadcrumb: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      count: {
        groupCount: 0,
        projectCount: 0,
        interfaceCount: 0,
        interfactCaseCount: 0
      }
    }
  }

  async componentWillMount() {
    this.props.setBreadcrumb([{ name: '数据统计' }]);
    this.getStatisData();
  }

  // 获取统计数据
  async getStatisData() {
    let result = await axios.get('/api/plugin/statismock/count');
    if (result.data.errcode === 0) {
      let statisData = result.data.data;
      this.setState({
        count: { ...statisData }
      });
    }
  }
  

  render() {
    const { count } = this.state;

    return (
      <div className="g-statistic">
        <div className="statis-content">
          <CountOverview date={count}></CountOverview>
          <StatisChart />
        </div>
      </div>

    )
  }
}

export default statisticsPage;