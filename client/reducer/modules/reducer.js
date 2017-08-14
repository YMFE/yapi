import { combineReducers } from 'redux';
import user from './user.js'
import group from './group.js'
import project from './project.js'
import inter from './interface.js'
import news from './news.js'
import addInterface from './addInterface.js'
import menu from './menu.js'
import follow from './follow.js'

export default combineReducers({
  group,
  user,
  inter,
  project,
  news,
  addInterface,
  menu,
  follow
})
