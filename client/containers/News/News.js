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
      uid: state.user.curUid,
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
    this.state = {
      loading: false
    }
  }
  static propTypes = {
    newsData: PropTypes.object,
    fetchNewsData: PropTypes.func,
    uid: PropTypes.string
  }
  setLoading(bool){
    this.setState({
      loading: bool
    })
  }
  componentWillMount(){
    console.log(this.props.uid);
    this.props.fetchNewsData(1,1,10).then(function(data){
      console.log(data);
    })
  }
  render () {
    const data = this.props.newsData
    return (
      <section className="news-box">
        <NewsList loading={this.state.loading} setLoading={this.setLoading.bind(this)} />
        <NewsTimeline loading={this.state.loading} setLoading={this.setLoading.bind(this)} newsData = {data} />
      </section>
    )
  }
}

export default News
