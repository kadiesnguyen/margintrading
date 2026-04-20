import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)
const defaultState = () => {
  return {
    userInfo: {},
    isLogin: localStorage.hasOwnProperty("userToken"),
  }
}
const store = new Vuex.Store({
  state: defaultState(),
  getters: {
    userInfo: state => state.userInfo
  },
  mutations: {
    SET_USER_INFO(state, info) {
      state.userInfo = info;
    },
    SET_LOGIN(state, status){
      state.isLogin = status;
    },

    RESET_STATE(state) {
      Object.assign(state, defaultState())
    }
  },
  actions: {
    setUserInfo({ commit }, payload) {
      commit("SET_USER_INFO", payload)
    },

    updateUserInfo({ state, commit }, payload) {
      const userInfo = {...state.userInfo, ...payload}
      commit("SET_USER_INFO", userInfo)
    },

    logout({ commit }) {
      localStorage.removeItem("userToken");
      commit("RESET_STATE");
    },

    login({ commit }, payload){
      commit("SET_LOGIN", payload)
    }

  },
  modules: {
  }
})

// export const useStore = () => store

export default store
