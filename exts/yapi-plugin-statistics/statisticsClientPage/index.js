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

const StatusOverview = (props) => (
  <Row type="flex" justify="space-start" className="m-row">
    
    <Col className="gutter-row" span={6}>
      <span>
        操作系统类型
        <Tooltip placement="rightTop" title="操作系统类型,返回值有'darwin', 'freebsd', 'linux', 'sunos' , 'win32'">
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.data.systemName}</h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        cpu负载
        <Tooltip placement="rightTop" title="cpu的总负载情况">
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.data.load} %</h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        系统空闲内存总量 / 内存总量
        <Tooltip placement="rightTop" title="统计yapi所有项目中的所有测试接口总数">
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.data.freemem} G / {props.data.totalmem} G </h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        邮箱状态
        <Tooltip placement="rightTop" title="检测配置文件中配置邮箱的状态">
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.data.mail}</h2>

    </Col>
  </Row>
);

StatusOverview.propTypes = {
  data: PropTypes.object
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
      },
      status: {
        mail: '',
        systemName: '',
        totalmem: '',
        freemem: '',
        uptime: ''
      }
    }
  }

  async componentWillMount() {
    this.props.setBreadcrumb([{ name: '系统信息' }]);
    this.getStatisData();
    this.getSystemStatusData();
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

  // 获取系统信息

  async getSystemStatusData() {
    let result = await axios.get('/api/plugin/statismock/get_system_status')
    if (result.data.errcode === 0) {
      let statusData = result.data.data;
      this.setState({
        status: { ...statusData }
      });
    }
  }


  render() {
    const { count, status } = this.state;

    return (
      <div className="g-statistic">
        <div className="content">
          <h2 className="title">系统状况</h2>
          <div className="system-content">
            <StatusOverview data={status}></StatusOverview>
          </div>
          <h2 className="title">数据统计</h2>
          <div>
            <CountOverview date={count}></CountOverview>
            <StatisChart />
          </div>

        </div>
      </div>

    )
  }
}

export default statisticsPage;