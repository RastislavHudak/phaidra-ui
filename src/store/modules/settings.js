const state = {
  instance: null
}

const mutations = {
  initSettings (state, rootState) {
    state.instance = rootState.config.instances[rootState.config.defaultinstance]
  },
  switchInstance (state, payload) {
    state.instance = payload.rootState.config.instances[payload.instance]
  }
}

const actions = {
  switchInstance ({ commit, rootState }, instance) {
    commit('switchInstance', { rootState: rootState, instance: instance })
  },
  initSettings ({ commit, rootState }) {
    commit('initSettings', rootState)
  }
}

export default {
  state,
  mutations,
  actions
}
