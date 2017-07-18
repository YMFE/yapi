import React, { Component } from 'react'
import { Timeline } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchMoreNews } from '../../../actions/news.js'
@connect(
  state=>{
    return state;
  },
  {
    fetchMoreNews: fetchMoreNews
  }
)
class NewsTimeline extends Component {
  static propTypes = {
    newsData: PropTypes.array,
    fetchMoreNews: PropTypes.func
  }

  constructor(props) {
    super(props);
  }

  render () {
    const data = this.props.newsData;
    return (
      <section className="news-timeline">
        <Timeline pending={<a onClick = {this.props.fetchMoreNews}>See more</a>}>
          { 
            data.map(function(item,i){
              return (
                <Timeline.Item color = 'green' key = {i} >
                  <div>
                    <span className='timelineDate'>{item.date}</span>
                    <span className='timelineName'>{item.name}</span>
                  </div>
                  <p>{item.desc}</p>
                </Timeline.Item>
              )
            })
           }
        </Timeline>
      </section>
    )
  }
}

export default NewsTimeline
