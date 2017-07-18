import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { 
  fetchNewsData, 
  fetchViewedNews, 
  fetchNotVieweNews } from '../../../actions/news.js'


@connect(
  state => {
    return {
      newsData: state.news.newsData
    }
  },
  {
    fetchNewsData,
    fetchViewedNews,
    fetchNotVieweNews
  }
)

class NewsList extends Component {

  static propTypes = {
    fetchNewsData: PropTypes.func,
    fetchViewedNews: PropTypes.func,
    fetchNotVieweNews: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  

  fetchData(e){
    const mark = e.target.className;
    if(mark.indexOf('allnews')>-1){
      this.props.fetchNewsData()
      this.switchColor(mark.indexOf('allnews'),e.target)
    }else if(mark.indexOf('viewednews')>-1){
      this.props.fetchViewedNews();
      this.switchColor(mark.indexOf('viewednews'),e.target)
    }else if(mark.indexOf('notview')>-1){
      this.props.fetchNotVieweNews();
      this.switchColor(mark.indexOf('notview'),e.target)
    }

  }
  switchColor(index,e){
    let childNodes = e.parentNode.childNodes;
    if(e.className.indexOf('active')> -1) return;
    for(let j = 0;j<childNodes.length;j++){
      const i = childNodes[j].className.indexOf('active');
      if(i> -1){
        // console.log( childNodes[i].className.splice);
        let className = childNodes[j].className;
        className = className.split('');
        className.splice(i,6);
        childNodes[j].className = className.join('');
      }
    }
    e.className = e.className + ' active';
  }
  render () {
    return (
      <ul onClick = {this.fetchData.bind(this)} className="news-list">
        <li className="active allnews">全部消息</li>
        <li className='viewednews'>已读消息</li>
        <li className='notview'>未读消息</li>
      </ul>
    )
  }
}

export default NewsList