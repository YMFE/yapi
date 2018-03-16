import { combineReducers } from 'redux';
import user from './user.js'
import group from './group.js'
import project from './project.js'
import inter from './interface.js'
import interfaceCol from './interfaceCol.js'
import news from './news.js'
import addInterface from './addInterface.js'
import menu from './menu.js'
import follow from './follow.js'

const jSchema = require('json-schema-editor-visual')()

import { emitHook } from 'client/plugin.js'

let jSchemaModule = jSchema.Model.getReducers();

const reducerModules = {
  group,
  user,
  inter,
  interfaceCol,
  project,
  news,
  addInterface,
  menu,
  follow,
  schema: jSchemaModule.schema
}
emitHook('add_reducer', reducerModules);


export default combineReducers(reducerModules)
