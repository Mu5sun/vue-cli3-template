import * as types from './mutation-types'

const mutations = {
  [types.SET_VALUE] (state, key) {
    state.key = key
  }
}

export default mutations
