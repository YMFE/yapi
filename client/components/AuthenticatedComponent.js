import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { changeMenuItem } from '../reducer/modules/menu'
import qs from 'querystring'
export function requireAuthentication(Component) {
  return @connect(
    state => {
      return {
        isAuthenticated: state.user.isLogin,
      }
    },
    {
      changeMenuItem,
    },
  )
  class AuthenticatedComponent extends React.PureComponent {
    constructor(props) {
      super(props)
    }
    static propTypes = {
      isAuthenticated: PropTypes.bool,
      location: PropTypes.object,
      dispatch: PropTypes.func,
      history: PropTypes.object,
      changeMenuItem: PropTypes.func,
    }
    UNSAFE_componentWillMount() {
      this.checkAuth()
    }
    UNSAFE_componentWillReceiveProps() {
      this.checkAuth()
    }
    checkAuth() {
      const location = window.location

      if (!this.props.isAuthenticated) {

        let query = qs.stringify({
          from: `${location.pathname}${location.search}`,
        })
        this.props.history.push(`/?${query}`)
        this.props.changeMenuItem('/')
      }
    }
    render() {
      return (
        <div>
          {this.props.isAuthenticated ? <Component {...this.props} /> : null}
        </div>
      )
    }
  }
}
