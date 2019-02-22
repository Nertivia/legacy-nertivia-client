import Vue from 'vue'
import {bus} from '../../main'



const state = {
    settings: {

    }
}

const getters = {
    settings(state) {
        return state.settings;
    }
}

const actions = {
    setSettings(context, settings) {
        context.commit('setSettings', settings)
    }
}

const mutations = {
    setSettings(state, settings) {
        state.settings = settings;
    }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}