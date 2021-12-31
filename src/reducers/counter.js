// src/reducers/counter.js
import { ADD, MINUS, SAVE, READ, SAVEONCE, GET } from '../constants/counter'

const INITIAL_STATE = {
  num: 0,
  mobile: '',
  snack: [],
}

export default function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case READ:
      return state.mobile
    case SAVE:
      return {
        mobile: action.mobile
      }
    case SAVEONCE:
      return {
        snack: action.snack
      }
    default:
      return state
  }
}