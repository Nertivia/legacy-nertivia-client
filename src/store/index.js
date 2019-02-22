import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/userModule';
import socketModule from './modules/socketIOModule';
import channelModule from './modules/channelModule';
import messageModule from './modules/messageModule';
import notificationsModule from './modules/notificationsModule';
import settingsModule from './modules/settingsModule';
import {router} from './../router'

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: { user, channelModule, messageModule, notificationsModule, socketModule,settingsModule },
  state: {

  },
  getters: {

  },
  mutations: {


  },
  actions: {

  }
})