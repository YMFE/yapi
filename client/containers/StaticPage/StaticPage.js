import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import _ from 'lodash'
import './StaticPage.scss'

export default class StaticPage extends Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.state = {
      projectId: this.props.match.params.id,
      staticPageId: this.props.match.params.wiki_id,
      desc: '',
    }
  }

  componentDidMount() {
    this.getContent()
  }

  getContent = () => {
    const staticPageId = this.state.staticPageId
    axios
      .get('/api/plugin/wiki_action/get_detail', {
        params: {
          id: staticPageId,
        },
      })
      .then(response => {
        let record = _.get(response, ['data', 'data'], {})
        if (_.isEmpty(record)) {
          record = {}
        }
        let { desc = '' } = record
        let headCount = 0
        desc = desc.replace(/<h[1-6]/gi, function(n) {
          return `${n} id="${headCount++}"`
        })
        this.setState({
          desc,
        })
      })
      .catch(function(error) {
        console.log(error)
      })
  }

  render() {
    const desc = this.state.desc

    return (
      <div className="public-wiki-container">
        <div className="markdown-body public-wiki-content  scroll">
          <div
            className="tui-editor-contents"
            id="scroll"
            dangerouslySetInnerHTML={{ __html: desc }}
          />
        </div>
      </div>
    )
  }
}
