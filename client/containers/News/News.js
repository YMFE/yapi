import './News.scss'
import React, { Component } from 'react'
import NewsTimeline from './NewsTimeline/NewsTimeline'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import { Button } from 'antd'
import { getMockUrl } from '../../reducer/modules/news.js'

@connect(
  state => {
    console.log(state);
    return {
      uid: state.login.uid + ''
    }
  },
  {
    getMockUrl: getMockUrl
  }
)

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mockURL:""
    }
  }
  static propTypes = {
    uid: PropTypes.string,
    getMockUrl: PropTypes.func
  }
  componentWillMount(){
    const that = this;
    this.props.getMockUrl(2724).then(function(data){
      
      const { prd_host, basepath, protocol } = data.payload.data.data;
      
      const mockURL = `${protocol}://${prd_host}${basepath}/{path}`;
      console.log(data.payload.data.data);
      that.setState({
        mockURL: mockURL
      })
    })
  }
  render () {
    return (
      <section className="news-box">
        <div className="logHead">
          <Breadcrumb />
          <div className="Mockurl">
            <span>Mock地址：</span>
            <p>{this.state.mockURL}</p>
            <Button type="primary">下载Mock数据</Button>
          </div>
        </div>
        <NewsTimeline/>
      </section>
    )
  }
}

export default News
