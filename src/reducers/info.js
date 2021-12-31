// src/reducers/counter.js
import { ADD, MINUS, SAVE, READ, SAVEONCE, GET } from '../constants/counter'

const INITIAL_STATE = {
  cinema: [],
  films: [],
  icons: [],
}

export default function info (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET:
      return {
        cinema: action.data.data.cinema,
        films: action.data.data.films,
        icons: action.data.data.icons,
      }
    default:
      return state
  }
}