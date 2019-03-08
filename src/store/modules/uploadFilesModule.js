import {bus} from '../../main'
import {router} from '../../router'
import Vue from 'vue';

const state = {
  uploads: {}
}

const getters = {
  getAllUploads(state) {
    return state.uploads;
  }
}

const actions = {
  addUpload(context, data) {
    context.commit('addUpload', data)
  },
  updatePercentUpload(context, data) {
    context.commit('updatePercentUpload', data)
  },
  removeUpload(context, tempID) {
    context.commit('removeUpload', tempID)
  }
}

const mutations = {
  updatePercentUpload(state, data) {
    Vue.set(state.uploads[data.tempID], 'percent', data.percent);
  },
  addUpload(state, data) {
    Vue.set(state.uploads, data.tempID, data);
  },
  removeUpload(state, tempID) {
    Vue.delete(state.uploads, tempID)
  }
}

export default {
  namespace: true,
  state,
  actions,
  mutations,
  getters
}