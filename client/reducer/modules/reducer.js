import { combineReducers } from 'redux';
import user from './user.js'
import group from './group.js'
import project from './project.js'
import Interface from './interface.js'
import news from './news.js'
import addInterface from './addInterface.js'
import menu from './menu.js'

export default combineReducers({
  group,
  user,
  Interface,
  project,
  news,
  addInterface,
  menu
})
