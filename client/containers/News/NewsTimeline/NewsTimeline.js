import React, { Component } from 'react'
import { Table, Popconfirm } from 'antd'
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
    newsData: PropTypes.object,
    fetchMoreNews: PropTypes.func,
    setLoading: PropTypes.func,
    loading: PropTypes.bool
  }
  
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        pageSize: 10,
        total: 34
      }
    };
  }

  handleChange(pagination){
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.props.setLoading(true); 
    const that = this;
    this.props.fetchMoreNews(pagination.current,pagination.pageSize).then(function(){
      that.props.setLoading(false); 
    })
  }
  render () {
    const columns = [
      { title: '操作用户',width:100, dataIndex: 'username', key: 'username' },
      { title: '日志标题',width: 200,  dataIndex: 'title', key: 'title' },
      { title: '具体改动描述', dataIndex: 'content', key: 'content' },
      { title: '时间',width: 150, dataIndex: 'time', key: 'time' }
    ];
    const data = this.props.newsData.newsList;
    return (
      <section className="news-timeline">
        <span className='removeAllNews'>
          <Popconfirm title="你确定要清空所有消息吗?" onConfirm={removeConfirm} okText="删除" cancelText="取消">
            清空消息
          </Popconfirm>
        </span>
        <Table
          loading={this.props.loading}
          columns={columns}
          expandedRowRender={record => <div className='newsDesc'><p>{record.content}</p></div>}
          dataSource={data}
          pagination={{...this.state.pagination,total:this.props.newsData.totalPage}}
          onChange={this.handleChange.bind(this)}
        />
      </section>
    )
  }
}

export default NewsTimeline
