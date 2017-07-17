import React, { Component } from 'react'
import { Timeline } from 'antd'
import PropTypes from 'prop-types'

class NewsTimeline extends Component {
  static propTypes = {
    data: PropTypes.array
  }

  constructor(props) {
    super(props)
  }

  render () {
    const data = this.props.data;
    return (
      <section className="news-timeline">
        <Timeline pending={<a href="#">See more</a>}>
          { 
            data.map(function(item,i){
              return (
                <Timeline.Item color = 'green' key = {i} >{ item.date + item.desc + item.name }</Timeline.Item>
              )
            })
           }
        </Timeline>
      </section>
    )
  }
}

export default NewsTimeline
