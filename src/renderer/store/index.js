import Vue from 'vue'
import Vuex from 'vuex'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'

import getters from './getters'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  getters,
  // plugins: [createPersistedState(), createSharedMutations()],
  strict: process.env.NODE_ENV !== 'production'
})
