// 网站设置展示等 相关信息
const state = {
  sidebar: {
    opened: true,
    width: 180
  }
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    if (state.sidebar.opened) {
      state.sidebar.width = 180
    } else {
      state.sidebar.width = 55
    }
  }
}

const actions = {
  toggleSidebar: ({ commit }) => {
    commit('TOGGLE_SIDEBAR')
  }
}

export default {
  state,
  mutations,
  actions
}
