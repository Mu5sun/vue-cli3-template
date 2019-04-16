import * as types from './mutation-types'

export const asyncGet = ({ commit, state }, key) => {
  key = state.key
  // commit用来触发mutations里对应的方法
  commit(types.SET_VALUE, key)
}
