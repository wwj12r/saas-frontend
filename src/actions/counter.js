// src/actions/counter.js
import {
  SAVE,
  READ,
  GET,
  SAVEONCE
} from '../constants/counter'
import { getMovies } from '../api/index';

export const save = (e) => {
  return {
    type: SAVE,
    mobile:e
  }
}

export const saveSnack = (e) => {
  return {
    type: SAVEONCE,
    snack:e
  }
}

export const readMobile = () => {
  return {
    type: READ
  }
}

export const get = (res) => {
  return {
    type: GET,
    data: res
  }
}

export function getMovieList() {
  return async dispatch => {
    const res = await getMovies()
    dispatch(get(res))
  }
}

// 异步的 action
// export function asyncAdd () {
//   return dispatch => {
//     setTimeout(() => {
//       dispatch(add())
//     }, 2000)
//   }
// }