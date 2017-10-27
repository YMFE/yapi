/**
 * Created by gxl.gao on 2017/10/25.
 */
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
// const data = [
//   { name: '1', pv: 2400 },
//   { name: '2', pv: 1398 },
//   { name: '3', pv: 9800 },
//   { name: '4', pv: 3908 },
//   { name: '5', pv: 4800 },
//   { name: '6', pv: 3800 },
//   { name: '7', pv: 4300 },
//   { name: '8', pv: 2400 },
//   { name: '9', pv: 1398 },
//   { name: '10', pv: 9800 },
//   { name: '11', pv: 3908 },
//   { name: '12', pv: 4800 },
//   { name: '13', pv: 3800 },
//   { name: '14', pv: 4300 },
//   { name: '15', pv: 2400 },
//   { name: '16', pv: 1398 },
//   { name: '17', pv: 9800 },
//   { name: '18', pv: 3908 },
//   { name: '19', pv: 4800 },
//   { name: '20', pv: 3800 },
//   { name: '21', pv: 4300 },
//   { name: '22', pv: 2400 },
//   { name: '23', pv: 1398 },
//   { name: '24', pv: 9800 },
//   { name: '25', pv: 3908 },
//   { name: '26', pv: 4800 },
//   { name: '27', pv: 3800 },
//   { name: '28', pv: 4300 },
//   { name: '29', pv: 2400 },
//   { name: '30', pv: 1398 },
//   { name: 'Page C', pv: 9800 },
//   { name: 'Page D', pv: 3908 },
//   { name: 'Page E', pv: 4800 },
//   { name: 'Page F', pv: 3800 },
//   { name: 'Page G', pv: 4300 },
// ];

class StatisChart extends Component {

  static propTypes = {

  }

  constructor(props) {
    super(props);
    this.state = {
      chartDate: {
        mockCount: 0,
        mockDateList: []

      }
    }
  }

  componentWillMount() {
    this.getMockData();

  }

  // 获取mock 请求次数信息
  async getMockData() {
    let result = await axios.get('/api/plugin/statismock/get');
    if (result.data.errcode === 0) {
      let mockStatisData = result.data.data;
      this.setState({
        chartDate: { ...mockStatisData }
      });
    }
  }

  render() {
    // console.log('date', this.props.date);
    const width = 950;
    // console.log('width', document.querySelector('body').offsetWidth);
    const { mockCount, mockDateList } = this.state.chartDate;
    return (
      <div className="statis-chart-content">
        <h3 className="statis-title">mock 接口访问总数为：{mockCount}</h3>
        <div className="statis-chart">
          <LineChart width={width} height={300} data={mockDateList}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="_id"/>
            <YAxis />
            <CartesianGrid strokeDasharray="7 3" />
            <Tooltip />
            <Legend/>
            <Line name="mock统计值" type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
          </LineChart>
        </div>
        <div className="statis-footer">过去3个月mock接口调用情况</div>

      </div>
    );
  }
}

export default StatisChart;