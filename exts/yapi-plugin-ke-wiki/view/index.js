import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import PageComponent from './page/index'
import EditComponent from './edit/index'

const KeWikiRoute = props => {
  let C
  if (
    props.match.params.action === 'edit' ||
    props.match.params.action === 'create'
  ) {
    C = <EditComponent {...props}></EditComponent>
  } else if (props.match.params.action === 'page') {
    C = <PageComponent {...props}></PageComponent>
  } else {
    C = <div></div>
  }
  return C
}

KeWikiRoute.propTypes = {
  match: PropTypes.object,
}

class KeWiki extends Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
  }

  constructor(props) {
    super(props)
    if (this.props.match.params.action === ':action') {
      // 如果通过路由默认页进入的话, 直接导航进首页
      let guideTo = `/project/${this.props.match.params.id}/wiki/page/`
      this.props.history.push(guideTo)
    }
  }

  componentDidUpdate() {
    if (this.props.match.params.action === ':action') {
      // 如果通过路由默认页进入的话, 直接导航进首页
      let guideTo = `/project/${this.props.match.params.id}/wiki/page/`
      this.props.history.push(guideTo)
    }
  }

  render() {
    return (
      <Switch>
        <Route
          path="/project/:id/wiki/:action/:wiki_id?"
          component={KeWikiRoute}
        />
      </Switch>
    )
  }
}

export default KeWiki
