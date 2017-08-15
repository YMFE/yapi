import './Activity.scss'
import React, { Component } from 'react'
import TimeTree from './Timeline/Timeline'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
// import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb'
import { Button } from 'antd'
import { getMockUrl } from '../../../reducer/modules/news.js'

@connect(
  state => {
    return {
      uid: state.user.uid + ''
    }
  },
  {
    getMockUrl: getMockUrl
  }
)

class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mockURL: ""
    }
  }
  static propTypes = {
    uid: PropTypes.string,
    getMockUrl: PropTypes.func,
    match: PropTypes.object
  }
  componentWillMount(){
    const that = this;
    this.props.getMockUrl(2724).then(function(data){
      const { prd_host, basepath, protocol } = data.payload.data.data;
      const mockURL = `${protocol}://${prd_host}${basepath}/{path}`;
      that.setState({
        mockURL: mockURL
      })
    })
  }
  render () {
    return (
      <div>
        <div className="g-row">
          <section className="news-box">
            <div className="logHead">
              {/*<Breadcrumb />*/}
              <div className="Mockurl">
                <span>Mock地址：</span>
                <p>{this.state.mockURL}</p>
                <Button type="primary"><a href = {`/api/project/download?project_id=${this.props.match.params.id}`}>下载Mock数据</a></Button>
              </div>
            </div>
            <TimeTree typeid = {+this.props.match.params.id} />
          </section>
        </div>
      </div>
    )
  }
}

export default Activity
