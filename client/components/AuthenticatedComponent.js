import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { changeMenuItem } from '../actions/menu'


export function requireAuthentication(Component) {
  class AuthenticatedComponent extends React.Component {
    constructor(props){
      super(props);
    }
    static propTypes ={
      isAuthenticated : PropTypes.bool,
      location: PropTypes.object,
      dispatch: PropTypes.func,
      history: PropTypes.object,
      changeMenuItem:PropTypes.func
    }
    componentWillMount() {
      this.checkAuth();
    }
    componentWillReceiveProps() {
      this.checkAuth();
    }
    checkAuth() {
      if( !this.props.isAuthenticated ){
        this.props.history.push('/');
        this.props.changeMenuItem('/');
      }
    }
    render() {
      return (
        <div>
          {this.props.isAuthenticated
            ? <Component {...this.props}/>
            : null
          }
        </div>
      )

    }
  }
  return connect(
    (state) => {
      return{
        isAuthenticated: state.login.isLogin
      }
    },
    {
      changeMenuItem
    }
  )(AuthenticatedComponent);
}


