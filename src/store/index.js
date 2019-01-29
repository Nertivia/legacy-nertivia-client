import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/userModule';
import socketModule from './modules/socketIOModule';
import channelModule from './modules/channelModule';
import messageModule from './modules/messageModule';
import {router} from './../router'

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: { user, socketModule, channelModule, messageModule },
  state: {

  },
  getters: {

  },
  mutations: {
    sendMessage(state, message) {
      if (state.messageLogs[state.channelID] === undefined) {
        state.messageLogs[state.channelID] = {};
      }
      state.messageLogs[state.channelID][Date.now().toString()] = {channelID: state.channelID, message: message, messageID: Date.now(), status: 0};
    }

  },
  actions: {

  }
})