// src/reducers/index.js
import { combineReducers } from 'redux'
import counter from './counter'
import info from './info'

export default combineReducers({
  counter,
  info
})
