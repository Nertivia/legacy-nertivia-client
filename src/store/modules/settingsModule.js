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
    },
    setGDriveLinked(context, status) {
        context.commit('GoogleDriveLinked', status)
    }
}

const mutations = {
    setSettings(state, settings) {
        state.settings = settings;
    },
    GoogleDriveLinked(state, status) {
        Vue.set(state.settings, 'GDriveLinked', status)
    }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}