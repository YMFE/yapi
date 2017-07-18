import './News.scss'
import React, { Component } from 'react'
import NewsTimeline from './NewsTimeline/NewsTimeline'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import NewsList from './NewsList/NewsList.js'
import { fetchNewsData } from '../../actions/news.js'


@connect(
  state => {
    return {
      newsData: state.news.newsData?state.news.newsData:[]
    }
  },
  {
    fetchNewsData: fetchNewsData
  }
)

class News extends Component {
  constructor(props) {
    super(props)
  }
  static propTypes = {
    newsData: PropTypes.array,
    fetchNewsData: PropTypes.func
  }
  componentWillMount(){
    this.props.fetchNewsData()
  }
  render () {
    const data = this.props.newsData
    return (
      <section className="news-box">
        <NewsList />
        <NewsTimeline newsData = {data} />
      </section>
    )
  }
}

export default News
