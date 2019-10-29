import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/userModule';
import socketModule from './modules/socketIOModule';
import channelModule from './modules/channelModule';
import messageModule from './modules/messageModule';
import notificationsModule from './modules/notificationsModule';
import settingsModule from './modules/settingsModule';
import uploadFilesModule from './modules/uploadFilesModule';
import popoutsModule from './modules/popoutsModule/popoutsModule.js';
import emojiSuggestionModule from './modules/emojiSuggestionModule';
import serversModule from './modules/serversModule';
import membersModule from './modules/membersModule';
import {
  router
} from './../router'

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    user,
    channelModule,
    messageModule,
    notificationsModule,
    socketModule,
    settingsModule,
    uploadFilesModule,
    popoutsModule,
    emojiSuggestionModule,
    servers: serversModule,
    members: membersModule
  },
  state: {
    currentTab: 0,
  },
  getters: {
    currentTab(state) {
      return state.currentTab;
    }
  },
  actions: {
    setCurrentTab({commit}, currentTab) {
      localStorage.setItem("currentTab", currentTab);
      commit('SET_CURRENT_TAB', currentTab)
    }
  },
  mutations: {
    SET_CURRENT_TAB(state, currentTab) {
      state.currentTab = currentTab;
    }
  },
})