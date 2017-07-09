import React, { Component } from 'react'
import { createStore, combineReducers } from 'redux'
import Login from './containers/Login/Login_redux.js'
import { Provider, connect } from 'react-redux'

// const store = createStore(combineReducers({Login}))

// const increaseAction = { type: 'increase' }

// function mapStateToProps(state) {
//   return {
//     value: 4444,
//     per: 4444444,
//   }
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     onIncreaseClick: () => dispatch()
//   }
// }

// const App = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Login)

// export { store }