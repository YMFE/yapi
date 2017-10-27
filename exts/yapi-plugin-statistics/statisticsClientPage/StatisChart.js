/**
 * Created by gxl.gao on 2017/10/25.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
// const data = [
//   { name: 'Page A', pv: 2400 },
//   { name: 'Page B', pv: 1398 },
//   { name: 'Page C', pv: 9800 },
//   { name: 'Page D', pv: 3908 },
//   { name: 'Page E', pv: 4800 },
//   { name: 'Page F', pv: 3800 },
//   { name: 'Page G', pv: 4300 }
// ];

class StatisChart extends Component {

  static propTypes = {
    data: PropTypes.object
  }

  render() {
    // console.log('date', this.props.date);
    const { data } = this.props;
    return (
      <div className="statis-select">
        我是一个图表
        <LineChart width={600} height={300} data={data.mockDateList}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="_id" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
      </div>
    );
  }
}

export default StatisChart;