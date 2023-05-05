import { withRouter } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import PropTypes from 'prop-types'
import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
@withRouter
export default class BreadcrumbNavigation extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    list: PropTypes.array,
  }

  render() {
    const { list } = this.props
    const { id } = this.props.match.params
    const crumbList = list.map(item => {
      if (item.id) {
        return (
          <Breadcrumb.Item key={item.id}>
            <Link to={`/project/${id}/wiki/page/${item.id}`}>{item.title}</Link>
          </Breadcrumb.Item>
        )
      } else {
        return <Breadcrumb.Item key="current">{item.title}</Breadcrumb.Item>
      }
    })
    return <Breadcrumb {...this.props}>{crumbList}</Breadcrumb>
  }
}
