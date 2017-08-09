import './News.scss'
import React, { Component } from 'react'
import NewsTimeline from './NewsTimeline/NewsTimeline'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import { Button } from 'antd'

@connect(
  state => {
    console.log(state);
    return {
      uid: state.login.uid + ''
    }
  },
  {
  }
)

class News extends Component {
  constructor(props) {
    super(props)
  }
  static propTypes = {
    uid: PropTypes.string
  }
  render () {
    return (
      <section className="news-box">
        <div className="logHead">
          <Breadcrumb />
          <div className="Mockurl">
            <span>Mock地址：</span>
            <p>mockurl</p>
            <Button type="primary">下载Mock数据</Button>
          </div>
        </div>
        <NewsTimeline/>
      </section>
    )
  }
}

export default News
