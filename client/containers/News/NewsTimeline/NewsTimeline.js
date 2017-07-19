import React, { Component } from 'react'
import { Table, Icon, Popconfirm } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchMoreNews } from '../../../actions/news.js'

const removeConfirm = function(e){
  console.log(e);
}

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
  removeOneNews(id){
    return ()=>{
      console.log(id);
    }
  }
  render () {
    const columns = [
      { title: '类型',width:100, dataIndex: 'type', key: 'type' },
      { title: '消息', dataIndex: 'news', key: 'news' },
      { title: '发布时间',width:150, dataIndex: 'time', key: 'time' }
    ];
    const data = this.props.newsData;
    return (
      <section className="news-timeline">
        <span className='removeAllNews'>
          <Popconfirm title="你确定要清空所有消息吗?" onConfirm={removeConfirm} okText="删除" cancelText="取消">
            清空消息
          </Popconfirm>
        </span>
        <Table
          columns={columns}
          expandedRowRender={record => <div className='newsDesc'><p>{record.news}</p><span onClick = {this.removeOneNews(record.key)} ><Icon type="delete" />删除</span></div>}
          dataSource={data}
        />
      </section>
    )
  }
}

export default NewsTimeline
