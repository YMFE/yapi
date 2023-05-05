import './Activity.scss'
import React, { PureComponent as Component } from 'react'
import TimeTree from '../../../components/TimeLine/TimeLine'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Button } from 'antd'
@connect(state => {
  return {
    uid: state.user.uid + '',
    curdata: state.inter.curdata,
    currProject: state.project.currProject,
  }
})
class Activity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wikiList: [],
    }
  }
  static propTypes = {
    uid: PropTypes.string,
    getMockUrl: PropTypes.func,
    match: PropTypes.object,
    curdata: PropTypes.object,
    currProject: PropTypes.object,
  }

  UNSAFE_componentWillMount() {
    axios
      .get('/api/plugin/wiki_action/get_page_all_list', {
        params: {
          project_id: this.props.match.params.id,
        },
      })
      .then(res => {
        this.setState({
          wikiList: res.data.data,
        })
      })
  }

  render() {
    let { currProject } = this.props
    const location = window.location
    return (
      <div className="g-row">
        <section className="news-box m-panel">
          <div style={{ display: 'none' }} className="logHead">
            {/*<Breadcrumb />*/}
            <div className="projectDes">
              <p>高效、易用、可部署的API管理平台</p>
            </div>
            <div className="Mockurl">
              <span>Mock地址：</span>
              <p>
                {location.protocol +
                  '//' +
                  location.hostname +
                  (location.port !== '' ? ':' + location.port : '') +
                  `/mock/${currProject._id}${currProject.basepath}/yourPath`}
              </p>
              <Button type="primary">
                <a
                  href={`/api/project/download?project_id=${this.props.match.params.id}`}
                >
                  下载Mock数据
                </a>
              </Button>
            </div>
          </div>
          <TimeTree
            type={'project'}
            typeid={+this.props.match.params.id}
            wikiList={this.state.wikiList}
          />
        </section>
      </div>
    )
  }
}

export default Activity
